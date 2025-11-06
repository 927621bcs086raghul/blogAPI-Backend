import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// POST /posts/:id/comments
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.is_published)
      return res.status(422).json({ message: "Post is not published yet. So, you cannot comment on it" });

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const comment = await Comment.create({
      post: post._id,
      content,
      author: req.userId,
    });

    // ✅ push comment into post
    post.comments.push(comment._id);
    await post.save();

    // Populate before returning
    const populatedComment = await comment.populate("author", "first_name last_name email img_url");

    res.status(201).json({
      message: "Comment added successfully",
      data: populatedComment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// PUT /posts/:id/comments/:commentId
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (!comment.author.equals(req.userId)) return res.status(403).json({ message: "Forbidden" });

    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    comment.content = content;
    await comment.save();

    res.json({
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (err) {
    console.error(err);
    res.status(422).json({ message: "Something went wrong while updating the comment" });
  }
};

// DELETE /posts/:id/comments/:commentId
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (!comment.author.equals(req.userId)) return res.status(403).json({ message: "Forbidden" });

    await comment.remove();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(422).json({ message: "Something went wrong while deleting the comment" });
  }
};
