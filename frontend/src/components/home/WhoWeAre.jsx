import React from "react";
import { NavLink } from "react-router-dom";

const defaultWhoWeAre = {
  badge: "WHO WE ARE",
  title: "Your ISO-Certified",
  titleHighlight: " Sourcing Partner",
  description: "EcoGreenTex is a leading apparel buying house based in Dhaka, Bangladesh, dedicated to bridging the gap between global fashion brands and high-quality manufacturing. We specialize in comprehensive apparel sourcing, innovative product development, and rigorous quality assurance.",
  description2: "With a strong commitment to ethical, eco-friendly, and responsible sourcing, we provide a one-stop solution for international buyers. Our team works tirelessly to ensure uncompromised quality, competitive pricing, and timely delivery, helping our partners bring their fashion visions to life with absolute reliability.",
  buttonText: "LEARN MORE",
  buttonLink: "/about",
  cards: [
    { icon: "ISO 9001", title: "ISO 9001", subtitle: "Certified Quality" },
    { icon: "100+", title: "100+", subtitle: "Global Partners" },
    { icon: "Eco-Friendly", title: "Eco-Friendly", subtitle: "Sustainable Practices" },
  ],
  stats: [
    { number: "15", label: "Years Experience" },
    { number: "500", label: "Factories Network" },
    { number: "50", label: "Global Brands" },
  ],
};

const WhoWeAre = ({ whoWeAre }) => {
  const data = { ...defaultWhoWeAre, ...(whoWeAre || {}) };
  const cards = data.cards && data.cards.length ? data.cards : defaultWhoWeAre.cards;
  const stats = data.stats && data.stats.length ? data.stats : defaultWhoWeAre.stats;

  return (
    <section className="about-section">
      <div className="about-container">
        {/* Left Side - Content */}
        <div className="about-content">
          <div className="about-badge">
            <span className="badge-dot"></span>
            {data.badge}
          </div>

          <h2 className="about-title">
            {data.title}
            <span className="title-highlight">{data.titleHighlight}</span>
          </h2>

          <p className="about-description">{data.description}</p>

          <p className="about-description second">{data.description2}</p>
          <NavLink to={data.buttonLink || "/about"} className="about-btn">
            {data.buttonText}
            <span className="btn-arrow">→</span>
          </NavLink>
        </div>

        {/* Right Side - Visual Elements */}
        <div className="about-visual">
          <div className="visual-card">
            {cards.map((card, index) => (
              <div className={`floating-card card-${index + 1}`} key={index}>
                <div className="card-icon">
                  <span className="card-icon-text">{card.icon}</span>
                </div>
                <div className="card-text">
                  <h4>{card.title}</h4>
                  <p>{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-container">
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                <div className="stat-item">
                  <div className="stat-number" data-target={stat.number}>
                    {stat.number}
                  </div>
                  <p>{stat.label}</p>
                </div>
                {index < stats.length - 1 && <div className="stat-divider"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
