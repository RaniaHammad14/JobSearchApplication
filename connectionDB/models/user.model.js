import mongoose from "mongoose";
import  systemRoles  from "../../src/utils/systemRoles.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    recoveryEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    DOB: {
      type: Date,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(systemRoles),
      default: "user",
    },

    status: {
      type: String,
      required: true,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
    resetPasswordOTP: String, // To store OTP
    resetPasswordOTPExpires: Date,
  },
  { timestamps: true,  }
);

userSchema.virtual("username").get(function () {
  return this.firstName + this.lastName;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const userModel = mongoose.model("user", userSchema);
export default userModel;
