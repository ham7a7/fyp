import { compare, hash } from "bcrypt";
import type { Request, Response } from "express";
import UserModel from "../database/schemas/user.js";
import type { UpdatePasswordDto, UpdateProfileDto } from "../dtos/user.dto.js";

const sanitizeUser = (user: { _id: unknown; name: string; email: string }) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});

export const updateProfile = async (
  req: Request<{}, {}, UpdateProfileDto>,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email } = req.body;

    const userId = (req.user as { _id: string })._id;

    const existingEmail = await UserModel.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name: name.trim(), email: email.trim() },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: sanitizeUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updatePassword = async (
  req: Request<{}, {}, UpdatePasswordDto>,
  res: Response
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    const userId = (req.user as { _id: string })._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
