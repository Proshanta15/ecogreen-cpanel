import fs from "fs";
import HomePage from "../models/home-model.js";

// @desc    Create or update home page content
// @route   POST /api/admin/home
// @access  Private/Admin
export const createOrUpdateHomePage = async (req, res) => {
  try {
    const homeData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data || {};

    const fileMap = {};
    (req.files || []).forEach((f) => {
      fileMap[f.fieldname] = f.path;
    });

    // Single image / video
    if (fileMap.bannerImage) homeData.banner = { ...homeData.banner, image: fileMap.bannerImage };
    if (fileMap.bannerVideo) homeData.banner = { ...homeData.banner, video: fileMap.bannerVideo };

    // Array images
    if (Array.isArray(homeData.expertise?.cards)) {
      homeData.expertise.cards = homeData.expertise.cards.map((card, index) => {
        const key = `expertiseImage_${index}`;
        return fileMap[key] ? { ...card, image: fileMap[key] } : card;
      });
    }
    if (Array.isArray(homeData.showcase?.products)) {
      homeData.showcase.products = homeData.showcase.products.map((product, index) => {
        const key = `showcaseImage_${index}`;
        return fileMap[key] ? { ...product, image: fileMap[key] } : product;
      });
    }
    if (Array.isArray(homeData.brands?.brands)) {
      homeData.brands.brands = homeData.brands.brands.map((brand, index) => {
        const key = `brandLogo_${index}`;
        return fileMap[key] ? { ...brand, logo: fileMap[key] } : brand;
      });
    }

    let homePage = await HomePage.findOne();

    if (homePage) {
      homePage = await HomePage.findByIdAndUpdate(
        homePage._id,
        homeData,
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        success: true,
        message: "Home page updated successfully",
        data: homePage,
      });
    } else {
      homePage = new HomePage(homeData);
      await homePage.save();
      return res.status(201).json({
        success: true,
        message: "Home page created successfully",
        data: homePage,
      });
    }
  } catch (error) {
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    } else if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error saving home page:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get home page content
// @route   GET /api/home
// @access  Public
export const getHomePage = async (req, res) => {
  try {
    const homePage = await HomePage.findOne({ isActive: true });

    if (!homePage) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: homePage,
    });
  } catch (error) {
    console.error("Error fetching home page:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle home page status
// @route   PUT /api/admin/home/toggle
// @access  Private/Admin
export const toggleHomePageStatus = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: "Home page not found",
      });
    }

    homePage.isActive = !homePage.isActive;
    await homePage.save();

    res.status(200).json({
      success: true,
      message: `Home page ${homePage.isActive ? "activated" : "deactivated"} successfully`,
      data: homePage,
    });
  } catch (error) {
    console.error("Error toggling home page status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
