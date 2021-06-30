import User from "../models/user";
import Course from "../models/course";
import Qa from "../models/qa";
import queryString from "query-string";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.makeInstructor = async (req, res) => {
  try {
    // stripe connect
    // 1. find user from db
    const user = await User.findById(req.user._id).exec();
    // console.log("USER HAS STRIPE_ACCOUNT_ID ??? ", user);
    // 2. if user dont have stripe_account_id yet, create new
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({
        type: "express",
      });
      console.log("ACCOUNT ===> ", account.id);
      user.stripe_account_id = account.id;
      user.save();
    }
    // 3. create account link based on account id (for frontend to complete onboarding)
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });
    // 4. pre-fill any info such as email (optional), then send url response to frontend
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });
    // then send the account link as json response
    console.log("accountLink", accountLink); // before using queryString.stringify
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (err) {
    console.log("MAKE INSTRUCTOR ERR ", err);
  }
};

exports.getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    // console.log("USER ACCOUNT STATUS RETRIEVE =====> ", account);

    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account, // instead of just account use account
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      //   console.log("USER STRIPE_SELLER UPDATED =====> ", account);
      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
  }
};

export const currentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
    if (!user.role.includes("Instructor") || !user.stripe_seller) {
      res.sendStatus(403);
    } else {
      res.json({
        ok: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 })
      .exec();
    // console.log("instructor courses", courses);
    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};

export const studentCount = async (req, res) => {
  try {
    // console.log("req.body.courseId", req.body.courseId);
    const users = await User.find({ courses: req.body.courseId })
      .select("_id")
      .exec();
    // console.log("user count", users);
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

export const instructorBalance = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).exec();
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });

    // console.log("BALANCE =====> ", balance);
    res.json(balance);
  } catch (err) {
    console.log(err);
  }
};

export const instructorPayoutSettings = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).exec();
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller.id,
      { redirect_url: process.env.STRIPE_SETTINGS_REDIRECT_URL }
    );
    // console.log("loginLink ======> ", loginLink);
    res.json(loginLink.url);
  } catch (err) {
    console.log("stripe payout setting login link err ======> ", err);
  }
};

export const questionCount = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .select("_id")
      .exec();

    const total = await Qa.find({ courseId: courses })
      .select("courseId")
      .exec();

    // console.log("***TOTAL***", total);
    res.json(total.length);
  } catch (err) {
    console.log(err);
  }
};
