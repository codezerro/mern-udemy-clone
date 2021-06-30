import User from "../models/user";
import Course from "../models/course";
import Support from "../models/support";
import SES from "aws-sdk/clients/ses";
// import AWS from "aws-sdk";
import { enrollIssueResolved } from "../utils/email";

// aws config
const ses = new SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
});

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const currentAdmin = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
    if (!user.role.includes("Admin")) {
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

export const listUsers = async (req, res) => {
  const users = await User.find({})
    .select("-password")
    .populate("courses", "_id slug name")
    .exec();
  res.json(users);
};

export const refreshUserStatus = async (req, res) => {
  try {
    const { userId, courseUrl } = req.body;
    const slug = courseUrl.split("/").pop().split(";")[0];

    const user = await User.findById(userId).exec();
    // find course based on course url/slug submitted by user
    const course = await Course.findOne({ slug }).exec();

    // if no stripesession return
    if (!user || !user.stripesession || !user.stripesession.id)
      return res.json({ message: "User has no stripe session" });
    // retrieve stripe session
    const session = await stripe.checkout.sessions.retrieve(
      user.stripesession.id
    );
    // if session payment status is paid, push course to user's courses []
    if (session.payment_status === "paid") {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { courses: course._id },
        $set: { stripesession: {} },
      }).exec();
      // then send email to user that it has been resolved
      const params = enrollIssueResolved(user.name, user.email);
      // send
      const emailSent = ses.sendEmail(params).promise();
      emailSent
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    res.json({
      message: "Stripe session is refreshed and sent success email to user",
      course,
    });
  } catch (err) {
    console.log(err);
  }
};

export const allIssues = async (req, res) => {
  const all = await Support.find()
    .populate("postedBy", "_id name email")
    .exec();
  res.json(all);
};

export const removeIssue = async (req, res) => {
  try {
    const resolved = await Support.findByIdAndRemove(req.params.issueId).exec();
    // console.log("__resolved__", resolved);
    return res.json(resolved);
  } catch (err) {
    console.log(err);
  }
};
