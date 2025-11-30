import User from "../models/User.js";
import { upload } from "../middleware/upload.js";
// GET /user
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      message: "User profile",
      data: {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        img_url: user.img_url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(422).json({ message: "Something went wrong while fetching user profile" });
  }
};

// PUT /user
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { first_name, last_name } = req.body;
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (req.file) user.img_url = `/uploads/${req.file.filename}`;

    await user.save();

    res.json({
      message: "User profile updated successfully",
      data: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        img_url: user.img_url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(422).json({ message: "Something went wrong while updating user profile" });
  }
};
