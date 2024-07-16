import express from "express";
import { auth, authorization } from "../../middleware/auth.js";
import * as JC from "./job.controller.js";
import systemRoles from "../../utils/systemRoles.js";
import * as JV from "./job.validation.js"
import { validateRequest } from "../../middleware/validation.js";
import { multerLocal } from "../../services/multerLocal.js";
const router = express.Router()


router.post("/",auth(), validateRequest(JV.addJobValidation),authorization(systemRoles.companyHR),JC.addJob);
router.patch("/", auth(), validateRequest(JV.updateJobValidation),authorization(systemRoles.companyHR), JC.updateJob);
router.delete("/", auth(), validateRequest(JV.deleteJobValidation), authorization(systemRoles.companyHR), JC.deleteJob);
router.get("/", auth(), validateRequest(JV.getAllJobsValidation), authorization(systemRoles.companyHR || systemRoles.user), JC.getAllJobs);
router.get("/getJobs", auth(), validateRequest(JV.getAllJobsForCompanyValidation),authorization(systemRoles.companyHR || systemRoles.user), JC.getAllJobsForCompany);
router.get("/filteredJobs", auth(), validateRequest(JV.jobFilterValidation), authorization(systemRoles.companyHR || systemRoles.user), JC.jobFilter);
router.post("/apply", auth(), validateRequest(JV.ApplyToJob),authorization(systemRoles.user), multerLocal().single("userResume"),JC.ApplyToJob);



export default router