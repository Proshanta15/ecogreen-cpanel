import React from 'react'
import { API_BASE_URL, resolveMediaUrl } from '../../config';

const getImageUrl = (img) => resolveMediaUrl(img);

const defaultBrands = {
  badge: "OUR PARTNERS",
  title: "Trusted By Leading",
  titleHighlight: " Global Brands",
  subtitle: "Join 500+ satisfied brands worldwide",
  brands: [
    { name: "RENNER", logo: "https://placehold.co/200x80/1b5e3f/white?text=RENNER&font=montserrat" },
    { name: "emanuel ungaro", logo: "https://placehold.co/200x80/2d6a4f/white?text=EMANUEL+UNGARO&font=montserrat" },
    { name: "RINA", logo: "https://placehold.co/200x80/1b5e3f/white?text=RINA&font=montserrat" },
    { name: "MA", logo: "https://placehold.co/200x80/2d6a4f/white?text=MA&font=montserrat" },
    { name: "BONITA", logo: "https://placehold.co/200x80/1b5e3f/white?text=BONITA&font=montserrat" },
    { name: "SageHill.", logo: "https://placehold.co/200x80/2d6a4f/white?text=SageHill&font=montserrat" },
    { name: "Kappa", logo: "https://placehold.co/200x80/1b5e3f/white?text=KAPPA&font=montserrat" },
  ],
  trustIndicators: [
    { icon: "🏆", title: "10+ Years", subtitle: "Of Excellence" },
    { icon: "🌍", title: "25+ Countries", subtitle: "Worldwide Reach" },
    { icon: "⭐", title: "98%", subtitle: "Client Retention" },
  ],
};

const Brands = ({ brands }) => {
  const data = { ...defaultBrands, ...(brands || {}) };
  const brandList = data.brands && data.brands.length ? data.brands : defaultBrands.brands;
  const trustIndicators = data.trustIndicators && data.trustIndicators.length ? data.trustIndicators : defaultBrands.trustIndicators;

  return (
    <section className="trusted-brands">
      <div className="brands-container">
        {/* Header Section */}
        <div className="brands-header">
          <div className="brands-badge">
            <span className="badge-icon">⭐</span>
            {data.badge}
          </div>
          <h2 className="brands-title">
            {data.title}
            <span className="title-highlight">{data.titleHighlight}</span>
          </h2>
          <div className="brands-subtitle-wrapper">
            <div className="subtitle-line"></div>
            <p className="brands-subtitle">{data.subtitle}</p>
            <div className="subtitle-line"></div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="brands-grid">
          {brandList.map((brand, index) => (
            <div className="brand-card" key={index}>
              <div className="brand-logo-wrapper">
                <div className="brand-glow"></div>
                <img
                  src={getImageUrl(brand.logo)}
                  alt={brand.name}
                  className="brand-logo"
                />
              </div>
              <div className="brand-overlay">
                <span className="brand-name">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          {trustIndicators.map((indicator, index) => (
            <React.Fragment key={index}>
              <div className="indicator">
                <div className="indicator-icon">{indicator.icon}</div>
                <div className="indicator-content">
                  <h4>{indicator.title}</h4>
                  <p>{indicator.subtitle}</p>
                </div>
              </div>
              {index < trustIndicators.length - 1 && <div className="indicator-divider"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Brands
