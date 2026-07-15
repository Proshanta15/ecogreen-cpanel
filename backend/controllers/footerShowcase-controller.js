import FooterShowcase from "../models/footerShowcase-model.js";

// @desc    Create or update footer showcase content
// @route   POST /api/admin/footer-showcase
// @access  Private/Admin
export const createOrUpdateFooterShowcase = async (req, res) => {
  try {
    const footerData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data || {};

    let footerShowcase = await FooterShowcase.findOne();

    if (footerShowcase) {
      footerShowcase = await FooterShowcase.findByIdAndUpdate(
        footerShowcase._id,
        footerData,
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        success: true,
        message: "Footer showcase updated successfully",
        data: footerShowcase,
      });
    } else {
      footerShowcase = new FooterShowcase(footerData);
      await footerShowcase.save();
      return res.status(201).json({
        success: true,
        message: "Footer showcase created successfully",
        data: footerShowcase,
      });
    }
  } catch (error) {
    console.error("Error saving footer showcase:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get footer showcase content
// @route   GET /api/footer-showcase
// @access  Public
export const getFooterShowcase = async (req, res) => {
  try {
    const footerShowcase = await FooterShowcase.findOne({ isActive: true });

    if (!footerShowcase) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: footerShowcase,
    });
  } catch (error) {
    console.error("Error fetching footer showcase:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle footer showcase status
// @route   PUT /api/admin/footer-showcase/toggle
// @access  Private/Admin
export const toggleFooterShowcaseStatus = async (req, res) => {
  try {
    const footerShowcase = await FooterShowcase.findOne();

    if (!footerShowcase) {
      return res.status(404).json({
        success: false,
        message: "Footer showcase not found",
      });
    }

    footerShowcase.isActive = !footerShowcase.isActive;
    await footerShowcase.save();

    res.status(200).json({
      success: true,
      message: `Footer showcase ${footerShowcase.isActive ? "activated" : "deactivated"} successfully`,
      data: footerShowcase,
    });
  } catch (error) {
    console.error("Error toggling footer showcase status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
