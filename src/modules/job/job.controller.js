import jobModel from "../../../connectionDB/models/job.model.js";
import asyncHandler from "../../utils/globalHandlingError.js";
import AppError from "../../utils/appError.js";
import companyModel from "../../../connectionDB/models/company.model.js";
import applicationModel from "../../../connectionDB/models/application.model.js";

//================================================addJob================================================//
/**
 * Add a new job posting to the database.
 * @param {Request} req - Express Request object containing job details in the request body.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success or failure of job creation.
 */
export const addJob = asyncHandler(async (req, res, next) => {
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
  const job = await jobModel.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: req.user.id, //The ID of the user adding the job is automatically stored in addedBy
  });
  return res.status(201).json({ msg: "Job added successfully", job });
});

//================================================updateJob================================================//
/**
 * Update details of a job posting.
 * @param {Request} req - Express Request object containing job ID and updated details in the request body.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success or failure of job update.
 */
export const updateJob = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
  const job = await jobModel.findOneAndUpdate(
    { _id: id, addedBy: req.user.id }, //Checks if the user requesting the update is the one created the job
    { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills },
    { new: true } //display the updated data
  );
  if (!job) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  return res.status(200).json({ msg: "done", job });
});

//================================================deleteJob================================================//
/**
 * Delete a job posting.
 * @param {Request} req - Express Request object containing job ID in the request body.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success or failure of job deletion.
 */
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  //Checks if the user requesting the delete is the one created the job
  const job = await jobModel.findOneAndDelete({ _id: id, addedBy: req.user.id }, { new: true });
  if (!job) {
    return next(new AppError("User not found Or Not Authorized", 501));
  }
  return res.status(200).json({ msg: "done", job });
});

//================================================getAllJobs================================================//
/**
 * Retrieve all jobs with associated company information.
 * @param {Request} req - Express Request object (unused in this function).
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response containing jobs with associated company details.
 */
export const getAllJobs = asyncHandler(async (req, res, next) => {
  const jobs = await jobModel.find();
  const companies = await companyModel.find();
  // Create a map of companies by their ID for lookup
  const companyMap = companies.reduce((map, company) => {
    map[company.company_HR] = company;
    return map;
  }, {});
  // Add company details to each job based on the addedBy
  const jobsWithCompanyInfo = jobs.map((job) => {
    const company = companyMap[job.addedBy._id];
    return {
      ...job._doc, // Use _doc to access the original document fields
      companyName: company?.companyName,
      companyEmail: company?.companyEmail,
      industry: company?.industry,
    };
  });
  if (!jobsWithCompanyInfo.length) {
    return next(new AppError("No Jobs found", 404));
  }
  return res.status(200).json({ msg: "done", jobsWithCompanyInfo });
});

//================================================getAllJobsForSpecificCompany================================================//
/**
 * Retrieve all jobs associated with a specific company.
 * @param {Request} req - Express Request object containing query parameters.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response containing company details and associated jobs.
 */
export const getAllJobsForCompany = asyncHandler(async (req, res, next) => {
  const { companyName } = req.query;
  //Find the company matching the companyName received
  const company = await companyModel.findOne({ companyName: companyName });
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  //Find all jobs added by the company (company_HR)
  const jobs = await jobModel.find({ addedBy: company.company_HR });
  if (!jobs) {
    return next(new AppError("No Jobs found for this company", 404));
  }
  return res.status(200).json({ msg: "done", company, jobs });
});

//================================================GetallJobsThatMatchFilters================================================//
/**
 * Filter jobs based on specified criteria.
 * @param {Request} req - Express Request object containing filter criteria in the body.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response containing filtered jobs.
 */
export const jobFilter = asyncHandler(async (req, res, next) => {
  const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.body;
  //Using the $or method to provide an array with all the filters that can be received
  //Either one or more can be applied
  const job = await jobModel.find({
    $or: [
      { workingTime: workingTime },
      { jobLocation: jobLocation },
      { seniorityLevel: seniorityLevel },
      { jobTitle: jobTitle },
      { technicalSkills: technicalSkills },
    ],
  });
  return res.status(201).json({ msg: "Done", job });
});
//================================================ApplyToJob================================================//
/**
 * Apply to a job by creating a new application record.
 * @param {Request} req - Express Request object containing job ID, user skills, and resume file.
 * @param {Response} res - Express Response object for sending response.
 * @param {NextFunction} next - Express Next function for error handling.
 * @returns {Response} - JSON response indicating success or failure of application submission.
 */
export const ApplyToJob = asyncHandler(async (req, res, next) => {
  const { id, userTechSkills, userSoftSkills } = req.body;
  const job = await jobModel.findById({ _id: id });
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  const application = await applicationModel.create({
    userId: req.user.id,
    jobId: id,
    userTechSkills: userTechSkills ? userTechSkills.split(",") : [],
    userSoftSkills: userSoftSkills ? userSoftSkills.split(",") : [],
    userResume: req.file.path,
  });
  return res.status(200).json({ msg: "Application sent successfully", application });
});
