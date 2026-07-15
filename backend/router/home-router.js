import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createOrUpdateHomePage,
  getHomePage,
  toggleHomePageStatus,
} from "../controllers/home-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/home/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `home-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, WEBP, GIF images and MP4/WebM/OGG videos are allowed.")
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 7 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// ============================================
// PUBLIC ROUTES
// ============================================
router.route("/home").get(getHomePage);

// ============================================
// ADMIN ROUTES
// ============================================
router
  .route("/admin/home")
  .post(authMiddleware, adminMiddleware, upload.any(), createOrUpdateHomePage)
  .put(authMiddleware, adminMiddleware, upload.any(), createOrUpdateHomePage);

router.route("/admin/home/toggle").put(authMiddleware, adminMiddleware, toggleHomePageStatus);

export default router;
