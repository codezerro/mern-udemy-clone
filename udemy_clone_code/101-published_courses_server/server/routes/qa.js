import express from "express";

const router = express.Router();

// middlewares
import { requireSignin } from "../middlewares";
// controller
const {
  create,
  lessonQa,
  updateLessonQa,
  deleteLessonQa,
  addAnswer,
  editAnswer,
  deleteAnswer,
  markQaResolved,
  markQaUnresolved,
  getUserQas,
  updateQuestion,
  getInstructorQas,
  deleteAnswerByInstructor,
  deleteLessonQaByInstructor,
  markQaResolvedByInstructor,
  markQaUnresolvedByInstructor,
} = require("../controllers/qa");

// qa for user dashboard
router.get("/user/qas", requireSignin, getUserQas);
router.put("/user/qa/:questionId", requireSignin, updateQuestion);

// qa for instructor dashboard
router.get("/instructor/qas", requireSignin, getInstructorQas);

// answers
router.put("/qa/answer", requireSignin, addAnswer);
router.put("/qa/answer-edit", requireSignin, editAnswer);

// delete answer by instructor
router.delete(
  "/qa/answer-delete-by-instructor/:answerId",
  requireSignin,
  deleteAnswerByInstructor
);

router.delete(
  "/qa/answer-delete/:answerId/:postedBy",
  requireSignin,
  deleteAnswer
);
// lessons <> questions
router.post("/qa", requireSignin, create);

// by instructor
router.put(
  "/qa/mark-resolved-by-instructor",
  requireSignin,
  markQaResolvedByInstructor
);
router.put(
  "/qa/mark-unresolved-by-instructor",
  requireSignin,
  markQaUnresolvedByInstructor
);

router.put("/qa/mark-resolved", requireSignin, markQaResolved);
router.put("/qa/mark-unresolved", requireSignin, markQaUnresolved);
router.get("/qa/:lessonId", lessonQa);
router.put("/qa/:lessonId", requireSignin, updateLessonQa);

// delete by instructor
router.delete(
  "/qa-by-instructor/:questionId",
  requireSignin,
  deleteLessonQaByInstructor
);
router.delete("/qa/:lessonId/:postedBy", requireSignin, deleteLessonQa);

module.exports = router;
