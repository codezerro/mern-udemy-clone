const mongoose = require("mongoose");

const { ObjectId } = mongoose;

const supportSchema = new mongoose.Schema(
  {
    course_url: {
      type: String,
      trim: true,
      max: 512,
    },
    message: {
      type: String,
      trim: true,
      required: true,
      max: 5000,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Category", supportSchema);
export default mongoose.model("Support", supportSchema);
