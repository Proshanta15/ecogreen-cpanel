import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import "../styles/admin-service.css";

import { API_BASE } from "../config";

const AdminService = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authorizationToken } = useAuth();

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x300?text=No+Image";
    if (img.startsWith("http")) return img;
    return `${API_BASE}/${img.replace(/\\/g, "/")}`;
  };

  const getAllCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/services`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (category) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/admin/services/${category.id}/toggle`,
        {
          method: "PUT",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success(
          `Category ${result.data?.isActive ? "activated" : "deactivated"} successfully`
        );
        getAllCategories();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error("Failed to update status");
    }
  };

  const deleteCategory = async (category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${category.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/services/${category.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("Category deleted successfully");
        getAllCategories();
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  if (loading) {
    return (
      <div className="admin-service-page">
        <div className="admin-service-container">
          <div className="admin-service-loading">Loading categories…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-service-page">
      <div className="admin-service-container">
        {/* Header */}
        <div className="admin-service-header">
          <div className="admin-service-header-top">
            <div className="admin-service-badge">
              <span className="admin-service-badge-icon">🧺</span>
              Category Management
            </div>
            <Link to="/admin/services/create" className="admin-service-add-btn">
              <span>+</span> Add New Category
            </Link>
          </div>
          <h1 className="admin-service-title">Product Categories</h1>
          <p className="admin-service-subtitle">
            View, edit and manage all your apparel sourcing categories
          </p>
        </div>

        {/* Category List */}
        {error && <div className="admin-service-error">{error}</div>}

        {!error && categories.length > 0 ? (
          <div className="admin-service-list">
            {categories.map((category, index) => {
              const genders = category.gender || [];
              const items = category.items || {};
              const allItems = [
                ...(items.men || []),
                ...(items.women || []),
                ...(items.children || []),
              ];

              return (
                <div className="admin-service-card" key={category._id || category.id}>
                  {/* Card Header */}
                  <div className="admin-service-card-header">
                    <div className="admin-service-card-thumb">
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.title}
                      />
                    </div>
                    <div className="admin-service-card-heading">
                      <div className="admin-service-card-title-row">
                        <span className="admin-service-card-index">
                          #{index + 1}
                        </span>
                        <h2 className="admin-service-card-title">
                          {category.title}
                        </h2>
                        <span
                          className={`admin-service-status ${category.isActive ? "active" : "inactive"
                            }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="admin-service-card-desc">
                        {category.description}
                      </p>
                      <div className="admin-service-card-meta">
                        <span className="admin-service-card-id">
                          id: {category.id}
                        </span>
                        <span className="admin-service-card-icon">
                          {category.icon}
                        </span>
                        <div className="admin-service-gender-badges">
                          {genders.map((g) => (
                            <span
                              key={g}
                              className={`admin-service-gender-badge gender-${g.toLowerCase()}`}
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="admin-service-card-actions">
                      <button
                        className="admin-service-action-toggle"
                        title={category.isActive ? "Deactivate" : "Activate"}
                        onClick={() => toggleStatus(category)}
                      >
                        {category.isActive ? "🟢 Active" : "⚪ Inactive"}
                      </button>
                      <Link
                        to={`/admin/services/edit/${category.id}`}
                        className="admin-service-action-edit"
                        title="Edit"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        className="admin-service-action-delete"
                        title="Delete"
                        onClick={() => deleteCategory(category)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="admin-service-items">
                    {["men", "women", "children"].map((gender) => {
                      const genderItems = items[gender] || [];
                      if (genderItems.length === 0) return null;
                      return (
                        <div
                          className="admin-service-gender-group"
                          key={gender}
                        >
                          <h4 className="admin-service-gender-title">
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </h4>
                          <div className="admin-service-gender-items">
                            {genderItems.map((item, idx) => (
                              <div
                                className="admin-service-item-chip"
                                key={item._id || idx}
                              >
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                />
                                <span>{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {allItems.length === 0 && (
                      <p className="admin-service-no-items">
                        No items added to this category yet.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !error && (
            <div className="admin-service-empty">
              <span className="admin-service-empty-icon">📭</span>
              <p>No categories found</p>
              <Link
                to="/admin/services/create"
                className="admin-service-empty-link"
              >
                Create your first category
              </Link>
            </div>
          )
        )}

        {/* Footer */}
        {categories.length > 0 && (
          <div className="admin-service-footer">
            <p>Showing {categories.length} categor{categories.length > 1 ? "ies" : "y"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminService;
