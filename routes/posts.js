import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/auth.js"; // updated import
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/create", upload.single("file"), createPost); // file upload
router.put("/:id", upload.single("file"), updatePost); // optional file upload
router.delete("/:id", deletePost);
router.patch("/:id/publish", publishPost);
router.patch("/:id/unpublish", unpublishPost);

export default router;
