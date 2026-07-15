import { Schema, model } from "mongoose";

const statSchema = new Schema({
  number: {
    type: String,
    required: [true, "Stat number is required"],
    trim: true,
  },
  label: {
    type: String,
    required: [true, "Stat label is required"],
    trim: true,
  },
}, { _id: true });

const valueSchema = new Schema({
  icon: {
    type: String,
    required: [true, "Value icon is required"],
    trim: true,
    maxlength: [10, "Icon cannot exceed 10 characters"],
  },
  title: {
    type: String,
    required: [true, "Value title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Value description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  image: {
    type: String,
    required: [true, "Value image is required"],
    trim: true,
  },
}, { _id: true });

const aboutPageSchema = new Schema({
  // Hero Section
  hero: {
    badge: {
      type: String,
      default: "ISO-CERTIFIED APPAREL SOURCING PARTNER",
      trim: true,
    },
    title: {
      type: String,
      default: "Connecting Global Fashion Brands",
      trim: true,
    },
    titleHighlight: {
      type: String,
      default: "With Trusted Manufacturing Excellence",
      trim: true,
    },
    description: {
      type: String,
      default: "Ecogreentex is an ISO certified apparel sourcing house headquartered in Dhaka, Bangladesh, specializing in sourcing, product development, and quality assurance for global fashion brands. With strong operational networks across Bangladesh, China, and Germany, we serve as a strategic bridge between international buyers and carefully vetted manufacturing partners.",
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&h=600&fit=crop",
      trim: true,
    },
    floatingCards: {
      card1: {
        icon: {
          type: String,
          default: "🏭",
        },
        number: {
          type: String,
          default: "500+",
        },
        label: {
          type: String,
          default: "Factories Network",
        },
      },
      card2: {
        icon: {
          type: String,
          default: "🌍",
        },
        number: {
          type: String,
          default: "25+",
        },
        label: {
          type: String,
          default: "Countries",
        },
      },
    },
  },

  // Stats Section
  stats: {
    type: [statSchema],
    default: [
      { number: "10+", label: "Years Experience" },
      { number: "500+", label: "Partner Factories" },
      { number: "25+", label: "Countries Served" },
      { number: "98%", label: "Client Satisfaction" },
    ],
  },

  // About Content Section
  aboutContent: {
    badge: {
      type: String,
      default: "ABOUT US",
      trim: true,
    },
    title: {
      type: String,
      default: "Your Trusted Partner in",
      trim: true,
    },
    titleHighlight: {
      type: String,
      default: "Global Apparel Sourcing",
      trim: true,
    },
    description: {
      type: String,
      default: "Our strength lies in partnering competitive pricing, uncompromised quality, and reliable lead times ranging from 45 to 120 days. From sourcing to retail, we deliver to customers from all over the world, ensuring a seamless supply chain — from design development and factory selection to online inspection, final quality control, compliance monitoring, and shipment coordination.",
      trim: true,
    },
    description2: {
      type: String,
      default: "Driven by ethical sourcing, sustainability, and long-term partnerships, Ecogreentex is committed to delivering value, transparency, and excellence in every order. We don't just source garments — we build dependable production solutions tailored to the evolving needs of global apparel brands.",
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop",
      trim: true,
    },
  },

  // Vision & Mission Section
  visionMission: {
    vision: {
      icon: {
        type: String,
        default: "👁️",
      },
      title: {
        type: String,
        default: "Our Vision",
        trim: true,
      },
      description: {
        type: String,
        default: "To be a globally recognized apparel sourcing partner known for reliability, ethical practices, and excellence. We envision a future where Ecogreentex is trusted by leading fashion brands for delivering responsible sourcing solutions, strong manufacturing partnerships, and uncompromised quality across product categories.",
        trim: true,
      },
      image: {
        type: String,
        default: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
        trim: true,
      },
    },
    mission: {
      icon: {
        type: String,
        default: "🎯",
      },
      title: {
        type: String,
        default: "Our Mission",
        trim: true,
      },
      description: {
        type: String,
        default: "To support global fashion brands by providing end-to-end apparel sourcing, product development, and quality assurance solutions. We are committed to building strong relationships with compliant and capable manufacturing partners, ensuring competitive pricing, timely delivery, and consistent quality across all categories and markets.",
        trim: true,
      },
      image: {
        type: String,
        default: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=800&h=400&fit=crop",
        trim: true,
      },
    },
  },

  // Values Section
  values: {
    type: [valueSchema],
    default: [
      {
        icon: "🤝",
        title: "Integrity & Transparency",
        description: "We operate with honesty, accountability, and clear communication at every stage of the sourcing and production process, building trust with our clients and partners.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      },
      {
        icon: "⭐",
        title: "Quality Without Compromise",
        description: "From yarn to final shipment, we maintain strict quality standards to ensure every product meets buyer expectations and international requirements.",
        image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop",
      },
      {
        icon: "🌱",
        title: "Sustainable Sourcing",
        description: "We promote compliance, worker safety, environmental responsibility, and ethical manufacturing practices across our supply network.",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
      },
      {
        icon: "💪",
        title: "Collaboration & Partnership",
        description: "We believe strong relationships drive success. Our teams work closely with clients and factories to achieve shared goals and seamless execution.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
      },
      {
        icon: "🚀",
        title: "Continuous Improvement",
        description: "We invest in innovation, market insight, and process optimization to adapt to evolving fashion trends and global sourcing demands.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
      },
    ],
  },

  // CTA Section
  cta: {
    title: {
      type: String,
      default: "Ready to Build Your Next Collection?",
      trim: true,
    },
    description: {
      type: String,
      default: "Partner with us for reliable, ethical, and high-quality apparel sourcing solutions.",
      trim: true,
    },
    buttonText: {
      type: String,
      default: "CONTACT US TODAY",
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&h=400&fit=crop",
      trim: true,
    },
  },

  // Meta Information
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Add text index for search functionality
aboutPageSchema.index({
  "hero.title": "text",
  "hero.description": "text",
  "aboutContent.title": "text",
  "aboutContent.description": "text",
  "visionMission.vision.title": "text",
  "visionMission.mission.title": "text",
  "values.title": "text",
});

// Add indexes for faster queries
aboutPageSchema.index({ isActive: 1 });
aboutPageSchema.index({ createdAt: -1 });

// Virtual for full hero title
aboutPageSchema.virtual("hero.fullTitle").get(function() {
  return `${this.hero.title} ${this.hero.titleHighlight}`;
});

// Virtual for full about title
aboutPageSchema.virtual("aboutContent.fullTitle").get(function() {
  return `${this.aboutContent.title} ${this.aboutContent.titleHighlight}`;
});

// Virtual for formatted dates
aboutPageSchema.virtual("formattedDate").get(function() {
  return this.createdAt ? this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : null;
});

// Ensure virtuals are included in JSON output
aboutPageSchema.set("toJSON", { virtuals: true });
aboutPageSchema.set("toObject", { virtuals: true });

const AboutPage = model("AboutPage", aboutPageSchema);

export default AboutPage;