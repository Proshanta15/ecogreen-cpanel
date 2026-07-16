import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import "../styles/service-create.css";
import { API_BASE_URL, resolveMediaUrl } from "../config";


const getImageUrl = (img) => resolveMediaUrl(img);

const AdminServiceEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { authorizationToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    icon: "",
    description: "",
    image: null,
    gender: [],
    items: {
      men: [{ name: "", image: null }],
      women: [{ name: "", image: null }],
      children: [{ name: "", image: null }],
    },
  });

  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [itemImagePreviews, setItemImagePreviews] = useState({
    men: [null],
    women: [null],
    children: [null],
  });

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(`${API_BASE_URL}/services/${id}`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          const c = result.data;
          const items = c.items || {};
          const genders = c.gender || [];
          const previews = { men: [], women: [], children: [] };
          ["men", "women", "children"].forEach((g) => {
            (items[g] || []).forEach((item) => {
              previews[g].push(
                typeof item.image === "string" && item.image
                  ? getImageUrl(item.image)
                  : null
              );
            });
          });
          setFormData({
            title: c.title || "",
            icon: c.icon || "",
            description: c.description || "",
            image: c.image || null,
            gender: genders,
            isActive: c.isActive !== false,
            items: {
              men: (items.men || []).map((i) => ({
                name: i.name || "",
                image: i.image || null,
              })),
              women: (items.women || []).map((i) => ({
                name: i.name || "",
                image: i.image || null,
              })),
              children: (items.children || []).map((i) => ({
                name: i.name || "",
                image: i.image || null,
              })),
            },
          });
          setCategoryImagePreview(c.image ? getImageUrl(c.image) : "");
          setItemImagePreviews(previews);
        } else {
          toast.error(result.message || "Failed to load category");
        }
      } catch (err) {
        console.error("Error loading category:", err);
        toast.error("Failed to load category");
      } finally {
        setFetchLoading(false);
      }
    };

    loadCategory();
  }, [id, authorizationToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCategoryImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleGenderChange = (gender) => {
    setFormData((prev) => {
      const updatedGender = prev.gender.includes(gender)
        ? prev.gender.filter((g) => g !== gender)
        : [...prev.gender, gender];
      return { ...prev, gender: updatedGender };
    });
  };

  const handleItemChange = (gender, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [gender]: prev.items[gender].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleItemImageChange = (gender, index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImagePreviews((prev) => ({
          ...prev,
          [gender]: prev[gender].map((preview, i) =>
            i === index ? reader.result : preview
          ),
        }));
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        items: {
          ...prev.items,
          [gender]: prev.items[gender].map((item, i) =>
            i === index ? { ...item, image: file } : item
          ),
        },
      }));
    }
  };

  const removeItemImage = (gender, index) => {
    setItemImagePreviews((prev) => ({
      ...prev,
      [gender]: prev[gender].map((preview, i) =>
        i === index ? null : preview
      ),
    }));
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [gender]: prev.items[gender].map((item, i) =>
          i === index ? { ...item, image: null } : item
        ),
      },
    }));
  };

  const addItem = (gender) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [gender]: [...prev.items[gender], { name: "", image: null }],
      },
    }));
    setItemImagePreviews((prev) => ({
      ...prev,
      [gender]: [...prev[gender], null],
    }));
  };

  const removeItem = (gender, index) => {
    if (formData.items[gender].length <= 1) {
      toast.warning("You need at least one item");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [gender]: prev.items[gender].filter((_, i) => i !== index),
      },
    }));
    setItemImagePreviews((prev) => ({
      ...prev,
      [gender]: prev[gender].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.icon || !formData.description) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!/^[a-z0-9-]+$/.test(id)) {
      toast.error("Invalid category id");
      setLoading(false);
      return;
    }

    if (!formData.gender || formData.gender.length === 0) {
      toast.error("Please select at least one gender");
      setLoading(false);
      return;
    }

    const allItems = [
      ...formData.items.men,
      ...formData.items.women,
      ...formData.items.children,
    ];
    if (allItems.some((item) => !item.name)) {
      toast.error("Please fill in all item names");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("icon", formData.icon);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("gender", JSON.stringify(formData.gender));
      formDataToSend.append("isActive", formData.isActive ? "true" : "false");

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const itemsToSend = { men: [], women: [], children: [] };
      ["men", "women", "children"].forEach((gender) => {
        itemsToSend[gender] = formData.items[gender].map((item, index) => {
          if (item.image instanceof File) {
            const fieldName = `item-${gender}-${index}`;
            formDataToSend.append(fieldName, item.image);
            return { name: item.name, image: fieldName };
          }
          return {
            name: item.name,
            image: item.image instanceof File ? null : item.image,
          };
        });
      });

      formDataToSend.append("items", JSON.stringify(itemsToSend));

      const response = await fetch(
        `${API_BASE_URL}/admin/services/${id}`,
        {
          method: "PUT",
          headers: { Authorization: authorizationToken },
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Category updated successfully!");
        navigate("/admin/services");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/admin/services");

  if (fetchLoading) {
    return (
      <div className="admin-category-page">
        <div className="admin-category-container">
          <div className="admin-category-loading">Loading category…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-category-page">
      <div className="admin-category-container">
        <div className="admin-category-header">
          <div className="admin-category-header-top">
            <div className="admin-category-badge">
              <span className="admin-category-badge-icon">📋</span>
              Category Management
            </div>
          </div>
          <h1 className="admin-category-title">Edit Category</h1>
          <p className="admin-category-subtitle">
            Update the category information below
          </p>
        </div>

        <form
          className="admin-category-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="admin-category-section">
            <h2 className="admin-category-section-title">Basic Information</h2>

            <div className="admin-category-form-group">
              <label>Category ID</label>
              <input type="text" value={id} disabled />
              <small className="help-text">Category ID cannot be changed</small>
            </div>

            <div className="admin-category-form-group">
              <label htmlFor="title">
                Title <span className="required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-category-form-group">
              <label htmlFor="icon">
                Icon <span className="required">*</span>
              </label>
              <input
                id="icon"
                name="icon"
                type="text"
                value={formData.icon}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-category-form-group">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-category-form-group">
              <label>Category Image</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImageChange}
                  className="file-input"
                  id="categoryImage"
                />
                <label htmlFor="categoryImage" className="file-upload-label">
                  <span className="upload-icon">📤</span>
                  {categoryImagePreview ? "Change Image" : "Upload Category Image"}
                </label>
              </div>
              {categoryImagePreview && (
                <div className="image-preview">
                  <img src={categoryImagePreview} alt="Category preview" />
                  <button
                    type="button"
                    className="image-preview-remove"
                    onClick={() => {
                      setCategoryImagePreview("");
                      setFormData((prev) => ({ ...prev, image: null }));
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              <small className="help-text">
                Leave unchanged to keep the current image
              </small>
            </div>
          </div>

          <div className="admin-category-section">
            <h2 className="admin-category-section-title">Gender Selection</h2>
            <div className="admin-category-gender-options">
              {["Men", "Women", "Children"].map((gender) => (
                <label key={gender} className="admin-category-gender-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.gender.includes(gender)}
                    onChange={() => handleGenderChange(gender)}
                  />
                  <span className="admin-category-gender-label">
                    {gender === "Men" ? "👨" : gender === "Women" ? "👩" : "👶"}{" "}
                    {gender}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="admin-category-section">
            <h2 className="admin-category-section-title">Items</h2>
            {formData.gender.map((gender) => {
              const genderKey = gender.toLowerCase();
              const items = formData.items[genderKey] || [];
              const previews = itemImagePreviews[genderKey] || [];
              return (
                <div key={gender} className="admin-category-gender-items">
                  <h3 className="admin-category-gender-title">
                    {gender === "Men" ? "👨" : gender === "Women" ? "👩" : "👶"}{" "}
                    {gender}'s Items
                  </h3>
                  <div className="admin-category-items-list">
                    {items.map((item, index) => (
                      <div key={index} className="admin-category-item-row">
                        <div className="admin-category-item-field">
                          <label>Item Name <span className="required">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g., Cotton T-Shirts"
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(genderKey, index, "name", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="admin-category-item-field">
                          <label>Item Image</label>
                          <div className="file-upload-wrapper small">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleItemImageChange(genderKey, index, e)}
                              className="file-input"
                              id={`item-image-${genderKey}-${index}`}
                            />
                            <label
                              htmlFor={`item-image-${genderKey}-${index}`}
                              className="file-upload-label small"
                            >
                              <span className="upload-icon">📤</span>
                              {previews[index] ? "Change" : "Upload"}
                            </label>
                          </div>
                          {previews[index] && (
                            <div className="item-image-preview">
                              <img src={previews[index]} alt={item.name || "Item preview"} />
                              <button
                                type="button"
                                className="item-image-preview-remove"
                                onClick={() => removeItemImage(genderKey, index)}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="admin-category-item-actions">
                          <button
                            type="button"
                            className="admin-category-item-remove"
                            onClick={() => removeItem(genderKey, index)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="admin-category-add-item-btn"
                    onClick={() => addItem(genderKey)}
                  >
                    + Add Item for {gender}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="admin-category-form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminServiceEdit;
