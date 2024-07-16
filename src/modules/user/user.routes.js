import express from "express";
import { auth } from "../../middleware/auth.js"; 
import * as UC from "./user.controller.js";
import * as UV from "./user.validation.js";
import  { validateRequest } from "../../middleware/validation.js"


const router = express.Router();

router.post("/",validateRequest(UV.signUpValidation) ,UC.signUp);
router.post("/signIn",validateRequest(UV.signInValidation) ,UC.signIn);
router.patch("/", auth(),validateRequest(UV.updateUserValidation) ,UC.updateUser);
router.delete("/", auth(),validateRequest(UV.deleteUserValidation),UC.deleteUser);
router.get("/:id", auth(),validateRequest(UV.getUser), UC.getUser);
router.get("/profile/:userId", validateRequest(UV.getProfile),UC.getProfile);
router.patch("/changePassword", auth(), validateRequest(UV.updatePassword),UC.updatePassword);
router.post("/request-Password-Reset", auth(),validateRequest(UV.resetPassword) ,UC.requestPasswordReset);
router.post("/verifyNewPass", auth(),validateRequest(UV.verifyOTP) ,UC.verifyOTP);
router.get("/recoveryEmailAccounts/:recoveryEmail",UC.getAllRecoveryEmailAccounts
);

export default router;
