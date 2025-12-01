import { hash } from "bcrypt";
import type { Request, Response } from "express";
import UserModel from "../database/schemas/user.js";
import type { LoginDto, RegistrationDto } from "../dtos/auth.dto.js"; // this will be merges

export const registrationHandler = async(req:Request<{}, {}, RegistrationDto>,res:Response)=>{
    try {
    const { email, password, name } = req.body;

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
      if (err) return res.status(500).json({ message: "Login after registration failed", err });
      return res.status(201).json({ message: "Registered and logged in", user: newUser });
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}

export const loginHandler = (req:Request<{}, {}, LoginDto>,res:Response)=>{
    const { email, password } = req.body;
    console.log("Login Attempt:", email, password);
    res.send("Login successful");
}


