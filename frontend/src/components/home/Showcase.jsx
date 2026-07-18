import { useState } from "react";

import { API_BASE } from "../../config";

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  const normalized = img.replace(/\\/g, "/");
  const match = normalized.match(/uploads\/.+$/);
  const rel = match ? match[0] : normalized.replace(/^[A-Za-z]:\//, "");
  return `${API_BASE}/${rel}`;
};

const defaultShowcase = {
  badge: "PRODUCT SHOWCASE",
  title: "Premium Apparel",
  titleHighlight: " For Global Brands",
  subtitle: "We specialize in high-quality apparel sourcing and development across Knit, Woven, and Sweater categories for Men, Women, and Children. From trendy street wear to formal collections, we ensure uncompromised quality in every piece.",
  products: [
    { image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop" },
    { image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop" },
    { image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&h=600&fit=crop" },
    { image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=600&fit=crop" },
    { image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=600&fit=crop" },
    { image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=600&fit=crop" },
  ],
};

const Showcase = ({ showcase }) => {
  const data = { ...defaultShowcase, ...(showcase || {}) };
  const products = data.products && data.products.length ? data.products : defaultShowcase.products;
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = Math.max(1, Math.ceil(products.length / 3));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="product-showcase">
      <div className="product-container">
        {/* Header Section */}
        <div className="product-header">
          <div className="product-badge">
            <span className="badge-spark">✨</span>
            {data.badge}
          </div>
          <h2 className="product-title">
            {data.title}
            <span className="title-highlight">{data.titleHighlight}</span>
          </h2>
          <p className="product-subtitle">{data.subtitle}</p>
        </div>

        {/* Slider Section */}
        <div className="slider-container">
          <button className="slider-nav prev" onClick={prevSlide} disabled={totalSlides <= 1}>
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="slider-track">
            <div
              className="slides-wrapper"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div className="slide" key={slideIndex}>
                  {products
                    .slice(slideIndex * 3, slideIndex * 3 + 3)
                    .map((product, idx) => (
                      <div className="product-card" key={slideIndex * 3 + idx}>
                        <div className="card-image-wrapper">
                          <img
                            src={getImageUrl(product.image)}
                            alt="product"
                            className="product-image"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <button className="slider-nav next" onClick={nextSlide} disabled={totalSlides <= 1}>
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        {totalSlides > 1 && (
          <div className="slider-dots">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Showcase;
