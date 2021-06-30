const mongoose = require("mongoose");

const { ObjectId } = mongoose;

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
      max: 56,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const qaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      max: 512,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      max: 20000,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    courseId: {
      type: ObjectId,
      ref: "Course",
    },
    lessonId: {
      type: ObjectId,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Qa", qaSchema);
