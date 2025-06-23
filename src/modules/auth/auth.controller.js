import { Router } from "express";
import { checkRequestFields } from "../../Helpers/checkrequest.js";
import authService from "./auth.service.js";

const router = Router();

const validateLoginRequest = (req, res, next) => {
  const requiredField = ["email", "password"];
  const result = checkRequestFields(requiredField, req.body);
  if (result.length) {
    if (result.length) {
      return res.status(400).json({ errors: result.map((field) => `${field} field is required`) });
    }
  }
  const emailRegex = /^[A-Za-z][A-Za-z0-9]{0,100}@(gmail|yahoo)\.(com|net)$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ errors: ["email must be valid email"] });
  }
  next();
};
const validateSignUpRequest = (req, res, next) => {
  const required = ["firstName", "middleName", "lastName", "password", "confirmPassword", "email"];
  const result = checkRequestFields(required, req.body);
  if (result.length) {
    return res.status(400).json({ errors: result.map((field) => `${field} field is required`) });
  }
  const emailRegex = /^[A-Za-z][A-Za-z0-9]{0,100}@(gmail|yahoo)\.(com|net)$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ errors: ["email must be valid email"] });
  }
  next();
};

router.post("/signup", validateSignUpRequest, authService.signup);
router.post("/login", validateLoginRequest, authService.login);

export default router;
