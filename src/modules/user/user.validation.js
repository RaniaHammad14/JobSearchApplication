import joi from "joi";
//================================================signUpValidation================================================//
export const signUpValidation = {
  body: joi.object({
    firstName: joi.string().min(4).max(20).required(),
    lastName: joi.string().min(4).max(20).required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/))
      .required(),
    email: joi.string().email().required(),
    recoveryEmail: joi.string().email(),
    DOB: joi
      .string()
      .pattern(new RegExp(/^\d{4}-\d{2}-\d{2}$/))
      .required(),
    mobileNumber: joi.string().min(11).max(15).required(),
    role: joi.string(),
  }),
};
//================================================signInValidation================================================//
export const signInValidation = {
  body: joi.object({
    identifier: joi.string().required(),
    password: joi
      .string()
      .required()
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)),
  }),
};
//================================================updateUserValidation================================================//

export const updateUserValidation = {
  headers: joi
    .object({
      token: joi.string().required().messages({
        "string.empty": "Authorization token is required",
        "any.required": "Authorization token is required",
      }),
    })
    .unknown(true),
  body: joi.object({
    id: joi.string().required().hex().min(24).max(24),
    firstName: joi.string().min(4).max(20),
    lastName: joi.string().min(4).max(20),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    recoveryEmail: joi.string().email(),
    DOB: joi.string().pattern(new RegExp(/^\d{4}-\d{2}-\d{2}$/)),
    mobileNumber: joi.string().min(11).max(15),
    role: joi.string(),
  }),
};
//================================================deleteUserValidation================================================//

export const deleteUserValidation = {
  headers: joi
    .object({
      token: joi.string().required().messages({
        "string.empty": "Authorization token is required",
        "any.required": "Authorization token is required",
      }),
    })
    .unknown(true),
  params: joi.object({
    id: joi.string().required().hex().min(24).max(24),
  }),
};
//================================================getUser================================================//

export const getUser = {
  headers: joi
    .object({
      token: joi.string().required().messages({
        "string.empty": "Authorization token is required",
        "any.required": "Authorization token is required",
      }),
    })
    .unknown(true),
  params: joi.object({
    id: joi.string().required().hex().min(24).max(24),
  }),
};
//================================================getProfile================================================//

export const getProfile = {
  params: joi.object({
    userId: joi.string().required().hex().min(24).max(24),
  }),
};
//================================================updatePassword================================================//

export const updatePassword = {
  headers: joi
    .object({
      token: joi.string().required().messages({
        "string.empty": "Authorization token is required",
        "any.required": "Authorization token is required",
      }),
    })
    .unknown(true),
  body: joi.object({
    newPassword: joi
      .string()
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/))
      .required(),
    currentPassword: joi
      .string()
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/))
      .required(),
  }),
};
//================================================resetPassword================================================//

export const resetPassword = {
  headers: joi
    .object({
      token: joi.string().required().messages({
        "string.empty": "Authorization token is required",
        "any.required": "Authorization token is required",
      }),
    })
    .unknown(true),
  body: joi.object({
    email: joi.string().email().required(),
  }),
};
//================================================verifyOTP================================================//

export const verifyOTP = {
  headers: joi
    .object({
      token: joi.string().required().messages({
        "string.empty": "Authorization token is required",
        "any.required": "Authorization token is required",
      }),
    })
    .unknown(true),
  body: joi.object({
    otp: joi.string().required(),
    email: joi.string().email().required(),
    newPassword: joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)),
  }),
};
//================================================getAllRecoveryEmailAccounts================================================//

export const getAllRecoveryEmailAccounts = {
  body: joi.object({
    recoveryEmail: joi.string().email().required(),
  }),
};
