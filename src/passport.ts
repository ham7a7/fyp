import { compare } from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import UserModel from "./database/schemas/user.js";
import type { IUserModel } from "./types/userModel.js";

// Serialize: Save user ID to session cookie
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize: Read ID from cookie and find user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new Strategy(
    { usernameField: "email" }, // We use email, not "username"
    async (email, password, done) => {
      try {
        // 1. Find user
        const user:IUserModel | null = await UserModel.findOne({ email });
        if (!user) throw new Error("User not found");

        // 2. Compare password
        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new Error("Incorrect password"); 

        // 3. Success
        return done(null, user);
      } catch (err:ErrorConstructor | any) {
        return done(err?.message);
      }
    }
  )
);

