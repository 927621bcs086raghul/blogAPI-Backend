import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js"; // updated

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);

export default router;
