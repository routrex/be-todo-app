import express from "express";
import {
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTodo);
router.get("/", verifyToken, getTodo);
router.put("/:id", verifyToken, updateTodo);
router.delete("/:id", verifyToken, deleteTodo);

export default router;
