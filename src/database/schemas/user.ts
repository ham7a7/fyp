import mongoose, { Schema } from "mongoose";
import type { IUserModel } from "../../types/userModel.js";



export const UserSchema:Schema<IUserModel> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const UserModel = mongoose.model<IUserModel>(
  "User",
  UserSchema
);
export default UserModel;
