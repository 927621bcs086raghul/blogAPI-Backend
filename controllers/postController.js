import Post from "../models/Post.js";

// GET /posts
export const getPosts = async (req, res) => {
  try {
    const { page = 1, size = 25, search, is_published, author_id } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (is_published !== undefined) query.is_published = is_published === "true";
    if (author_id) query.author = author_id;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate("author", "first_name last_name email img_url")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "first_name last_name email img_url",
        },
      })
      .skip((page - 1) * size)
      .limit(Number(size))
      .sort({ createdAt: -1 });

    res.json({
      data: posts,
      meta: {
        total,
        page: Number(page),
        size: Number(size),
        total_pages: Math.ceil(total / size),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /posts/:id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "first_name last_name email img_url")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "first_name last_name email img_url",
        },
      });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// POST /posts/create
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const img_url = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      title,
      content,
      img_url,
      author: req.userId,
    });

    // populate author + ensure comments is empty array
    const populatedPost = await Post.findById(post._id)
      .populate("author", "first_name last_name email img_url")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "first_name last_name email img_url",
        },
      });

    res.status(201).json({
      message: "Post created successfully",
      data: populatedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(422).json({
      message: "Something went wrong while creating the post",
    });
  }
};

// PUT /posts/:id
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
     if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Not the author" });
        }
    if (!post.author.equals(req.userId)) return res.status(403).json({ message: "Forbidden" });
    if (post.is_published) return res.status(422).json({ message: "Post is already published. Unpublish before updating." });

    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (req.file) post.img_url = `/uploads/${req.file.filename}`;

    await post.save();
    res.json({ message: "Post updated successfully", data: post });
  } catch (err) {
    console.error(err);
    res.status(422).json({ message: "Something went wrong while updating the post" });
  }
};

// DELETE /posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden: Not the author" });
}
    if (!post.author.equals(req.userId)) return res.status(403).json({ message: "Forbidden" });

    await post.remove();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(422).json({ message: "Something went wrong while deleting the post" });
  }
};

// PATCH /posts/:id/publish
export const publishPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
            if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Not the author" });
        }
    if (!post.author.equals(req.userId)) return res.status(403).json({ message: "Forbidden" });
    if (post.is_published) return res.status(422).json({ message: "Post is already published" });

    post.is_published = true;
    await post.save();

    res.json({ message: "Post published successfully", data: post });
  } catch (err) {
    console.error(err);
    res.status(422).json({ message: "Something went wrong while publishing the post" });
  }
};

// PATCH /posts/:id/unpublish
export const unpublishPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
            if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Not the author" });
        }
    if (!post.author.equals(req.userId)) return res.status(403).json({ message: "Forbidden" });
    if (!post.is_published) return res.status(422).json({ message: "Post is already unpublished" });

    post.is_published = false;
    await post.save();

    res.json({ message: "Post unpublished successfully", data: post });
  } catch (err) {
    console.error(err);
    res.status(422).json({ message: "Something went wrong while unpublishing the post" });
  }
};
