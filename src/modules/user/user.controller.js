import userModel from "../../../connectionDB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendResetPasswordEmail from "../../services/resetPassword.js";
import { asyncHandler } from "../../utils/globalHandlingError.js";
import { AppError } from "../../utils/appError.js";

//================================================signUp================================================//
/**
 * Register a new user.
 * @param {Request} req - Express Request object containing user details.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success or failure of user registration.
 */
export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, password, email, recoveryEmail, DOB, mobileNumber, role } = req.body;

  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(new AppError("User already exists", 501));
    //Check if the email received is already stored in the DB
  }
  const hash = bcrypt.hashSync(password, Number(process.env.saltRounds)); //Password received is stored in the DB hashed
  const user = await userModel.create({
    firstName,
    lastName,
    password: hash,
    email,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  });
  return res.status(201).json({ msg: "User added successfully", user });
});
//================================================signIn================================================//
/**
 * Sign in a user with email, recovery email, or mobile number and password.
 * @param {Request} req - Express Request object containing identifier (email, recoveryEmail, mobileNumber) and password.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response containing a JWT token on successful sign-in.
 */
export const signIn = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body; //Define identifier as a variable that can hold more than one value
  const user = await userModel.findOne({
    $or: [
      { email: identifier },
      { recoveryEmail: identifier }, //Defining the values that the identifier is holding
      { mobileNumber: identifier }, //Accepts signIn from either email, recoveryEmail,mobileNumber
    ],
  });

  if (!user) {
    return next(new AppError("User Not Found", 400));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid Password", 501)); //Comparing password submitted with the password stored in the DB
  }
  user.status = "Online";
  await user.save(); //When a User signs In his status automatically changes from OFFLINE to ONLINE
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      recoveryEmail: user.recoveryEmail,
      mobileNumber: user.mobileNumber,
      status: user.status,
      role: user.role,
    },
    "viri"
  ); //Define the payload that the token will store and callback when the token is received

  return res.status(200).json({ msg: "done", token });
});

//================================================updateUser================================================//
/**
 * Update user details by ID.
 * @param {Request} req - Express Request object containing user ID and updated user details.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response with updated user details on success.
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body;
  const user = await userModel.findOneAndUpdate({ _id: id }, { email, mobileNumber, recoveryEmail, DOB, lastName, firstName }, { new: true });
  if (!user) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  return res.status(200).json({ msg: "done", user });
});

//================================================deleteUser================================================//
/**
 * Delete user by ID.
 * @param {Request} req - Express Request object containing user ID.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating successful deletion.
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  const user = await userModel.findOneAndDelete({ _id: id }, { new: true });
  if (!user) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  return res.status(200).json({ msg: "done" });
});
//================================================Get user account data ================================================//
/**
 * Get user by ID.
 * @param {Request} req - Express Request object containing user ID in params.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response with user details or error message.
 */
export const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.find({ _id: id });
  return res.status(200).json({ msg: "Done", user });
});

//================================================Get profile data for another user===============================================//
/**
 * Fetches user profile details by user ID.
 * @param {Request} req - Express Request object containing user ID in params.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response with user profile details (excluding password) or error message.
 */
export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await userModel.findById(userId).select("-password"); //find user with the user.Id and display it's information without the password field
  return res.status(200).json({ msg: "done", user: user });
});
//================================================updatePassword================================================//
/**
 * Updates user password based on current password verification.
 * @param {Request} req - Express Request object containing currentPassword and newPassword in body.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success message or error.
 */
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body; //take currentPassword and the newPassword from body
  const user = await userModel.findById(req.user.id); // find user by ID
  if (!user) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password); //Comparing the currentPassword entered stored in the DB
  if (!isMatch) {
    return next(new AppError("Invalid Password", 501));
  }
  const hash = bcrypt.hashSync(newPassword, Number(process.env.saltRounds)); // After confirming they match, then hash the newPassword submitted
  user.password = hash; //Storing newPassword in the DB
  await user.save(); //Save User Data
  return res.status(200).json({ msg: "done", user });
});

//================================================forgotPassword================================================//
/**
 * Requests a password reset for a user based on the provided email.
 * Generates and sends an OTP (One-Time Password) for password reset verification.
 * @param {Request} req - Express Request object containing email in body.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success message or error.
 */
export const requestPasswordReset = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  const otp = crypto.randomInt(100000, 999999).toString(); //Generate OTP code that is 6 random digits
  const otpExpiration = Date.now() + 10 * 60 * 60; //set Time of expiration of the OTP
  user.resetPasswordOTP = otp; //Setting resetPasswordOTP of the User requesting the password reset with the OTP sent by email
  user.resetPasswordOTPExpires = otpExpiration; //Setting expiration date of the OTP in the resetPasswordOTPExpires of the user document
  await user.save();
  await sendResetPasswordEmail(user.email, otp); //calling the function sendResetPasswordEmail and giving it the parameters of the user email along with the OTP
  return res.status(200).json({ msg: "OTP sent successfully" });
});

//================================================verifyOtpAndResetPassword======================================//
/**
 * Verifies the OTP (One-Time Password) provided by the user for password reset,
 * and updates the user's password if the OTP is valid and not expired.
 * @param {Request} req - Express Request object containing email, otp, and newPassword in body.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success message or error.
 */
export const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body; //Getting email, OTP sent by email, newPassword from body
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp || user.resetPasswordOTPExpires < Date.now()) {
    return next(new AppError("Invalid or expired OTP", 400));
    //Checking if the user didn't provide an OTP for the request
    // or if the OTP provided is incorrect or expired
  }
  const hash = await bcrypt.hash(newPassword, Number(process.env.saltRounds)); //Hash the new user Password
  user.password = hash; //store user Password with the newPassword
  user.resetPasswordOTP = null; //Resetting both resetPasswordOTP, resetPasswordOTPExpires of the user Document to null
  user.resetPasswordOTPExpires = null;
  await user.save();

  return res.status(200).json({ msg: "Password reset successfully" });
});

//================================================get all recovery email accounts===============================================//
/**
 * Retrieves all user accounts associated with a specific recovery email address.
 * @param {Request} req - Express Request object containing recoveryEmail parameter.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response containing user accounts matching the recovery email.
 */
export const getAllRecoveryEmailAccounts = asyncHandler(async (req, res, next) => {
  const { recoveryEmail } = req.params; //Receive the recoveryEmail from params
  const user = await userModel.find({ recoveryEmail }); //find all users with the same recoveryEmail
  if (!user) {
    return next(new AppError("User not found", 400));
  }
  return res.status(200).json({ msg: "Done", user });
});
