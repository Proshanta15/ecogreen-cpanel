import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IsLoading from "../components/IsLoading";
import { useAuth } from "../store/auth";
import "../styles/contact-content-update.css";

const API_BASE = "https://api.ecogreentex.eu.com";

const ContactContentUpdate = () => {
  const [contactContentData, setContactContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const getContactContentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/api/admin/contact/content`,
        {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Since you always have one data field, get the first item directly
      if (result.success && result.data && result.data.length > 0) {
        // Get the first item from the array
        const contactData = result.data[0];
        setContactContentData(contactData);
      } else {
        console.log("Data not show");
      }
    } catch (error) {
      console.error("Error fetching contact content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactContentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/api/admin/contact/content/update/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorizationToken
        },
        body: JSON.stringify(contactContentData)
      });
      if (response.ok) {
        toast.success("Contact content updated successfully");
        navigate('/admin/contact/content');
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Error updating contact");
    }
  }

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
    <main className="contact-content-form-page">
      <section className="contact-content-form-card">
        <div className="contact-content-form-header">
          <h1>Update Contact Content</h1>
          <p>
            Fill in the contact information below to update the contact content.
          </p>
        </div>

        <form className="contact-content-form" onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="contact-content-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter page title (e.g., Let's Start a Conversation)"
              value={contactContentData?.title}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Subtitle Field */}
          <div className="contact-content-field">
            <label htmlFor="title">Subtitle</label>
            <input
              id="subtitle"
              name="subtitle"
              type="text"
              placeholder="Enter last title (e.g., Let's Start a Conversation)"
              value={contactContentData?.subtitle}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Description Field */}
          <div className="contact-content-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter page description"
              value={contactContentData?.description}
              onChange={handleChange}
              autoComplete="off"
              rows="4"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="contact-content-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter phone number (e.g., +8801518-900571)"
              value={contactContentData?.phone}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Email Field */}
          <div className="contact-content-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={contactContentData?.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Bangladesh Office Field */}
          <div className="contact-content-field">
            <label htmlFor="bangladeshOffice">Bangladesh Office</label>
            <input
              id="bangladeshOffice"
              name="bangladeshOffice"
              type="text"
              placeholder="Enter Bangladesh office address"
              value={contactContentData?.bangladeshOffice}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* China Office Field */}
          <div className="contact-content-field">
            <label htmlFor="chinaOffice">China Office</label>
            <input
              id="chinaOffice"
              name="chinaOffice"
              type="text"
              placeholder="Enter China office address"
              value={contactContentData?.chinaOffice}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Social Media Links Section */}
          <div className="contact-content-social-section">
            <div className="contact-content-social-header">
              <span className="contact-content-social-icon">🌐</span>
              <h3>Social Media Links</h3>
              <p>Add your social media profile URLs</p>
            </div>

            <div className="contact-content-social-grid">
              {/* LinkedIn Field */}
              <div className="contact-content-field contact-content-social-field">
                <label htmlFor="linkedin">
                  <span className="social-label-icon">🔗</span> LinkedIn
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/company/your-company"
                  value={contactContentData?.linkedin}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Instagram Field */}
              <div className="contact-content-field contact-content-social-field">
                <label htmlFor="instagram">
                  <span className="social-label-icon">📸</span> Instagram
                </label>
                <input
                  id="instagram"
                  name="instagram"
                  type="url"
                  placeholder="https://instagram.com/your-company"
                  value={contactContentData?.instagram}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Facebook Field */}
              <div className="contact-content-field contact-content-social-field">
                <label htmlFor="facebook">
                  <span className="social-label-icon">👍</span> Facebook
                </label>
                <input
                  id="facebook"
                  name="facebook"
                  type="url"
                  placeholder="https://facebook.com/your-company"
                  value={contactContentData?.facebook}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Twitter/X Field */}
              <div className="contact-content-field contact-content-social-field">
                <label htmlFor="twitter">
                  <span className="social-label-icon">🐦</span> Twitter / X
                </label>
                <input
                  id="twitter"
                  name="twitter"
                  type="url"
                  placeholder="https://twitter.com/your-company"
                  value={contactContentData?.twitter}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="contact-content-form-actions">
            <Link to="/admin/contact/content" type="button" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Update Contact
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ContactContentUpdate;
