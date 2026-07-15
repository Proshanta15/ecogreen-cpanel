import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import IsLoading from "../components/IsLoading";
import "../styles/contact-content.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaXTwitter, FaSquareFacebook, FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { API_BASE_URL } from "../config";


const ContactContentForm = () => {
  const [contactContentData, setContactContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authorizationToken } = useAuth();

  const getContactContentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact/content`,
        {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const contactData = result.data[0];
        setContactContentData(contactData);
      }
    } catch (error) {
      console.error("Error fetching contact content:", error);
      toast.error("Failed to fetch contact content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContactContentData();
  }, []);

  if (loading) {
    return (
      <div className="contact-loading">
        <div className="contact-loading-spinner"></div>
        <IsLoading />
      </div>
    );
  }

  return (
    <main className="contact-content-page">
      <div className="contact-content-container">
        {/* Header */}
        <div className="contact-content-header">
          <div className="contact-content-header-top">
            <span className="contact-content-badge">📋 Content Management</span>
          </div>
          <h1 className="contact-content-title">Contact Page Content</h1>
          <p className="contact-content-subtitle">
            Manage your contact page information
          </p>
        </div>

        {/* Main Card */}
        <div className="contact-content-card">
          {/* Title & Subtitle */}
          <div className="contact-content-section">
            <span className="contact-content-label">Title</span>
            <h2 className="contact-content-value-title">
              {contactContentData?.title || "Not set"}
            </h2>
            {contactContentData?.subtitle && (
              <p className="contact-content-value-subtitle">
                {contactContentData.subtitle}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="contact-content-section">
            <span className="contact-content-label">Description</span>
            <p className="contact-content-value-description">
              {contactContentData?.description || "Not set"}
            </p>
          </div>

          {/* Contact Info Grid */}
          <div className="contact-content-grid">
            <div className="contact-content-item">
              <span className="contact-content-item-icon">📞</span>
              <div>
                <span className="contact-content-item-label">Phone</span>
                <a
                  href={`tel:${contactContentData?.phone}`}
                  className="contact-content-item-value"
                >
                  {contactContentData?.phone || "Not set"}
                </a>
              </div>
            </div>
            <div className="contact-content-item">
              <span className="contact-content-item-icon">✉️</span>
              <div>
                <span className="contact-content-item-label">Email</span>
                <a
                  href={`mailto:${contactContentData?.email}`}
                  className="contact-content-item-value"
                >
                  {contactContentData?.email || "Not set"}
                </a>
              </div>
            </div>
            <div className="contact-content-item">
              <span className="contact-content-item-icon">📍</span>
              <div>
                <span className="contact-content-item-label">Bangladesh Office</span>
                <p className="contact-content-item-value">
                  {contactContentData?.bangladeshOffice || "Not set"}
                </p>
              </div>
            </div>
            <div className="contact-content-item">
              <span className="contact-content-item-icon">🌏</span>
              <div>
                <span className="contact-content-item-label">China Office</span>
                <p className="contact-content-item-value">
                  {contactContentData?.chinaOffice || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Social Links - Same card style as contact info */}
          <div className="contact-content-section">
            <span className="contact-content-label">Social Links</span>
            <div className="contact-content-social-grid">
              <div className="contact-content-item">
                <span className="contact-content-item-icon"><FaLinkedin /></span>
                <div>
                  <span className="contact-content-item-label">LinkedIn</span>
                  {contactContentData?.linkedin ? (
                    <a
                      href={contactContentData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-content-item-value social-link-value linkedin"
                    >
                      {contactContentData.linkedin}
                    </a>
                  ) : (
                    <p className="contact-content-item-value empty">Not set</p>
                  )}
                </div>
              </div>

              <div className="contact-content-item">
                <span className="contact-content-item-icon"><FaSquareInstagram /></span>
                <div>
                  <span className="contact-content-item-label">Instagram</span>
                  {contactContentData?.instagram ? (
                    <a
                      href={contactContentData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-content-item-value social-link-value instagram"
                    >
                      {contactContentData.instagram}
                    </a>
                  ) : (
                    <p className="contact-content-item-value empty">Not set</p>
                  )}
                </div>
              </div>

              <div className="contact-content-item">
                <span className="contact-content-item-icon"><FaSquareFacebook /></span>
                <div>
                  <span className="contact-content-item-label">Facebook</span>
                  {contactContentData?.facebook ? (
                    <a
                      href={contactContentData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-content-item-value social-link-value facebook"
                    >
                      {contactContentData.facebook}
                    </a>
                  ) : (
                    <p className="contact-content-item-value empty">Not set</p>
                  )}
                </div>
              </div>

              <div className="contact-content-item">
                <span className="contact-content-item-icon"><FaXTwitter /></span>
                <div>
                  <span className="contact-content-item-label">Twitter / X</span>
                  {contactContentData?.twitter ? (
                    <a
                      href={contactContentData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-content-item-value social-link-value twitter"
                    >
                      {contactContentData.twitter}
                    </a>
                  ) : (
                    <p className="contact-content-item-value empty">Not set</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Update Button */}
          <div className="contact-content-footer">
            <div className="contact-content-footer-left">
              
            </div>
            <Link to={`/admin/contact/content/update/${contactContentData?._id}`} className="contact-content-update-btn">
              ✏️ Update Content
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactContentForm;