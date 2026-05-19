import { Router } from "express";
import { updatePassword, updateProfile } from "../handlers/users.js";
import validator from "../middlewares/validator.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import {
    updatePasswordValidators,
    updateProfileValidators,
} from "../validators/userValidators.js";

const users: Router = Router();

users.patch("/me", verifyAuth, updateProfileValidators, validator, updateProfile);
users.patch(
  "/me/password",
  verifyAuth,
  updatePasswordValidators,
  validator,
  updatePassword
);

export default users;
