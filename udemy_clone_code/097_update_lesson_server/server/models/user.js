import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    // email_verified: {
    //   type: Boolean,
    //   default: false,
    // },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    passwordResetCode: {
      data: String,
      default: "",
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Author", "Instructor", "Admin"],
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
    courses: [
      {
        type: ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

// userSchema.pre("save", function (next) {
//   let user = this;
//   // hash password only when registering for the first time or when updating
//   if (user.isModified("password")) {
//     return bcrypt.hash(user.password, 12, function (err, hash) {
//       if (err) {
//         console.log("BCRYPT HASH ERR ", err);
//         return next(err);
//       }
//       user.password = hash;
//       return next();
//     });
//   } else {
//     return next();
//   }
// });

// userSchema.methods.comparePassword = function (password, next) {
//   bcrypt.compare(password, this.password, function (err, match) {
//     if (err) {
//       console.log("COMPARE PASSWORD ERR", err);
//       return next(err, false);
//     }
//     // if no err, we get null
//     console.log("MATCH PASSWORD", match);
//     return next(null, match); // true
//   });
// };

export default mongoose.model("User", userSchema);
