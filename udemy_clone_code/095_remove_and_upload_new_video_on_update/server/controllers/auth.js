import User from "../models/user";
import jwt from "jsonwebtoken";
// import AWS from "aws-sdk";
import SES from "aws-sdk/clients/ses";
import { nanoid } from "nanoid";
import {
  completeRegistrationParams,
  forgotPasswordParams,
} from "../utils/email";
import { hashPassword, comparePassword } from "../utils/auth";

// aws config
const ses = new SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
});

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6)
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    // use .lean() on queries for improved performance
    // it returns plain json object instead of mongoose document
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    // send email with register activation link
    const jwtLink = jwt.sign(
      { name, email, password },
      process.env.JWT_REGISTER_COMPLETE,
      {
        expiresIn: "90d",
      }
    );
    const params = completeRegistrationParams(email, jwtLink);
    // send
    const emailSent = ses.sendEmail(params).promise();
    emailSent
      .then((data) => {
        // console.log(data);
        return res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const registerActivate = async (req, res) => {
  const { jwtLink } = req.body;
  if (!jwtLink) return res.status(400).send("Unauthorized");

  jwt.verify(
    jwtLink,
    process.env.JWT_REGISTER_COMPLETE,
    async function (err, decoded) {
      if (err) return res.status(400).send("Expired link. Register again");

      const { name, email, password } = jwt.decode(jwtLink);

      // hash password
      const hashedPassword = await hashPassword(password);

      try {
        // register
        const user = await new User({
          name,
          email,
          password: hashedPassword,
        }).save();
        return res.json({ ok: true });
      } catch (err) {
        console.log(err);
        return res.status(400).send("Register error. Try again.");
      }
    }
  );
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");

    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined;
    user.passwordResetCode = undefined;
    // without httpOnly, javascript will get access to cookie in browser
    // so to protect token use true
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true // only works on https
    });

    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const currentUser = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
    // console.log(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success!" });
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    // generate unique code
    const shortCode = nanoid(6).toUpperCase();
    // console.log(shortCode);
    // save shortcode as passwordResetCode in db
    let user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    ).exec();
    // console.log(found);
    if (!user) return res.status(400).send("User not found");

    // prepare for email
    const params = forgotPasswordParams(email, shortCode);
    // send
    const emailSent = ses.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    //----test
    // console.log("email, code", email, code);
    // let u = await User.findOne({ email, passwordResetCode: code });
    // console.log("FOUND USER", u);
    // return;
    //--test

    // hash password
    const hashedPassword = await hashPassword(newPassword);

    let user = await User.findOneAndUpdate(
      { email, passwordResetCode: code },
      {
        password: hashedPassword,
        passwordResetCode: "",
      },
      { new: true }
    ).exec();
    // console.log("password reset done", user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};
