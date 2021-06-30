import User from "../models/user";
import Course from "../models/course";
import expressJwt from "express-jwt";

// UnauthorizedError, TokenExpiredError
export const requireSignin = expressJwt({
  getToken: (req) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();

    if (!user.role.includes("Admin")) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export const isInstructor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();

    if (!user.role.includes("Instructor")) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export const isAuthor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();

    if (!user.role.includes("Author")) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

/**
export const canEditDeleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).exec();
    if (course.instructor.toString() !== req.user._id.toString()) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
 */

export const isEnrolled = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const course = await Course.findOne({ slug: req.params.slug }).exec();

    // check if hotel id is found in userOrders array
    let ids = [];
    for (let i = 0; i < user.courses.length; i++) {
      ids.push(user.courses[i].toString());
    }

    if (!ids.includes(course._id.toString())) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
