import express from "express";
import multer from "multer";
import path from "path";

import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
import { createService, deleteService, getAllServices, getServiceById, toggleServiceStatus, updateService } from "../controllers/service-controller.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `category-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.",
      ),
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
router.get("/services", getAllServices);
router.get("/services/:id", getServiceById);

// ============================================
// ADMIN ROUTES
// ============================================

router.post(
  "/admin/services",
  authMiddleware,
  adminMiddleware,
  upload.any(),
  createService,
);

router.put(
  "/admin/services/:id",
  authMiddleware,
  adminMiddleware,
  upload.any(),
  updateService,
);
router.delete(
  "/admin/services/:id",
  authMiddleware,
  adminMiddleware,
  deleteService,
);

router.put(
  "/admin/services/:id/toggle",
  authMiddleware,
  adminMiddleware,
  toggleServiceStatus,
);

export default router;
