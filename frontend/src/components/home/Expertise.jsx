import { NavLink } from "react-router-dom";

const API_BASE = "https://api.ecogreentex.eu.com";

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  const normalized = img.replace(/\\/g, "/");
  const match = normalized.match(/uploads\/.+$/);
  const rel = match ? match[0] : normalized.replace(/^[A-Za-z]:\//, "");
  return `${API_BASE}/${rel}`;
};

const defaultExpertise = {
  badge: "OUR CORE EXPERTISE",
  title: "Comprehensive Apparel",
  titleHighlight: " Sourcing Solutions",
  subtitle: "We bridge the gap between global fashion brands and trusted manufacturing units in Bangladesh, delivering uncompromised quality and timely results through a one-stop solution.",
  cards: [
    { icon: "🎨", title: "Product Design & Development", description: "Leveraging global trend platforms like WCSN, we partner with customers to develop innovative designs across Knit, Woven, and Sweater categories for Men, Women, and Children.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop", alt: "Product Design and Development", gradient: "card-gradient-1" },
    { icon: "🏭", title: "Sourcing & Procurement", description: "Strategic raw material sourcing from certified suppliers ensuring quality, sustainability, and cost-effectiveness for every production run.", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop", alt: "Sourcing and Procurement", gradient: "card-gradient-2" },
    { icon: "✅", title: "Quality Assurance", description: "Rigorous multi-point inspection system with AQL standards, in-line testing, and final random inspection for zero-defect delivery.", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&h=600&fit=crop", alt: "Quality Assurance", gradient: "card-gradient-3" },
    { icon: "🚀", title: "Supply Chain Management", description: "End-to-end logistics coordination from factory to door, ensuring timely delivery with real-time tracking and compliance documentation.", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=600&fit=crop", alt: "Supply Chain Management", gradient: "card-gradient-4" },
  ],
};

const Expertise = ({ expertise }) => {
  const data = { ...defaultExpertise, ...(expertise || {}) };
  const cards = data.cards && data.cards.length ? data.cards : defaultExpertise.cards;

  return (
    <section className="expertise-section">
      <div className="expertise-container">
        {/* Header Section */}
        <div className="expertise-header">
          <div className="expertise-badge">
            <span className="badge-leaf"></span>
            {data.badge}
          </div>
          <h2 className="expertise-title">
            {data.title}
            <span className="title-highlight">{data.titleHighlight}</span>
          </h2>
          <p className="expertise-subtitle">{data.subtitle}</p>
        </div>

        {/* Expertise Cards Grid */}
        <div className="expertise-grid">
          {cards.map((card, index) => (
            <div className={`expertise-card ${card.gradient || ""}`} key={index}>
              <div className="card-image-wrapper">
                <img src={getImageUrl(card.image)} alt={card.alt || card.title} className="card-image" />
                <div className="card-overlay"></div>
                <div className="card-icon-badge">
                  <span className="card-icon">{card.icon}</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="expertise-cta">
          <NavLink to="/services" className="cta-button">
            EXPLORE ALL SERVICES
            <svg className="cta-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Expertise;
