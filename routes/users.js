import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProfile);
router.put("/", upload.single("file"), updateProfile);

export default router;
