/**
 * Middleware function to validate incoming request data against a Joi schema.
 * Validates request body, parameters, query string, headers, and files.
 * @param {Object} schema - Joi schema object with validation rules for different parts of the request.
 * @returns {Function} Express middleware function.
 */
const dataMethod = ["body", "params", "query", "headers", "file", "files"];
export const validateRequest = (schema) => {
  return (req, res, next) => {
    let arrayError = [];
    dataMethod.forEach((key) => {
      if (schema[key]) {
        const error = schema[key].validate(req[key], { abortEarly: false });
        if (error?.details) {
          error.details.forEach((err) => {
            arrayError.push(err.message);
          });
        }
      }
    });
    if (arrayError.length) {
      return res.status(400).json({ msg: "Invalid request", error: arrayError });
    }

    next();
  };
};
