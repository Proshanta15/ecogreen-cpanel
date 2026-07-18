import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import IsLoading from "../components/IsLoading";
import { useAuth } from "../store/auth";
import "../styles/admin-faq.css";

const API_BASE = "https://api.ecogreentex.eu.com";

const AdminFAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { authorizationToken } = useAuth();

  const getAllFaqData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/admin/faq`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Access the data array from the response
      if (result.success && result.data) {
        setFaqData(result.data);
      } else {
        setFaqData([]);
      }
      console.log("FAQ Data:", result.data);
    } catch (error) {
      toast.error("Failed to fetch FAQs");
      setFaqData([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const deleteFaq = async (id) => {

    try {
      const response = await fetch(`${API_BASE}/api/admin/faq/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        toast.success("FAQ deleted successfully");
        getAllFaqData(); // Refresh the list
      } else {
        toast.error(result.message || "Failed to delete FAQ");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete FAQ");
    }
  };

  useEffect(() => {
    getAllFaqData();
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
    <div className="admin-faq-page">
      <div className="admin-faq-container">
        {/* Header */}
        <div className="admin-faq-header">
          <div className="admin-faq-header-top">
            <div className="admin-faq-badge">
              <span className="admin-faq-badge-icon">❓</span>
              FAQ Management
            </div>
            <Link to="/admin/faq/create" className="admin-faq-add-btn">
              <span>+</span> Add New FAQ
            </Link>
          </div>
          <h1 className="admin-faq-title">Frequently Asked Questions</h1>
          <p className="admin-faq-subtitle">
            Manage your frequently asked questions and answers
          </p>
        </div>

        {/* FAQ List */}
        <div className="admin-faq-list">
          {faqData && faqData.length > 0 ? (
            faqData.map((faq, index) => (
              <div
                className={`admin-faq-item ${expandedId === faq._id ? "expanded" : ""}`}
                key={faq._id || index}
              >
                <div
                  className="admin-faq-item-header"
                  onClick={() => toggleExpand(faq._id)}
                >
                  <div className="admin-faq-item-question-wrapper">
                    <span className="admin-faq-item-number">
                      #{index + 1}
                    </span>
                    <h3 className="admin-faq-item-question">{faq.question}</h3>
                  </div>
                  <div className="admin-faq-item-actions">
                    <Link
                      to={`/admin/faq/edit/${faq._id}`}
                      className="admin-faq-item-edit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ✏️
                    </Link>
                    <button
                      className="admin-faq-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFaq(faq._id);
                      }}
                    >
                      🗑️
                    </button>
                    <span className="admin-faq-item-toggle">
                      {expandedId === faq._id ? "−" : "+"}
                    </span>
                  </div>
                </div>
                <div className="admin-faq-item-body">
                  <p className="admin-faq-item-answer">{faq.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-faq-empty">
              <span className="admin-faq-empty-icon">📭</span>
              <p>No FAQs added yet</p>
              <span className="admin-faq-empty-sub">
                Click the "Add New FAQ" button to create your first FAQ
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        {faqData && faqData.length > 0 && (
          <div className="admin-faq-footer">
            <p className="admin-faq-footer-text">
              Showing {faqData.length} FAQ{faqData.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFAQ;