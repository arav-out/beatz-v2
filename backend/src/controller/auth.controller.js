import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

import dotenv from "dotenv";

dotenv.config();



export const handleSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};



export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    console.log("User data here===>>>>",req.body);
    
    // Check if user already exists
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      // Sign up
      console.log("===================================Creating user");

      const newUser = new User({
        clerkId: id,
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl,
      });

      await newUser.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in auth callback", error);
    next(error);
  }
};

export const handleSignIn = async (req,res)=>{
  
  
  return res.status(200).json({message:"Sign up"});

}