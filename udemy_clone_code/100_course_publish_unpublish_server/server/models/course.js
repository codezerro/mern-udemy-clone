import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const ratingSchema = new mongoose.Schema({
  star: Number,
  text: { type: String, maxlength: 2000 },
  postedBy: { type: ObjectId, ref: "User" },
});

/**
 * IMPORTANT
 * If you get this error:
 * MongoError: E11000 duplicate key error collection: udemy.courses index: lessons.slug_1 dup key: { : null }
 * DROP COLLECTION (not just delete the collections from db)
 * then start again
 */

// lesson schema
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 160,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
      minlength: 200,
    },
    video: {},
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 160,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: {},
      required: true,
      minlength: 200,
    },
    price: {
      type: Number,
      default: 9.99,
    },
    on_sale: {
      type: Boolean,
      default: false,
    },
    display_price: {
      type: Number,
      trim: true,
    },
    image: {},
    categories: [
      {
        type: ObjectId,
        ref: "Category",
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    completed: [], // array of lesson ids that are completed
    difficulty: {
      type: String,
      default: "All Levels",
      enum: ["All Levels", "Beginner", "Intermediate", "Advance"], // enum means string objects
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    lessons: [lessonSchema],
    ratings: [ratingSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
