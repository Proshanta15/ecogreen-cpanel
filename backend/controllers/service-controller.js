import fs from "fs";
import path from "path";
import Service from "../models/service-model.js";
import { normalizeImagePath, sanitizeMediaUrls } from "../utils/image-path.js";

// @desc    Create a new service/category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { id, title, icon, description, gender, items } = req.body;

    // Check if category with same ID already exists
    const existingCategory = await Service.findOne({ id });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `Category with ID '${id}' already exists`,
      });
    }

    // Parse gender and items if they are strings
    const parsedGender =
      typeof gender === "string" ? JSON.parse(gender) : gender;
    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

    // Map uploaded files (upload.any) to their field names
    const uploadedFiles = req.files || [];
    const categoryFile = uploadedFiles.find((f) => f.fieldname === "image");
    const itemImageMap = {};
    uploadedFiles.forEach((f) => {
      if (f.fieldname.startsWith("item-")) {
        itemImageMap[f.fieldname] = normalizeImagePath(f.path);
      }
    });

    // Get image path if uploaded
    let imagePath = categoryFile ? normalizeImagePath(categoryFile.path) : null;

    // Resolve item image references sent from the client
    ["men", "women", "children"].forEach((g) => {
      if (Array.isArray(parsedItems[g])) {
        parsedItems[g] = parsedItems[g].map((item) => {
          if (typeof item.image === "string" && item.image.startsWith("item-")) {
            return { ...item, image: itemImageMap[item.image] || null };
          }
          return item;
        });
      }
    });

    const newService = new Service({
      id,
      title,
      icon,
      description,
      image: imagePath,
      gender: parsedGender,
      items: parsedItems,
    });

    await newService.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newService,
    });
  } catch (error) {
    // Delete uploaded files if any exist
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    } else if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error creating category:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all services/categories
// @route   GET /api/categories
// @access  Public
export const getAllServices = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services.map(sanitizeMediaUrls),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single service/category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sanitizeMediaUrls(service),
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update service/category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { title, icon, description, gender, items, isActive } = req.body;

    // Map uploaded files (upload.any) to their field names
    const uploadedFiles = req.files || [];
    const categoryFile = uploadedFiles.find((f) => f.fieldname === "image");
    const itemImageMap = {};
    uploadedFiles.forEach((f) => {
      if (f.fieldname.startsWith("item-")) {
        itemImageMap[f.fieldname] = f.path;
      }
    });

    // Update fields
    if (title) service.title = title;
    if (icon) service.icon = icon;
    if (description) service.description = description;
    if (gender) service.gender = JSON.parse(gender);
    if (isActive !== undefined) service.isActive = isActive;

    // Resolve item image references sent from the client, removing replaced files
    if (items) {
      const parsedItems = JSON.parse(items);
      ["men", "women", "children"].forEach((g) => {
        if (Array.isArray(parsedItems[g])) {
          parsedItems[g] = parsedItems[g].map((item) => {
            if (typeof item.image === "string" && item.image.startsWith("item-")) {
              // Newly uploaded image
              return { ...item, image: itemImageMap[item.image] || null };
            }
            // Existing image url or null -> keep as-is (strip any origin)
            if (typeof item.image === "string") {
              return { ...item, image: normalizeImagePath(item.image) };
            }
            return item;
          });
        }
      });
      service.items = parsedItems;
    }

    // Update category image if a new one was uploaded
    if (categoryFile) {
      if (service.image && fs.existsSync(service.image)) {
        fs.unlinkSync(service.image);
      }
      service.image = normalizeImagePath(categoryFile.path);
    } else if (typeof req.body.image === "string" && req.body.image) {
      // Preserve an existing image url sent back from the client (strip origin)
      service.image = normalizeImagePath(req.body.image);
    }

    await service.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: service,
    });
  } catch (error) {
    // Delete uploaded files if any exist
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    } else if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error updating category:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete service/category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete image if exists
    if (service.image && fs.existsSync(service.image)) {
      fs.unlinkSync(service.image);
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle service/category status
// @route   PUT /api/admin/categories/:id/toggle
// @access  Private/Admin
export const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Category ${service.isActive ? "activated" : "deactivated"} successfully`,
      data: service,
    });
  } catch (error) {
    console.error("Error toggling category status:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
