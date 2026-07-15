import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createOrUpdateFooterShowcase,
  getFooterShowcase,
  toggleFooterShowcaseStatus,
} from "../controllers/footerShowcase-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/footer-showcase/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads (kept for parity / future media)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `footer-showcase-${uniqueSuffix}${path.extname(file.originalname)}`);
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// ============================================
// PUBLIC ROUTES
// ============================================
router.route("/footer-showcase").get(getFooterShowcase);

// ============================================
// ADMIN ROUTES
// ============================================
router
  .route("/admin/footer-showcase")
  .post(authMiddleware, adminMiddleware, upload.any(), createOrUpdateFooterShowcase)
  .put(authMiddleware, adminMiddleware, upload.any(), createOrUpdateFooterShowcase);

router.route("/admin/footer-showcase/toggle").put(authMiddleware, adminMiddleware, toggleFooterShowcaseStatus);

export default router;
