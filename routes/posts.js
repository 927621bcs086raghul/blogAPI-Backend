import express from "express";
import {
    createPost,
    deletePost,
    getPostById,
    getPosts,
    publishPost,
    unpublishPost,
    updatePost
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/auth.js"; // updated import
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/", getPosts);

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post data
 *       404:
 *         description: Post not found
 */
router.get("/:id", getPostById);

/**
 * @openapi
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Validation error
 */
router.post("/create", upload.single("file"), createPost); // file upload

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated
 *       404:
 *         description: Post not found
 */
router.put("/:id", upload.single("file"), updatePost); // optional file upload

/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */
router.delete("/:id", deletePost);

/**
 * @openapi
 * /posts/{id}/publish:
 *   patch:
 *     summary: Publish a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post published
 *       404:
 *         description: Post not found
 */
router.patch("/:id/publish", publishPost);

/**
 * @openapi
 * /posts/{id}/unpublish:
 *   patch:
 *     summary: Unpublish a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unpublished
 *       404:
 *         description: Post not found
 */
router.patch("/:id/unpublish", unpublishPost);

export default router;
