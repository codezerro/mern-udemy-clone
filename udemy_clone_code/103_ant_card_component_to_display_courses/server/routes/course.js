import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middlewares
import { requireSignin, isInstructor, isEnrolled } from "../middlewares";
// controller
const {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  update,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  courses,
  freeEnrollment,
  checkEnrollment,
  paidEnrollment,
  stripeSuccess,
  userCourses,
  markCompleted,
  listCompleted,
  markIncomplete,
  readPublic,
} = require("../controllers/course");

// image
router.post("/course/upload-image", requireSignin, uploadImage);
router.post("/course/remove-image/:courseId", requireSignin, removeImage);
// video
router.post(
  "/course/upload-video/:courseId",
  requireSignin,
  formidable({ maxFileSize: 500 * 1024 * 1024 }),
  uploadVideo
);
router.post("/course/remove-video/:courseId", requireSignin, removeVideo);
// course
router.post("/course", requireSignin, isInstructor, create);
router.get("/course/:slug", read);
router.get("/course/public/:slug", readPublic);
// update course
router.put("/course/:courseId", requireSignin, update);
// lessons
router.post("/course/lesson/:courseId", requireSignin, addLesson);
// delete
router.post("/course/:courseId/:lessonId", requireSignin, removeLesson);
// update
router.post("/course/lesson/:courseId/:lessonId", requireSignin, updateLesson);
// publish course
router.put("/course/publish/:courseId", requireSignin, publishCourse);
// unpublish course
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);
// get routes
router.get("/courses", courses);
// enroll
router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);
// stripe success
router.get("/stripe-success/:courseId", requireSignin, stripeSuccess);
// user courses
router.get("/user-courses", requireSignin, userCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, read);
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/list-completed", requireSignin, listCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);

module.exports = router;
