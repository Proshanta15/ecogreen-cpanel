import { Schema, model } from "mongoose";

const footerShowcaseSchema = new Schema({
  visitTitle: {
    type: String,
    default: "Visit & Connect",
    trim: true,
  },
  address: {
    type: String,
    default: "Rashid Court, House-4, Road-7\nSector-3, Uttara, Dhaka",
    trim: true,
  },
  phone: {
    type: String,
    default: "+8801518-900571",
    trim: true,
  },
  phoneLabel: {
    type: String,
    default: "(Hotline)",
    trim: true,
  },
  email: {
    type: String,
    default: "sobuj@ecogreentex.eu.com",
    trim: true,
  },
  hours: {
    type: String,
    default: "Sun–Thu: 9:00 AM – 6:00 PM (BST)",
    trim: true,
  },
  highlightTitle: {
    type: String,
    default: "Let's build your next collection",
    trim: true,
  },
  highlightDescription: {
    type: String,
    default:
      "From denim to high-street casuals, activewear to loungewear — we reduce lead times while ensuring transparency and premium quality. Request a sourcing consultation.",
    trim: true,
  },
  buttonText: {
    type: String,
    default: "Get in touch",
    trim: true,
  },
  buttonLink: {
    type: String,
    default: "/contact",
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

footerShowcaseSchema.index({ isActive: 1 });
footerShowcaseSchema.index({ createdAt: -1 });

footerShowcaseSchema.set("toJSON", { virtuals: true });
footerShowcaseSchema.set("toObject", { virtuals: true });

const FooterShowcase = model("FooterShowcase", footerShowcaseSchema);

export default FooterShowcase;
