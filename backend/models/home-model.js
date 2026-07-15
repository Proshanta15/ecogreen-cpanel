import { Schema, model } from "mongoose";

const cardSchema = new Schema({
  icon: { type: String, default: "", trim: true },
  title: { type: String, default: "", trim: true },
  subtitle: { type: String, default: "", trim: true },
}, { _id: true });

const statSchema = new Schema({
  number: { type: String, default: "", trim: true },
  label: { type: String, default: "", trim: true },
}, { _id: true });

const expertiseCardSchema = new Schema({
  icon: { type: String, default: "", trim: true },
  title: { type: String, default: "", trim: true },
  description: { type: String, default: "", trim: true },
  image: { type: String, default: "", trim: true },
  alt: { type: String, default: "", trim: true },
  gradient: { type: String, default: "", trim: true },
}, { _id: true });

const featureSchema = new Schema({
  icon: { type: String, default: "", trim: true },
  title: { type: String, default: "", trim: true },
  description: { type: String, default: "", trim: true },
  gradient: { type: String, default: "", trim: true },
}, { _id: true });

const productSchema = new Schema({
  image: { type: String, default: "", trim: true },
}, { _id: true });

const brandSchema = new Schema({
  name: { type: String, default: "", trim: true },
  logo: { type: String, default: "", trim: true },
}, { _id: true });

const trustIndicatorSchema = new Schema({
  icon: { type: String, default: "", trim: true },
  title: { type: String, default: "", trim: true },
  subtitle: { type: String, default: "", trim: true },
}, { _id: true });

const homePageSchema = new Schema({
  // Banner / Hero Section
  banner: {
    title: {
      type: String,
      default: "Your Global Partner",
      trim: true,
    },
    titleHighlight: {
      type: String,
      default: "For Sustainable Apparel Sourcing",
      trim: true,
    },
    description: {
      type: String,
      default: "Eco Green Tex Ltd. is an ISO-certified buying house in Dhaka, connecting world-class fashion brands with trusted, ethical factories across Bangladesh. We deliver uncompromised quality and timely delivery for every collection.",
      trim: true,
    },
    buttonText: {
      type: String,
      default: "EXPLORE OUR SERVICES",
      trim: true,
    },
    buttonLink: {
      type: String,
      default: "/services",
      trim: true,
    },
    video: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    showVideo: {
      type: Boolean,
      default: true,
    },
    showImage: {
      type: Boolean,
      default: false,
    },
  },

  // Who We Are Section
  whoWeAre: {
    badge: {
      type: String,
      default: "WHO WE ARE",
      trim: true,
    },
    title: {
      type: String,
      default: "Your ISO-Certified",
      trim: true,
    },
    titleHighlight: {
      type: String,
      default: " Sourcing Partner",
      trim: true,
    },
    description: {
      type: String,
      default: "EcoGreenTex is a leading apparel buying house based in Dhaka, Bangladesh, dedicated to bridging the gap between global fashion brands and high-quality manufacturing. We specialize in comprehensive apparel sourcing, innovative product development, and rigorous quality assurance.",
      trim: true,
    },
    description2: {
      type: String,
      default: "With a strong commitment to ethical, eco-friendly, and responsible sourcing, we provide a one-stop solution for international buyers. Our team works tirelessly to ensure uncompromised quality, competitive pricing, and timely delivery, helping our partners bring their fashion visions to life with absolute reliability.",
      trim: true,
    },
    buttonText: {
      type: String,
      default: "LEARN MORE",
      trim: true,
    },
    buttonLink: {
      type: String,
      default: "/about",
      trim: true,
    },
    cards: {
      type: [cardSchema],
      default: [
        { icon: "ISO 9001", title: "ISO 9001", subtitle: "Certified Quality" },
        { icon: "100+", title: "100+", subtitle: "Global Partners" },
        { icon: "Eco-Friendly", title: "Eco-Friendly", subtitle: "Sustainable Practices" },
      ],
    },
    stats: {
      type: [statSchema],
      default: [
        { number: "15", label: "Years Experience" },
        { number: "500", label: "Factories Network" },
        { number: "50", label: "Global Brands" },
      ],
    },
  },

  // Expertise Section
  expertise: {
    badge: {
      type: String,
      default: "OUR CORE EXPERTISE",
      trim: true,
    },
    title: {
      type: String,
      default: "Comprehensive Apparel",
      trim: true,
    },
    titleHighlight: {
      type: String,
      default: " Sourcing Solutions",
      trim: true,
    },
    subtitle: {
      type: String,
      default: "We bridge the gap between global fashion brands and trusted manufacturing units in Bangladesh, delivering uncompromised quality and timely results through a one-stop solution.",
      trim: true,
    },
    cards: {
      type: [expertiseCardSchema],
      default: [
        {
          icon: "🎨",
          title: "Product Design & Development",
          description: "Leveraging global trend platforms like WCSN, we partner with customers to develop innovative designs across Knit, Woven, and Sweater categories for Men, Women, and Children.",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop",
          alt: "Product Design and Development",
          gradient: "card-gradient-1",
        },
        {
          icon: "🏭",
          title: "Sourcing & Procurement",
          description: "Strategic raw material sourcing from certified suppliers ensuring quality, sustainability, and cost-effectiveness for every production run.",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop",
          alt: "Sourcing and Procurement",
          gradient: "card-gradient-2",
        },
        {
          icon: "✅",
          title: "Quality Assurance",
          description: "Rigorous multi-point inspection system with AQL standards, in-line testing, and final random inspection for zero-defect delivery.",
          image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&h=600&fit=crop",
          alt: "Quality Assurance",
          gradient: "card-gradient-3",
        },
        {
          icon: "🚀",
          title: "Supply Chain Management",
          description: "End-to-end logistics coordination from factory to door, ensuring timely delivery with real-time tracking and compliance documentation.",
          image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=600&fit=crop",
          alt: "Supply Chain Management",
          gradient: "card-gradient-4",
        },
      ],
    },
  },

  // Partner / Why Choose Us Section
  partner: {
    badge: {
      type: String,
      default: "TRUSTED SOURCING PARTNER",
      trim: true,
    },
    title: {
      type: String,
      default: "Why Brands Choose",
      trim: true,
    },
    titleHighlight: {
      type: String,
      default: " To Work With Us",
      trim: true,
    },
    subtitle: {
      type: String,
      default: "A Partnership Built On Reliability & Trust",
      trim: true,
    },
    descriptionTitle: {
      type: String,
      default: "Every project is driven by collaboration",
      trim: true,
    },
    descriptionText: {
      type: String,
      default: "Every project is driven by collaboration, accountability, and precise execution. We work closely with clients and factories to stay aligned on pricing, quality, timelines, and compliance – ensuring smooth operations and dependable delivery.",
      trim: true,
    },
    descriptionText2: {
      type: String,
      default: "We operate as an extension of your team – managing product development, factory coordination, quality assurance, and shipment execution with transparency and precision. Our commitment to ethical sourcing and consistent quality keeps leading global brands working with us.",
      trim: true,
    },
    descriptionStats: {
      type: [statSchema],
      default: [
        { number: "10+", label: "Years Excellence" },
        { number: "500+", label: "Happy Brands" },
        { number: "100%", label: "On-Time Delivery" },
      ],
    },
    features: {
      type: [featureSchema],
      default: [
        { icon: "👥", title: "Experienced Team", description: "Our team brings decades of hands-on expertise across product development, merchandising, quality control, and supply chain management – ensuring every order is executed with precision and accountability.", gradient: "gradient-1" },
        { icon: "🏭", title: "Certified Factories", description: "We work only with ethically audited, globally certified factories equipped with modern production facilities – ensuring responsible sourcing, workplace safety, and consistent product quality.", gradient: "gradient-2" },
        { icon: "⚙️", title: "Custom Solutions", description: "Every brand has unique priorities, so we tailor sourcing strategies around pricing, capacity, sustainability, and speed to market – delivering flexible, scalable production solutions.", gradient: "gradient-3" },
        { icon: "💬", title: "Transparent Communication", description: "We maintain clear, proactive communication with real-time production updates and technical support – ensuring smooth execution and zero surprises throughout the process.", gradient: "gradient-4" },
        { icon: "⏰", title: "On-Time Delivery", description: "Through structured timelines, factory coordination, and shipment tracking, we deliver dependable lead times and punctual shipments from sampling to final logistics.", gradient: "gradient-5" },
        { icon: "🤝", title: "Brand Partners", description: "Trusted by leading global brands for our integrity, consistent performance, and sustainable sourcing approach – reflected in long-term, value-driven partnerships.", gradient: "gradient-6" },
      ],
    },
    ctaText: {
      type: String,
      default: "Join our growing list of satisfied brand partners",
      trim: true,
    },
    ctaButtonText: {
      type: String,
      default: "START YOUR JOURNEY",
      trim: true,
    },
    ctaLink: {
      type: String,
      default: "/contact",
      trim: true,
    },
  },

  // Showcase Section
  showcase: {
    badge: {
      type: String,
      default: "PRODUCT SHOWCASE",
      trim: true,
    },
    title: {
      type: String,
      default: "Premium Apparel",
      trim: true,
    },
    titleHighlight: {
      type: String,
      default: " For Global Brands",
      trim: true,
    },
    subtitle: {
      type: String,
      default: "We specialize in high-quality apparel sourcing and development across Knit, Woven, and Sweater categories for Men, Women, and Children. From trendy street wear to formal collections, we ensure uncompromised quality in every piece.",
      trim: true,
    },
    products: {
      type: [productSchema],
      default: [
        { image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop" },
        { image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop" },
        { image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&h=600&fit=crop" },
        { image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=600&fit=crop" },
        { image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=600&fit=crop" },
        { image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=600&fit=crop" },
      ],
    },
  },

  // Brands Section
  brands: {
    badge: {
      type: String,
      default: "OUR PARTNERS",
      trim: true,
    },
    title: {
      type: String,
      default: "Trusted By Leading",
      trim: true,
    },
    titleHighlight: {
      type: String,
      default: " Global Brands",
      trim: true,
    },
    subtitle: {
      type: String,
      default: "Join 500+ satisfied brands worldwide",
      trim: true,
    },
    brands: {
      type: [brandSchema],
      default: [
        { name: "RENNER", logo: "https://placehold.co/200x80/1b5e3f/white?text=RENNER&font=montserrat" },
        { name: "emanuel ungaro", logo: "https://placehold.co/200x80/2d6a4f/white?text=EMANUEL+UNGARO&font=montserrat" },
        { name: "RINA", logo: "https://placehold.co/200x80/1b5e3f/white?text=RINA&font=montserrat" },
        { name: "MA", logo: "https://placehold.co/200x80/2d6a4f/white?text=MA&font=montserrat" },
        { name: "BONITA", logo: "https://placehold.co/200x80/1b5e3f/white?text=BONITA&font=montserrat" },
        { name: "SageHill.", logo: "https://placehold.co/200x80/2d6a4f/white?text=SageHill&font=montserrat" },
        { name: "Kappa", logo: "https://placehold.co/200x80/1b5e3f/white?text=KAPPA&font=montserrat" },
      ],
    },
    trustIndicators: {
      type: [trustIndicatorSchema],
      default: [
        { icon: "🏆", title: "10+ Years", subtitle: "Of Excellence" },
        { icon: "🌍", title: "25+ Countries", subtitle: "Worldwide Reach" },
        { icon: "⭐", title: "98%", subtitle: "Client Retention" },
      ],
    },
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Text indexes for search
homePageSchema.index({
  "banner.title": "text",
  "whoWeAre.title": "text",
  "expertise.title": "text",
  "partner.title": "text",
  "showcase.title": "text",
  "brands.title": "text",
});

homePageSchema.index({ isActive: 1 });
homePageSchema.index({ createdAt: -1 });

homePageSchema.set("toJSON", { virtuals: true });
homePageSchema.set("toObject", { virtuals: true });

const HomePage = model("HomePage", homePageSchema);

export default HomePage;
