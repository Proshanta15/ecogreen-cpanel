import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/service.css";
import { API_BASE_URL, resolveMediaUrl } from "../config";


const ServicePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGender, setActiveGender] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/services?isActive=true`);
        const result = await response.json();
        if (response.ok && result.success) {
          // Guard: only show active categories on the public page
          setCategories(result.data.filter((c) => c.isActive !== false));
        } else {
          setError(result.message || "Failed to load services");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Resolve image paths: relative uploads get the backend base URL,
  // external URLs are used as-is, and missing images fall back to a placeholder.
  const getImageUrl = (img) => resolveMediaUrl(img);

  const handleGenderFilter = (categoryId, gender) => {
    setActiveGender((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === gender ? null : gender,
    }));
  };

  const getFilteredItems = (category) => {
    const activeGenderFilter = activeGender[category.id];

    let items = [];

    if (!activeGenderFilter || activeGenderFilter === "All") {
      Object.values(category.items || {}).forEach((genderItems) => {
        items = items.concat(genderItems);
      });
    } else {
      const genderKey = activeGenderFilter.toLowerCase();
      items = category.items?.[genderKey] || [];
    }

    return items;
  };

  const openModal = (item, category) => {
    setSelectedItem({ ...item, categoryTitle: category?.title });
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <section className="services-page">
        <div className="services-page-container">
          {/* Header Section */}
          <div className="services-page-header">
            <div className="services-page-badge">
              <span className="services-page-badge-icon">✦</span>
              OUR PRODUCT RANGE
            </div>
            <h1 className="services-page-title">
              Premium Apparel
              <span className="services-page-title-highlight">
                Collections
              </span>
            </h1>
            <p className="services-page-subtitle">
              Explore our comprehensive range of high-quality apparel sourcing
              solutions across categories for Men, Women, and Children.
            </p>
          </div>

          {/* Loading / Error States */}
          {loading && (
            <div className="services-page-no-items">
              <span className="services-page-no-items-icon">⏳</span>
              <p>Loading categories...</p>
            </div>
          )}

          {error && (
            <div className="services-page-no-items">
              <span className="services-page-no-items-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Categories */}
          {!loading && !error && (
            <div className="services-page-categories-wrapper">
              {categories.length > 0 ? (
                categories.map((category) => {
                  const filteredItems = getFilteredItems(category);
                  const activeGenderFilter = activeGender[category.id];

                  return (
                    <div
                      className="services-page-category-section"
                      key={category.id}
                    >
                      {/* Category Header */}
                      <div className="services-page-category-header">
                        <div className="services-page-category-header-left">
                          <div className="services-page-category-icon">
                            {category.icon}
                          </div>
                          <div>
                            <h2 className="services-page-category-title">
                              {category.title}
                            </h2>
                            <p className="services-page-category-description">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Category Image */}
                      <div className="services-page-category-image-wrapper">
                        <img
                          src={getImageUrl(category.image)}
                          alt={category.title}
                          className="services-page-category-image"
                        />
                      </div>

                      {/* Gender Filters */}
                      <div className="services-page-gender-filters">
                        <span className="services-page-filter-label">Gender:</span>
                        <button
                          className={`services-page-gender-btn ${!activeGenderFilter ? "active" : ""}`}
                          onClick={() =>
                            setActiveGender((prev) => ({
                              ...prev,
                              [category.id]: null,
                            }))
                          }
                        >
                          All
                        </button>
                        {category.gender?.map((gender) => (
                          <button
                            key={gender}
                            className={`services-page-gender-btn ${activeGenderFilter === gender ? "active" : ""}`}
                            onClick={() => handleGenderFilter(category.id, gender)}
                          >
                            {gender === "Men"
                              ? "👨"
                              : gender === "Women"
                                ? "👩"
                                : "👶"}
                            {gender}
                          </button>
                        ))}
                      </div>

                      {/* Items Grid */}
                      <div className="services-page-items-grid">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item, idx) => (
                            <div
                              className="services-page-item-card"
                              key={idx}
                              onClick={() => openModal(item, category)}
                            >
                              <div className="services-page-item-image-wrapper">
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                  className="services-page-item-image"
                                />
                                <div className="services-page-item-overlay">
                                  <span className="services-page-item-view-icon">
                                    🔍
                                  </span>
                                  <span className="services-page-item-view-text">
                                    View Details
                                  </span>
                                </div>
                              </div>
                              <div className="services-page-item-info">
                                <span className="services-page-item-name">
                                  {item.name}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="services-page-no-items">
                            <span className="services-page-no-items-icon">📦</span>
                            <p>No items available for this category</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="services-page-no-items">
                  <span className="services-page-no-items-icon">📭</span>
                  <p>No categories found</p>
                </div>
              )}
            </div>
          )}

          {/* CTA Section */}
          <div className="services-page-cta">
            <div className="services-page-cta-content">
              <h2 className="services-page-cta-title">
                Ready to Source Your Collection?
              </h2>
              <p className="services-page-cta-description">
                Let us help you bring your fashion vision to life with our
                comprehensive apparel sourcing solutions.
              </p>
              <NavLink to="/contact" className="services-page-cta-btn">
                Get a Free Consultation
                <span className="services-page-cta-arrow">→</span>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="services-page-modal-overlay" onClick={closeModal}>
          <div
            className="services-page-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="services-page-modal-close" onClick={closeModal}>
              <span>×</span>
            </button>
            <div className="services-page-modal-content">
              <div className="services-page-modal-image-wrapper">
                <img
                  src={getImageUrl(selectedItem.image)}
                  alt={selectedItem.name}
                  className="services-page-modal-image"
                />
              </div>
              <div className="services-page-modal-info">
                <div className="services-page-modal-icon">
                  {selectedItem.icon}
                </div>
                <h2 className="services-page-modal-title">
                  {selectedItem.name}
                </h2>
                <div className="services-page-modal-details">
                  <div className="services-page-modal-detail">
                    <span className="services-page-modal-detail-label">
                      Category:
                    </span>
                    <span className="services-page-modal-detail-value">
                      {selectedItem.categoryTitle || "Premium Collection"}
                    </span>
                  </div>
                  <div className="services-page-modal-detail">
                    <span className="services-page-modal-detail-label">
                      Quality:
                    </span>
                    <span className="services-page-modal-detail-value">
                      ISO Certified
                    </span>
                  </div>
                  <div className="services-page-modal-detail">
                    <span className="services-page-modal-detail-label">
                      Material:
                    </span>
                    <span className="services-page-modal-detail-value">
                      Premium Quality
                    </span>
                  </div>
                </div>
                <NavLink
                  to="/contact"
                  className="services-page-modal-btn"
                  onClick={closeModal}
                >
                  Request a Quote
                  <span className="services-page-modal-btn-arrow">→</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicePage;
