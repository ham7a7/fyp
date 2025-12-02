
import type mongoose from "mongoose";

export interface IUserModel {
    _id:mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    bots: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}