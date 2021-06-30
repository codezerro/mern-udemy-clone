import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middlewares
import { requireSignin, isInstructor } from "../middlewares";
// controller
const {
  makeInstructor,
  getAccountStatus,
  currentInstructor,
  instructorCourses,
  studentCount,
  instructorBalance,
  instructorPayoutSettings,
  questionCount,
} = require("../controllers/instructor");

// qa
router.get("/instructor/question-count", requireSignin, questionCount);

router.post("/make-instructor", requireSignin, makeInstructor);
router.post("/get-account-status", requireSignin, getAccountStatus);
router.get("/current-instructor", requireSignin, currentInstructor);
// courses
router.get(
  "/instructor-courses",
  requireSignin,
  isInstructor,
  instructorCourses
);
// student count
router.post("/instructor/student-count", requireSignin, studentCount);
router.get("/instructor/balance", requireSignin, instructorBalance);
router.get(
  "/instructor/payout-settings",
  requireSignin,
  instructorPayoutSettings
);

module.exports = router;
