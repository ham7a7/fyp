import { hash } from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import UserModel from "../database/schemas/user.js";
import type { LoginDto, RegistrationDto } from "../dtos/auth.dto.js"; // this will be merges

export const registrationHandler = async (
  req: Request<{}, {}, RegistrationDto>,
  res: Response
) => {
  try {
    const { email, password, name } = req.body;
    console.log("Registration attempt for:", email, password, name);

    // 1. Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 2. Hash Password
    const hashedPassword = await hash(password, 10);

    // 3. Create User
    const newUser = await UserModel.create({
      email,
      name,
      password: hashedPassword,
    });

    // 4.Auto-login after register
    req.login(newUser, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Login after registration failed", err });
      return res
        .status(201)
        .json({ message: "Registered and logged in", user: newUser });
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const loginHandler = (req: Request<{}, {}, LoginDto>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  console.log("Login successful for:", user);
  return res.status(200).json({
    message: "Login successful",
    user: user,
    // {
    //   _id: user._id,
    //   email: user.email,
    //   name: user.name,
    // },
  });
};

export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = req.user;
  return res.status(200).json({
    user: user,
    // {
    //   _id: user._id,
    //   email: user.email,
    //   name: user.name,
    // },
  });
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle any session destruction errors
    }

    // 2. Destroy the session (handled by express-session)
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        // Even if session destroy fails, we try to proceed with logout state
      }

      // 3. Clear the cookie (Optional but recommended for certainty)
      res.clearCookie("connect.sid"); // Replace with your actual cookie name if different

      // 4. Send success response
      return res.status(200).json({ message: "Logout successful" });
    });
  });
};
