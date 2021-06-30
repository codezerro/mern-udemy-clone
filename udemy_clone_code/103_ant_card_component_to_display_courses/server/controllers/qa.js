import Qa from "../models/qa";
import Course from "../models/course";
import slugify from "slugify";

export const create = async (req, res) => {
  try {
    const { title, userId } = req.body;
    if (userId != req.user._id) return res.status(400).send("Unauthorized");

    const qa = await new Qa({
      slug: slugify(title),
      ...req.body, // title, description, courseId, lessonId
      postedBy: req.user._id,
    }).save();

    res.json(qa);
  } catch (err) {
    console.log(err.code);
    if (err.code == 11000) {
      res.status(400).send("Title is taken");
    } else {
      res.status(400).send("Post question failed. Try again.");
    }
  }
};

export const lessonQa = async (req, res) => {
  const { lessonId } = req.params;
  const qas = await Qa.find({ lessonId })
    .sort({ createdAt: -1 })
    .populate("postedBy", "_id name")
    // .populate("courseId", "name slug image")
    .populate({
      path: "answers.postedBy",
      select: "-password -stripeSession -role -courses",
    })
    .exec();
  // console.log("QAS WITH IMAGE POPULATED =====> ", qas);
  res.json(qas);
};

export const updateLessonQa = async (req, res) => {
  try {
    // console.log("update_lesson_question", req.body);
    let poster = req.body.postedBy._id;
    let loggedin = req.user._id;
    if (poster != loggedin) return res.status(400).send("Unauthorized");

    const lessonQa = await Qa.findByIdAndUpdate(req.body._id, req.body).exec();
    console.log("UPDATED => ", lessonQa);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Edit question failed. Try again.");
  }
};

export const deleteLessonQa = async (req, res) => {
  try {
    const { lessonId, postedBy } = req.params;

    if (postedBy != req.user._id) return res.status(400).send("Unauthorized");
    // console.log(lessonId);
    const lessonQa = await Qa.findByIdAndRemove(lessonId).exec();
    // console.log("DELETED LESSON", lessonQa);
    res.json(lessonQa);
  } catch (err) {
    console.log(err);
    res.status(400).send("Delete question failed. Try again.");
  }
};

export const addAnswer = async (req, res) => {
  // console.log("ADD ANSWER", req.body);
  // return;
  try {
    const { questionId, content, userId } = req.body;
    if (userId != req.user._id) return res.status(400).send("Unauthorized");

    let updated = await Qa.findByIdAndUpdate(
      questionId,
      {
        $push: { answers: { content, postedBy: req.user._id } },
      },
      { new: true }
    )
      .populate("postedBy", "_id name")
      .exec();
    // console.log("UPDATED with added answer ===> ", updated);
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};

export const editAnswer = async (req, res) => {
  try {
    const { _id, content } = req.body;
    let poster = req.body.postedBy._id;
    let loggedin = req.user._id;
    if (poster != loggedin) return res.status(400).send("Unauthorized");

    const updated = await Qa.updateOne(
      { "answers._id": _id },
      {
        $set: {
          "answers.$.content": content,
        },
      }
    ).exec();
    // console.log("UPDATED with added answer ===> ", updated);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const { answerId, postedBy } = req.params;
    // console.table({ answerId, postedBy });

    if (postedBy != req.user._id) return res.status(400).send("Unauthorized");

    let answer = await Qa.findOneAndUpdate(
      { "answers._id": answerId },
      {
        $pull: { answers: { _id: answerId } },
      }
    ).exec();
    // console.log("remove lesson from this course => ", course);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unauthorized");
  }
};

// export const deleteAnswerByInstructor = async (req, res) => {
//   try {
//     const { answerId } = req.params;
//     console.table({ answerId });

//     // find the qa based on answer id = courseId
//     const qa = await Qa.findOne({
//       answers: { $elemMatch: { _id: answerId } },
//     })
//       .select("courseId")
//       .exec();
//     // console.log("FOUDN QA BASED ON ANSWER_ID => ", qa.courseId);
//     // find the current instructor and all his courses = courses array
//     const course = await Course.findById(qa.courseId)
//       .select("instructor")
//       .exec();
//     // console.log("COURSE => ", course);
//     // console.log('REQ.USER._ID', req.user._id)
//     if (course.instructor != req.user._id)
//       return res.status(400).send("Unauthorized");

//     let answer = await Qa.findOneAndUpdate(
//       { "answers._id": answerId },
//       {
//         $pull: { answers: { _id: answerId } },
//       }
//     ).exec();
//     // console.log("remove lesson from this course => ", course);
//     res.json({ ok: true });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send("Unauthorized");
//   }
// };

export const markQaResolved = async (req, res) => {
  try {
    const { questionId, postedBy } = req.body;
    if (postedBy != req.user._id) return res.status(400).send("Unauthorized");

    const qa = await Qa.findByIdAndUpdate(questionId, {
      resolved: true,
    }).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Mark resolved failed. Try again.");
  }
};

export const markQaUnresolved = async (req, res) => {
  try {
    const { questionId, postedBy } = req.body;
    if (postedBy != req.user._id) return res.status(400).send("Unauthorized");

    const qa = await Qa.findByIdAndUpdate(questionId, {
      resolved: false,
    }).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Mark resolved failed. Try again.");
  }
};

export const getUserQas = async (req, res) => {
  try {
    const qas = await Qa.find({ postedBy: req.user._id })
      .populate({
        path: "answers.postedBy",
        select: "-password -stripeSession -role -courses",
      })
      .populate("courseId", "_id slug name image")
      .sort({ createdAt: -1 })
      .exec();
    // console.log("USER QAS => ", qas);
    res.json(qas);
  } catch (err) {
    console.log(err);
  }
};

export const updateQuestion = async (req, res) => {
  try {
    // console.log("update_user_question", req.body);
    // return;
    let poster = req.body.postedBy;
    let loggedin = req.user._id;
    if (poster != loggedin) return res.status(400).send("Unauthorized");

    const lessonQa = await Qa.findByIdAndUpdate(req.body._id, req.body).exec();
    console.log("UPDATED => ", lessonQa);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Edit question failed. Try again.");
  }
};

export const getInstructorQas = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .select("_id")
      .exec();

    const qas = await Qa.find({ courseId: courses })
      .populate(
        "postedBy",
        "-password -stripeSession -role -courses -stripe_seller"
      )
      .populate({
        path: "answers.postedBy",
        select: "-password -stripeSession -role -courses -stripe_seller",
      })
      .populate("courseId", "_id slug name image")
      .sort({ createdAt: -1 })
      .exec();
    // console.log("USER QAS => ", qas);
    res.json(qas);
  } catch (err) {
    console.log(err);
  }
};

/**
 * by instructor
 */

export const deleteAnswerByInstructor = async (req, res) => {
  try {
    const { answerId } = req.params;
    // console.table({ answerId });

    // find the qa based on answer id = courseId
    const qa = await Qa.findOne({
      answers: { $elemMatch: { _id: answerId } },
    })
      .select("courseId")
      .exec();
    // console.log("FOUND QA BASED ON ANSWER_ID => ", qa.courseId);
    // find the current instructor and all his courses = courses array
    const course = await Course.findById(qa.courseId)
      .select("instructor")
      .exec();
    // console.log("COURSE => ", course);
    // console.log('REQ.USER._ID', req.user._id)
    if (course.instructor != req.user._id)
      return res.status(400).send("Unauthorized");

    let answer = await Qa.findOneAndUpdate(
      { "answers._id": answerId },
      {
        $pull: { answers: { _id: answerId } },
      }
    ).exec();
    // console.log("remove lesson from this course => ", course);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unauthorized");
  }
};

// CONTINUE WORKING ON DELETE ANYONE'S QA BY INSTRUCTOR

export const deleteLessonQaByInstructor = async (req, res) => {
  try {
    const { questionId } = req.params;

    // find the qa based on qid = courseId
    const qa = await Qa.findById(questionId).select("courseId").exec();

    const course = await Course.findById(qa.courseId)
      .select("instructor")
      .exec();

    if (course.instructor != req.user._id)
      return res.status(400).send("Unauthorized");

    const removed = await Qa.findByIdAndRemove(questionId).exec();
    // console.log("DELETED LESSON", lessonQa);
    res.json(removed);
  } catch (err) {
    console.log(err);
    res.status(400).send("Delete question failed. Try again.");
  }
};

export const markQaResolvedByInstructor = async (req, res) => {
  try {
    const { questionId } = req.body;

    // find the qa based on qid = courseId
    const qas = await Qa.findById(questionId).select("courseId").exec();

    const course = await Course.findById(qas.courseId)
      .select("instructor")
      .exec();

    if (course.instructor != req.user._id)
      return res.status(400).send("Unauthorized");

    const qa = await Qa.findByIdAndUpdate(questionId, {
      resolved: true,
    }).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Mark resolved failed. Try again.");
  }
};

export const markQaUnresolvedByInstructor = async (req, res) => {
  try {
    const { questionId } = req.body;

    // find the qa based on qid = courseId
    const qas = await Qa.findById(questionId).select("courseId").exec();

    const course = await Course.findById(qas.courseId)
      .select("instructor")
      .exec();

    if (course.instructor != req.user._id)
      return res.status(400).send("Unauthorized");

    const qa = await Qa.findByIdAndUpdate(questionId, {
      resolved: false,
    }).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Mark resolved failed. Try again.");
  }
};
