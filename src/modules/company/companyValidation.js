import joi from "joi";
//================================================addCompanyValidation================================================//
export const addCompanyValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  body: joi.object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.string().valid("1-10", "11-20", "21-50", "51-100", "101-200", "201-500", "501-1000", "1000+").required(),
    companyEmail: joi.string().email().required(),
  }),
};
//================================================updateCompanyValidation================================================//

export const updateCompanyValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  body: joi.object({
    id: joi.string().required().hex().min(24).max(24),
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.string().valid("1-10", "11-20", "21-50", "51-100", "101-200", "201-500", "501-1000", "1000+").required(),
    companyEmail: joi.string().email().required(),
  }),
};
//================================================deleteCompanyValidation================================================//

export const deleteCompanyValidation = {
  headers: joi.object({ token: joi.string().required() }).unknown(true),
  body: joi.object({
    id: joi.string().required().hex().min(24).max(24),
  }),
};
//================================================getCompanyValidation================================================//

export const getCompanyValidation = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  params: joi.object({
    id: joi.string().required().hex().min(24).max(24),
  }),
};
//================================================getCompanyByName================================================//

export const getCompanyByName = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  query: joi.object({
    companyName: joi.string().required(),
  }),
};

//================================================getAllApplicationsForJob================================================//

export const getAllApplicationsForJob = {
  headers: joi
    .object({
      token: joi.string().required(),
    })
    .unknown(true),
  params: joi.object({
    id: joi.string().required().hex().min(24).max(24),
  }),
};
