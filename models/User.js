import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
