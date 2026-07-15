import { Schema, model } from "mongoose";

const contactContentSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  subtitle: {
    type: String,
    required: [true, "Subtitle is required"],
    trim: true,
    minlength: [3, "Subtitle must be at least 3 characters long"],
    maxlength: [200, "Subtitle cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [5000, "Description cannot exceed 5000 characters"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  bangladeshOffice: {
    type: String,
    required: [true, "Bangladesh Office address is required"],
    trim: true,
    minlength: [5, "Address must be at least 5 characters long"],
  },
  chinaOffice: {
    type: String,
    required: [true, "China Office address is required"],
    trim: true,
    minlength: [5, "Address must be at least 5 characters long"],
  },
  // Social Media Links
  linkedin: {
    type: String,
    required: false,
    trim: true,
    match: [
      /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/,
      "Please enter a valid LinkedIn URL",
    ],
  },
  instagram: {
    type: String,
    required: false,
    trim: true,
    match: [
      /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
      "Please enter a valid Instagram URL",
    ],
  },
  facebook: {
    type: String,
    required: false,
    trim: true,
    match: [
      /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
      "Please enter a valid Facebook URL",
    ],
  },
  twitter: {
    type: String,
    required: false,
    trim: true,
    match: [
      /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+$/,
      "Please enter a valid Twitter/X URL",
    ],
  },
});

const ContactContent = new model("ContactContent", contactContentSchema);
export default ContactContent;
