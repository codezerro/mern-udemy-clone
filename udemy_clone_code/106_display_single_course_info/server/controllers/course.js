import Course from "../models/course";
import Completed from "../models/completed";
import User from "../models/user";
// import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { readFileSync } from "fs";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// const awsConfig = {
// endpoint: process.env.DO_SPACES_ENDPOINT,
// accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// region: process.env.AWS_REGION,
// apiVersion: process.env.AWS_API_VERSION,
// };

// endpoint: process.env.DO_SPACES_ENDPOINT,
// accessKeyId: process.env.DO_SPACES_KEY,
// secretAccessKey: process.env.DO_SPACES_SECRET,

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
});

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    // prepare the image
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "course-image-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // upload to s3
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data); // data.Key
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeImage = async (req, res) => {
  try {
    const { courseId } = req.params;
    // find post
    const courseFound = await Course.findById(courseId)
      .select("instructor")
      .exec();
    // is owner?
    if (req.user._id != courseFound.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    const { image } = req.body;
    // console.log("Image ===> ", image);
    // image params
    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };

    // upload to s3
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      // console.log(data); // data.Key
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req, res) => {
  try {
    // console.log("create course ===> ", req.body);
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    }).exec();
    if (alreadyExist) return res.status(400).send("Title is taken");

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user._id,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Create product failed");
    res.status(400).send("Course create failed. Try again.");
  }
};

exports.read = async (req, res) => {
  // console.log("req.params.slug", req.params.slug);
  try {
    let course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .populate("categories")
      .exec();

    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

exports.readPublic = async (req, res) => {
  // console.log("req.params.slug", req.params.slug);
  try {
    let course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .populate("categories")
      .exec();
    // console.log("COURSE PUBLIC READ => ", course);
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

export const uploadVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    // find post
    const courseFound = await Course.findById(courseId)
      .select("instructor")
      .exec();
    // is owner?
    if (req.user._id != courseFound.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    // console.log("upload video fields", fields);
    const { video } = req.files;
    if (!video) return res.status(400).send("No video");

    // image params
    const params = {
      Bucket: "course-video-bucket",
      Key: `${courseId}/${nanoid()}.${video.type.split("/")[1]}`,
      Body: readFileSync(video.path),
      ACL: "public-read",
      ContentType: video.type,
    };

    // upload to s3
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      // console.log(data); // data.Key
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    // find post
    const courseFound = await Course.findById(courseId)
      .select("instructor")
      .exec();
    // is owner?
    if (req.user._id != courseFound.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    const { Bucket, Key } = req.body;
    // upload to s3
    s3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      // console.log(data); // data.Key
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content, video } = req.body;
    // find post
    const courseFound = await Course.findById(courseId)
      .select("instructor")
      .exec();
    // is owner?
    if (req.user._id != courseFound.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    let updated = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    // console.log("UPDATED ===> ", updated);
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};

exports.update = async (req, res) => {
  const { courseId } = req.params;
  // find post
  const courseFound = await Course.findById(courseId)
    .select("instructor")
    .exec();
  // is owner?
  if (req.user._id != courseFound.instructor._id) {
    return res.status(400).send("Unauthorized");
  }

  try {
    const updated = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    }).exec();
    // console.log("COURSE UPDATED ===> ", updated);
    res.json(updated);
  } catch (err) {
    // console.log("COURSE UPDATE ERROR ----> ", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

export const removeLesson = async (req, res) => {
  const { courseId, lessonId } = req.params;
  // find post
  const courseFound = await Course.findById(courseId)
    .select("instructor")
    .exec();
  // is owner?
  if (req.user._id != courseFound.instructor._id) {
    return res.status(400).send("Unauthorized");
  }

  // console.log("slug", req.params.slug);
  let course = await Course.findByIdAndUpdate(courseId, {
    $pull: { lessons: { _id: lessonId } },
  }).exec();
  // console.log("remove lesson from this course => ", course);
  res.json({ ok: true });
};

export const updateLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, content, video, free_preview } = req.body;
    // find post
    const courseFound = await Course.findById(courseId)
      .select("instructor")
      .exec();
    // is owner?
    if (req.user._id != courseFound.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.updateOne(
      { "lessons._id": lessonId },
      {
        $set: {
          "lessons.$.title": title,
          "lessons.$.content": content,
          "lessons.$.video": video,
          "lessons.$.free_preview": free_preview,
        },
      }
    ).exec();
    console.log("updated => ", updated);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Update lesson failed");
  }
};

export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    // find post
    const courseFound = await Course.findById(courseId)
      .select("instructor")
      .exec();
    // is owner?
    if (req.user._id != courseFound.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    let course = await Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec();
    // console.log("course published", course);
    // return;
    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Publish course failed");
  }
};

export const unpublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    // find post
    const courseFound = await Course.findById(courseId)
      .select("instructor")
      .exec();
    // is owner?
    if (req.user._id != courseFound.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    let course = await Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec();
    // console.log("course unpublished", course);
    // return;
    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unpublish course failed");
  }
};

export const courses = async (req, res) => {
  // console.log("all courses");
  const all = await Course.find({ published: true })
    .limit(11)
    // .select("-lessons")
    .populate("instructor", "_id name")
    .populate("categories", "_id name")
    .exec();
  // console.log("============> ", all);
  res.json(all);
};

export const checkEnrollment = async (req, res) => {
  const { courseId } = req.params;
  // find courses of the currently logged in user
  const user = await User.findById(req.user._id).exec();
  // check if hotel id is found in userOrders array
  let ids = [];
  for (let i = 0; i < user.courses.length; i++) {
    ids.push(user.courses[i].toString());
  }
  console.log("USER COURSE IDS => ", ids);
  res.json({
    status: ids.includes(courseId),
    course: await Course.findById(courseId).exec(),
  });
};

export const freeEnrollment = async (req, res) => {
  try {
    // check if course is free or paid
    const course = await Course.findById(req.params.courseId).exec();
    if (course.paid) return;

    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    );
    // console.log("NEW ENROLLMENT CREATE", result);
    res.json({
      message: "Congratulations! You have successfully enrolled",
      course: course,
    });
  } catch (err) {
    console.log("ENROLLMENT CREATE ERR", err);
    return res.status(400).send("Enrollment create failed");
  }
};

export const paidEnrollment = async (req, res) => {
  try {
    // check if course is free or paid
    // IMPORTANT - make sure to populate instructor or stripe will give you error
    // Can only apply an application_fee_amount when the PaymentIntent is attempting a direct payment
    const course = await Course.findById(req.params.courseId)
      .populate("instructor")
      .exec();
    console.log(
      "COURSE INSTRUCTOR STRIPE_ACCOUNT_ID",
      course.instructor.stripe_account_id
    );
    if (!course.paid) return;

    // application fee (30%)
    const fee = (course.price * 30) / 100;
    // create stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // purchase details
      line_items: [
        {
          name: course.name,
          amount: Math.round(course.price.toFixed(2) * 100), // in cents
          currency: "usd",
          quantity: 1,
        },
      ],
      // charge buyer and transfer remaining balance to seller (after fee)
      payment_intent_data: {
        application_fee_amount: Math.round(fee.toFixed(2) * 100),
        transfer_data: {
          destination: course.instructor.stripe_account_id,
        },
      },
      // redirect url after successful payment
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });
    console.log("SESSION ID => ", session.id);
    // save user's the stripe session
    await User.findByIdAndUpdate(req.user._id, {
      stripeSession: session,
    }).exec();
    // send response to frontend
    res.send(session.id);
  } catch (err) {
    console.log("ENROLLMENT CREATE ERR", err);
    return res.status(400).send("Enrollment create failed");
  }
};

export const stripeSuccess = async (req, res) => {
  try {
    // find course
    const course = await Course.findById(req.params.courseId).exec();
    // get user from db to get stripeSession
    const user = await User.findById(req.user._id).exec();
    // if no stripe session return
    if (!user.stripeSession.id) return res.sendStatus(400);
    // retrieve stripe session
    const session = await stripe.checkout.sessions.retrieve(
      user.stripeSession.id
    );
    // console.log("SESSION => ", session);
    // if session payment status is paid, push course to user's courses []
    if (session.payment_status === "paid") {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { courses: course._id },
        $set: { stripeSession: {} },
      }).exec();
    }
    res.json({ success: true, course });
  } catch (err) {
    console.log("stripe success err", err);
    res.json({ success: false });
  }
};

export const userCourses = async (req, res) => {
  // console.log("all courses");
  const user = await User.findById(req.user._id).exec();
  const courses = await Course.find({ _id: { $in: user.courses } })
    .populate("instructor", "_id name")
    .sort({ createdAt: -1 })
    .exec();
  // console.log("USER COURSES ============> ", courses);
  res.json(courses);
};

export const markCompleted = async (req, res) => {
  const { courseId, lessonId } = req.body;
  // find if user with that course is already created
  const existing = await Completed.findOne({
    user: req.user._id,
    course: courseId,
  }).exec();
  // console.log("EXISTING ", existing);
  if (existing) {
    // console.log("UPDATE");
    const updated = await Completed.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      {
        $addToSet: { lessons: lessonId },
      }
    ).exec();
    // console.log("UPDATED", updated);
    res.json({ ok: true });
  } else {
    const created = await new Completed({
      user: req.user._id,
      course: courseId,
      lessons: lessonId,
    }).save();
    // console.log("CREATED NEW COMPLETED", created);
    res.json({ ok: true });
  }
};

export const listCompleted = async (req, res) => {
  try {
    let list = await Completed.findOne({
      user: req.user._id,
      course: req.body.courseId,
    }).exec();
    // console.log("LIST ===> ", list);
    list && res.json(list.lessons);
  } catch (err) {
    console.log(err);
  }
};

export const markIncomplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    const updated = await Completed.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      {
        $pull: { lessons: lessonId },
      }
    ).exec();
    // console.log("UPDATED", updated);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
