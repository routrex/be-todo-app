import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";


export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;

    
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "avatars",
      transformation: [
        {
          width: 500,           
          height: 500,
          crop: "fill",        
          gravity: "face",      
          quality: "auto:best", 
          fetch_format: "auto",
        }
      ]
    });

    
    fs.unlinkSync(file.path);

    
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Avatar update successfully",
      user,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ message: "Server error:", error });
  }
};

export const updateProfile = async (req,res) => {
  try {
    const userId = req.params.id;
    const {name} = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {name},
      {new: true}
    );

    if(!user) {
      return res.status(404).json({message: "User tidak ditemukan"});
    }

    res.status(200).json({
      message:"Profil berhasil diperbarui", user
    })
  } catch (error) {
    console.error("Update profil error:", error);
    res.status(500).json({message: "Server error"})
  }
}


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password minimal 8 karakter!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(201).json({
      message: "Register berhasil",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email dan password tidak cocok!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(200).json({
      message: "Login berhasil",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
