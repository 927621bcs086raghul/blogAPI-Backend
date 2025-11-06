import express from "express";
import {
  addComment,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";
import { authMiddleware } from "../middleware/auth.js"; // fixed import

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post("/:id/comments", addComment);
router.put("/:id/comments/:commentId", updateComment);
router.delete("/:id/comments/:commentId", deleteComment);

export default router;
