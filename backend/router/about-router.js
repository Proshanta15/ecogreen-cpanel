import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createOrUpdateAboutPage,
  getAboutPage,
  toggleAboutPageStatus,
} from "../controllers/about-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/about/";
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
    cb(null, `about-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed."),
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Field names used for uploaded images
export const ABOUT_IMAGE_FIELDS = [
  "heroImage",
  "aboutImage",
  "visionImage",
  "missionImage",
  "ctaImage",
];

// ============================================
// PUBLIC ROUTES
// ============================================
router.route("/about").get(getAboutPage);

// ============================================
// ADMIN ROUTES
// ============================================
router
  .route("/admin/about")
  .post(authMiddleware, adminMiddleware, upload.any(), createOrUpdateAboutPage)
  .put(authMiddleware, adminMiddleware, upload.any(), createOrUpdateAboutPage);

router.route("/admin/about/toggle").put(authMiddleware, adminMiddleware, toggleAboutPageStatus);

export default router;
