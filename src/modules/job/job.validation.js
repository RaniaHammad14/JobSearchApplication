import joi from "joi";
//================================================addJobValidation================================================//

export const addJobValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  body: joi.object({
    jobTitle: joi.string().trim().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: joi.string().valid("fullTime", "partTime").required(),
    seniorityLevel: joi.string().valid("junior", "Mid-Level", "senior", "Team-Lead", "CTO").required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string()).default([]),
    softSkills: joi.array().items(joi.string()).default([]),
  }),
};
//================================================updateJobValidation================================================//

export const updateJobValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  body: joi.object({
    id: joi.string().required().hex().min(24).max(24),
    jobTitle: joi.string().trim().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: joi.string().valid("fullTime", "partTime").required(),
    seniorityLevel: joi.string().valid("junior", "Mid-Level", "senior", "Team-Lead", "CTO").required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string()).default([]),
    softSkills: joi.array().items(joi.string()).default([]),
  }),
};
//================================================deleteJobValidation================================================//

export const deleteJobValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  body: joi.object({
    id: joi.string().required().hex().min(24).max(24),
  }),
};
//================================================getAllJobsValidation================================================//

export const getAllJobsValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
};
//================================================getAllJobsForCompanyValidation================================================//

export const getAllJobsForCompanyValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  query: {
    companyName: joi.string().required(),
  },
};
//================================================jobFilterValidation================================================//

export const jobFilterValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  body: {
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: joi.string().valid("fullTime", "partTime").required(),
    seniorityLevel: joi.string().valid("junior", "Mid-Level", "senior", "Team-Lead", "CTO").required(),
    jobTitle: joi.string().trim().required(),
    technicalSkills: joi.array().items(joi.string()).default([]),
  },
};
//================================================ApplyToJob================================================//

export const ApplyToJob = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  body: {
    id: joi.string().required().hex().min(24).max(24),
    userTechSkills: joi.array().items(joi.string()).default([]),
    userSoftSkills: joi.array().items(joi.string()).default([]),
  },
};
