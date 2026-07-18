import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Faq from "../components/Faq";
import FooterShowcase from "../components/FooterShowcase";
import IsLoading from "../components/IsLoading";
import "../styles/about-us.css";

import { API_BASE } from "../config";

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  const normalized = img.replace(/\\/g, "/");
  const match = normalized.match(/uploads\/.+$/);
  const rel = match ? match[0] : normalized.replace(/^[A-Za-z]:\//, "");
  return `${API_BASE}/${rel}`;
};

const defaultData = {
  hero: {
    badge: "ISO-CERTIFIED APPAREL SOURCING PARTNER",
    title: "Connecting Global Fashion Brands",
    titleHighlight: "With Trusted Manufacturing Excellence",
    description: "",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&h=600&fit=crop",
    floatingCards: {
      card1: { icon: "🏭", number: "500+", label: "Factories Network" },
      card2: { icon: "🌍", number: "25+", label: "Countries" },
    },
  },
  stats: [],
  aboutContent: {
    badge: "ABOUT US",
    title: "Your Trusted Partner in",
    titleHighlight: "Global Apparel Sourcing",
    description: "",
    description2: "",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop",
  },
  visionMission: {
    vision: { icon: "👁️", title: "Our Vision", description: "", image: "" },
    mission: { icon: "🎯", title: "Our Mission", description: "", image: "" },
  },
  values: [],
  cta: {
    title: "Ready to Build Your Next Collection?",
    description: "Partner with us for reliable, ethical, and high-quality apparel sourcing solutions.",
    buttonText: "CONTACT US TODAY",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&h=400&fit=crop",
  },
};

const AboutPage = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/about`, {
          method: "GET",
        });
        const result = await response.json();
        if (response.ok && result.success && result.data) {
          const merged = deepMerge(defaultData, result.data);
          setData(merged);
        }
      } catch (error) {
        console.error("Error fetching about page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="about-page-loading">
        <IsLoading />
      </div>
    );
  }

  const { hero, stats, aboutContent, visionMission, values, cta } = data;
  const safeValues = values || [];
  const safeStats = stats || [];

  return (
    <>
      <section className="about-page">
        <div className="about-page-container">
          {/* Hero Section */}
          <div className="about-page-hero">
            <div className="about-page-hero-content">
              <div className="about-page-hero-text">
                <div className="about-page-hero-badge">
                  <span className="about-page-badge-dot"></span>
                  {hero.badge}
                </div>
                <h1 className="about-page-hero-title">
                  {hero.title}
                  {hero.titleHighlight && (
                    <span className="about-page-title-highlight">
                      {hero.titleHighlight}
                    </span>
                  )}
                </h1>
                <p className="about-page-hero-description">{hero.description}</p>
                <div className="about-page-hero-stats">
                  {safeStats.map((stat, index) => (
                    <React.Fragment key={index}>
                      <div className="about-page-hero-stat">
                        <span className="about-page-stat-number">{stat.number}</span>
                        <span className="about-page-stat-label">{stat.label}</span>
                      </div>
                      {index < safeStats.length - 1 && (
                        <div className="about-page-stat-divider"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="about-page-hero-image-wrapper">
                <img
                  src={getImageUrl(hero.image)}
                  alt="Apparel Sourcing"
                  className="about-page-hero-image"
                />
                {hero.floatingCards?.card1 && (
                  <div className="about-page-floating-card about-page-fc-1">
                    <span className="about-page-fc-icon">{hero.floatingCards.card1.icon}</span>
                    <div>
                      <h4>{hero.floatingCards.card1.number}</h4>
                      <p>{hero.floatingCards.card1.label}</p>
                    </div>
                  </div>
                )}
                {hero.floatingCards?.card2 && (
                  <div className="about-page-floating-card about-page-fc-2">
                    <span className="about-page-fc-icon">{hero.floatingCards.card2.icon}</span>
                    <div>
                      <h4>{hero.floatingCards.card2.number}</h4>
                      <p>{hero.floatingCards.card2.label}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="about-page-content">
            <div className="about-page-content-grid">
              <div className="about-page-content-text">
                <div className="about-page-content-badge">{aboutContent.badge}</div>
                <h2 className="about-page-content-title">
                  {aboutContent.title}
                  {aboutContent.titleHighlight && (
                    <span className="about-page-title-highlight">
                      {aboutContent.titleHighlight}
                    </span>
                  )}
                </h2>
                <p>{aboutContent.description}</p>
                {aboutContent.description2 && <p>{aboutContent.description2}</p>}
              </div>
              <div className="about-page-content-image-wrapper">
                <img
                  src={getImageUrl(aboutContent.image)}
                  alt="Apparel Manufacturing"
                  className="about-page-content-image"
                />
                <div className="about-page-image-overlay">
                  <span className="about-page-play-icon">▶</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="about-page-vision-mission">
            <div className="about-page-vm-card about-page-vision">
              <div className="about-page-vm-image-wrapper">
                <img
                  src={getImageUrl(visionMission.vision.image)}
                  alt="Vision"
                  className="about-page-vm-image"
                />
                <div className="about-page-vm-overlay"></div>
              </div>
              <div className="about-page-vm-content">
                <div className="about-page-vm-icon">{visionMission.vision.icon}</div>
                <h3 className="about-page-vm-title">{visionMission.vision.title}</h3>
                <p className="about-page-vm-description">
                  {visionMission.vision.description}
                </p>
              </div>
            </div>
            <div className="about-page-vm-card about-page-mission">
              <div className="about-page-vm-image-wrapper">
                <img
                  src={getImageUrl(visionMission.mission.image)}
                  alt="Mission"
                  className="about-page-vm-image"
                />
                <div className="about-page-vm-overlay"></div>
              </div>
              <div className="about-page-vm-content">
                <div className="about-page-vm-icon">{visionMission.mission.icon}</div>
                <h3 className="about-page-vm-title">{visionMission.mission.title}</h3>
                <p className="about-page-vm-description">
                  {visionMission.mission.description}
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="about-page-values">
            <div className="about-page-values-header">
              <div className="about-page-values-badge">
                <span className="about-page-badge-star">✦</span>
                THE PRINCIPLES WE STAND FOR
              </div>
              <h2 className="about-page-values-title">Our Values</h2>
            </div>
            <div className="about-page-values-grid">
              {safeValues.map((value, index) => (
                <div className="about-page-value-card" key={value._id || index}>
                  <div className="about-page-value-image-wrapper">
                    <img
                      src={getImageUrl(value.image)}
                      alt={value.title}
                      className="about-page-value-image"
                    />
                    <div className="about-page-value-icon-overlay">
                      <span className="about-page-value-icon">{value.icon}</span>
                    </div>
                  </div>
                  <div className="about-page-value-content">
                    <h4 className="about-page-value-title">{value.title}</h4>
                    <p className="about-page-value-description">{value.description}</p>
                    <div className="about-page-value-number">
                      0{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="about-page-cta">
          <div className="about-page-cta-background">
            <img
              src={getImageUrl(cta.image)}
              alt="CTA Background"
              className="about-page-cta-bg-image"
            />
            <div className="about-page-cta-overlay"></div>
          </div>
          <div className="about-page-cta-content">
            <h3 className="about-page-cta-title">{cta.title}</h3>
            <p className="about-page-cta-description">{cta.description}</p>
            <NavLink to="/contact" className="about-page-cta-button">
              {cta.buttonText}
              <span className="about-page-cta-arrow">→</span>
            </NavLink>
          </div>
        </div>
      </section>
      <Faq />
      <FooterShowcase />
    </>
  );
};

function deepMerge(base, override) {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }
  if (base && typeof base === "object") {
    const result = { ...base };
    Object.keys(base).forEach((key) => {
      if (override && Object.prototype.hasOwnProperty.call(override, key)) {
        result[key] = deepMerge(base[key], override[key]);
      }
    });
    return result;
  }
  return override !== undefined ? override : base;
}

export default AboutPage;
