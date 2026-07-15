import fs from "fs";
import AboutPage from "../models/about-model.js";

// @desc    Create or update about page content
// @route   POST /api/admin/about
// @access  Private/Admin
export const createOrUpdateAboutPage = async (req, res) => {
  try {
    // The structured content is sent as a JSON string under "data"
    const aboutData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data || {};

    // Map uploaded files (upload.any) to their field names
    const fileMap = {};
    (req.files || []).forEach((f) => {
      fileMap[f.fieldname] = f.path;
    });

    // Overlay uploaded image paths onto the structured data
    if (fileMap.heroImage) aboutData.hero = { ...aboutData.hero, image: fileMap.heroImage };
    if (fileMap.aboutImage)
      aboutData.aboutContent = { ...aboutData.aboutContent, image: fileMap.aboutImage };
    if (fileMap.visionImage)
      aboutData.visionMission = {
        ...aboutData.visionMission,
        vision: { ...aboutData.visionMission?.vision, image: fileMap.visionImage },
      };
    if (fileMap.missionImage)
      aboutData.visionMission = {
        ...aboutData.visionMission,
        mission: { ...aboutData.visionMission?.mission, image: fileMap.missionImage },
      };
    if (fileMap.ctaImage) aboutData.cta = { ...aboutData.cta, image: fileMap.ctaImage };

    if (Array.isArray(aboutData.values)) {
      aboutData.values = aboutData.values.map((value, index) => {
        const key = `valueImage_${index}`;
        return fileMap[key] ? { ...value, image: fileMap[key] } : value;
      });
    }

    // Check if about page already exists
    let aboutPage = await AboutPage.findOne();

    if (aboutPage) {
      // Update existing
      aboutPage = await AboutPage.findByIdAndUpdate(
        aboutPage._id,
        aboutData,
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        success: true,
        message: "About page updated successfully",
        data: aboutPage,
      });
    } else {
      // Create new
      aboutPage = new AboutPage(aboutData);
      await aboutPage.save();
      return res.status(201).json({
        success: true,
        message: "About page created successfully",
        data: aboutPage,
      });
    }
  } catch (error) {
    // Delete uploaded files if an error occurs
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    } else if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error saving about page:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get about page content
// @route   GET /api/about
// @access  Public
export const getAboutPage = async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne({ isActive: true });

    if (!aboutPage) {
      // Return default data if no about page exists
      return res.status(200).json({
        success: true,
        data: {
          hero: {
            badge: "ISO-CERTIFIED APPAREL SOURCING PARTNER",
            title: "Connecting Global Fashion Brands",
            titleHighlight: "With Trusted Manufacturing Excellence",
            description: "Ecogreentex is an ISO certified apparel sourcing house headquartered in Dhaka, Bangladesh, specializing in sourcing, product development, and quality assurance for global fashion brands.",
            image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&h=600&fit=crop",
          },
          stats: [
            { number: "10+", label: "Years Experience" },
            { number: "500+", label: "Partner Factories" },
            { number: "25+", label: "Countries Served" },
            { number: "98%", label: "Client Satisfaction" },
          ],
          // ... other default data
        },
      });
    }

    res.status(200).json({
      success: true,
      data: aboutPage,
    });
  } catch (error) {
    console.error("Error fetching about page:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle about page status
// @route   PUT /api/admin/about/toggle
// @access  Private/Admin
export const toggleAboutPageStatus = async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne();

    if (!aboutPage) {
      return res.status(404).json({
        success: false,
        message: "About page not found",
      });
    }

    aboutPage.isActive = !aboutPage.isActive;
    await aboutPage.save();

    res.status(200).json({
      success: true,
      message: `About page ${aboutPage.isActive ? "activated" : "deactivated"} successfully`,
      data: aboutPage,
    });
  } catch (error) {
    console.error("Error toggling about page status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};