import express from "express";
import { auth, authorization } from "../../middleware/auth.js";
import * as CC from "./company.controller.js";
import systemRoles from "../../utils/systemRoles.js";
import * as CV from "./companyValidation.js";
import { validateRequest } from "../../middleware/validation.js";


const router = express.Router();

router.post("/addCompany",auth(),validateRequest(CV.addCompanyValidation),authorization(systemRoles.companyHR),CC.addCompany);
router.patch("/", auth(),validateRequest(CV.updateCompanyValidation) ,authorization(systemRoles.companyHR), CC.updateCompany);
router.delete("/", auth(),validateRequest(CV.deleteCompanyValidation) ,authorization(systemRoles.companyHR), CC.deleteCompany);
router.get("/:id", auth(),validateRequest(CV.getCompanyValidation),authorization(systemRoles.companyHR), CC.getCompanyData);
router.get("/", auth(),validateRequest(CV.getCompanyByName),authorization(systemRoles.companyHR || systemRoles.user), CC.getCompanyByName);
router.get("/getApplications/:id", auth(),validateRequest(CV.getAllApplicationsForJob) ,authorization(systemRoles.companyHR), CC.getAllApplicationsForJob);


export default router;
