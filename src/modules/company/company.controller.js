import companyModel from "../../../connectionDB/models/company.model.js";
import asyncHandler from "../../utils/globalHandlingError.js";
import AppError from "../../utils/appError.js";
import jobModel from "../../../connectionDB/models/job.model.js";
import applicationModel from "../../../connectionDB/models/application.model.js";

//================================================addCompany================================================//
/**
 * Add a new company to the database.
 * @param {Request} req - Express Request object containing company details.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success or failure of company creation.
 */
export const addCompany = asyncHandler(async (req, res, next) => {
  const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;

  const companyEmailExist = await companyModel.findOne({ companyEmail });
  if (companyEmailExist) {
    return next(new AppError("User already exists", 501));
    //Check if the email received already exists in the DB (email:unique)
  }
  const company = await companyModel.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    company_HR: req.user.id, //The ID of the user adding the company is automatically stored in company_HR
  });
  return res.status(201).json({ msg: "User added successfully", company });
});

//================================================updateCompany================================================//
/**
 * Update an existing company in the database.
 * @param {Request} req - Express Request object containing company details and user information.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success or failure of company update.
 */
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
  const company = await companyModel.findOneAndUpdate(
    { _id: id, company_HR: req.user.id }, //Checks if the user requesting the update is the owner of the Company
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    { new: true } //display the updated data
  );
  if (!company) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  return res.status(200).json({ msg: "done", company });
});

//================================================deleteUser================================================//
/**
 * Delete an existing company from the database.
 * @param {Request} req - Express Request object containing company ID and user information.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success or failure of company deletion.
 */
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  const company = await companyModel.findOneAndDelete(
    { _id: id, company_HR: req.user.id }, //Checks if the user requesting the delete is the owner of the Company
    { new: true }
  );
  if (!company) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  return res.status(200).json({ msg: "done" });
});
//================================================Get Company data ================================================//
/**
 * Get company details and associated jobs.
 * @param {Request} req - Express Request object containing company ID.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response containing company details and associated jobs.
 */
export const getCompanyData = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const company = await companyModel.findById(id); //find the company only by ID
  if (!company) {
    return next(new AppError("Company not found", 501));
  }
  //Displays the jobs associated with the company's provided ID
  const job = await jobModel.find({ addedBy: req.user.id });
  return res.status(200).json({ msg: "Done", company, job });
});
//================================================Search Company By Name ================================================//
/**
 * Get company details by company name.
 * @param {Request} req - Express Request object containing company name in query.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response containing company details.
 */
export const getCompanyByName = asyncHandler(async (req, res, next) => {
  const { companyName } = req.query;
  //Specifying the field to find with, $options: 'i' : to enable regex case insensitive
  const company = await companyModel.find({ companyName: { $regex: companyName, $options: "i" } });
  if (!company) {
    return next(new AppError("Company not found", 501));
  }
  return res.status(200).json({ msg: "Done", company });
});

//================================================Get all applications for specific Job ================================================//
/**
 * Get all applications for jobs owned by the company's HR.
 * @param {Request} req - Express Request object containing company ID in params.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response containing company details, jobs, and applications.
 */
export const getAllApplicationsForJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the company by ID and check if the user making the request is the owner of the company
  const company = await companyModel.findById(id);
  if (!company || company.company_HR.toString() !== req.user.id) {
    return next(new AppError("Company not found or not authorized", 501));
  }
  // Find all jobs added by the company owner
  const jobs = await jobModel.find({ addedBy: req.user.id });
  if (!jobs.length) {
    return next(new AppError("No jobs found for this company", 501));
  }

  // Get all applications for the jobs added by the company HR
  const jobIds = jobs.map((job) => job._id); //use map to create a new array and extract the _id from the job collection and store it
  // Populate the user details from the user collection for each application. We only need name, email, userTechSkills, and userSoftSkills fields.
  // $in operator is used to match the jobId stored in map array jobIds
  const applications = await applicationModel.find({ jobId: { $in: jobIds } }).populate({
    path: "userId",
    select: "name email userTechSkills userSoftSkills",
  });

  return res.status(200).json({ msg: "Done", company, jobs, applications });
});
