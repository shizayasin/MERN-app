import path from "path";
import express from "express";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { authenticate } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import { getImageUploadErrorMessage, isAllowedImageFile } from "../utils/imageUpload.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const resolveUploadDir = () => path.resolve(__dirname, "../../uploads");
const uploadDir = resolveUploadDir();

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (isAllowedImageFile(file)) {
    cb(null, true);
    return;
  }

  cb(new Error(getImageUploadErrorMessage()), false);
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const savedFilename = path.basename(req.file.path);
    const publicImagePath = `/uploads/${savedFilename}`;

    res.status(200).json({
      message: "Image uploaded successfully",
      image: publicImagePath,
    });
  });
});

router.post(
  "/profile",
  authenticate,
  (req, res) => {
    uploadSingleImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const savedFilename = path.basename(req.file.path);
      const publicImagePath = `/uploads/${savedFilename}`;

      try {
        const user = await User.findByIdAndUpdate(
          req.user._id,
          { profileImage: publicImagePath },
          { new: true }
        ).select("-password");

        res.status(200).json({
          message: "Profile image uploaded successfully",
          image: publicImagePath,
          user,
        });
      } catch (error) {
        res.status(500).json({ message: "Error updating profile image" });
      }
    });
  }
);

export default router;