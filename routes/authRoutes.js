import express from "express";
import {
  registerUser,
  loginUser,
  uploadAvatar,
  updateProfile,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/update/:id", verifyToken, updateProfile);

router.put("/avatar/:id", upload.single("avatar"), uploadAvatar);

router.get("/users", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Get/users erorr:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
