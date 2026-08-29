import User from "../models/User.models.js"
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
    try {
        // Logic for registering a new user
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Please fill all required fields" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" })
        }
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" })
        }

        // Create a new user
        const newUser = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password,
            phone
        });




        const token = generateToken(newUser._id);
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
               

            }
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


export const loginUser = async (req, res) => {
    try {
        // Logic for logging in a user
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all required fields" })
        }
        console.log("LOGIN EMAIL:", email);
        console.log("NORMALIZED EMAIL:", email?.trim().toLowerCase());
        console.log("DATABASE NAME:", mongoose.connection.name);
        console.log("COLLECTION NAME:", User.collection.name);
        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            console.log("Not User found",user)
            return res.status(404).json({ message: "User not found" })
        }

        const isPasswordValid = await user.comparePassword(password);
         console.log("PASSWORD VALID:", isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }
        const token = generateToken(user._id);
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
              

            }
        })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}



export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};