import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import "../styles/admin-footerShowcase.css";
import IsLoading from "../components/IsLoading";
import { API_BASE_URL } from "../config";


const emptyForm = {
  visitTitle: "",
  address: "",
  phone: "",
  phoneLabel: "",
  email: "",
  hours: "",
  highlightTitle: "",
  highlightDescription: "",
  buttonText: "",
  buttonLink: "",
};

const AdminFooterShowcase = () => {
  const { authorizationToken } = useAuth();
  const [mode, setMode] = useState("view"); // "view" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(emptyForm);
  const [form, setForm] = useState(emptyForm);

  const fetchFooter = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/footer-showcase`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      const result = await response.json();
      if (response.ok && result.success && result.data) {
        const merged = deepMerge(emptyForm, result.data);
        setData(merged);
        setForm(merged);
      } else {
        toast.error(result.message || "Failed to load footer showcase content");
      }
    } catch (error) {
      console.error("Error fetching footer showcase content:", error);
      toast.error("Failed to load footer showcase content");
    } finally {
      setLoading(false);
    }
  }, [authorizationToken]);

  useEffect(() => {
    fetchFooter();
  }, [fetchFooter]);

  const handleSimple = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setForm((prev) => {
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(form));

      const response = await fetch(`${API_BASE_URL}/api/admin/footer-showcase`, {
        method: "PUT",
        headers: {
          Authorization: authorizationToken,
        },
        body: fd,
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("Footer showcase content updated successfully!");
        const merged = deepMerge(emptyForm, result.data || form);
        setData(merged);
        setForm(merged);
        setMode("view");
      } else {
        toast.error(result.message || "Failed to update footer showcase content");
      }
    } catch (error) {
      console.error("Error updating footer showcase content:", error);
      toast.error("Failed to update footer showcase content");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(data);
    setMode("view");
  };

  if (loading) {
    return (
      <div className="admin-footer-showcase-page">
        <div className="admin-footer-showcase-container">
          <div className="admin-footer-showcase-loading">
            <IsLoading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-footer-showcase-page">
      <div className="admin-footer-showcase-container">
        {/* Header */}
        <div className="admin-footer-showcase-header">
          <div className="admin-footer-showcase-header-top">
            <div className="admin-footer-showcase-badge">
              <span className="admin-footer-showcase-badge-icon">📍</span>
              Footer Showcase Content
            </div>
          </div>
          <h1 className="admin-footer-showcase-title">Manage Footer Showcase</h1>
          <p className="admin-footer-showcase-subtitle">
            {mode === "view"
              ? "Review the footer showcase content below."
              : "Edit the content, then save your changes."}
          </p>

          <div className="admin-footer-showcase-mode-toggle">
            <button
              type="button"
              className={mode === "view" ? "mode-btn active" : "mode-btn"}
              onClick={() => setMode("view")}
            >
              👁️ View
            </button>
            <button
              type="button"
              className={mode === "edit" ? "mode-btn active" : "mode-btn"}
              onClick={() => setMode("edit")}
            >
              ✏️ Edit Content
            </button>
          </div>
        </div>

        {mode === "view" ? (
          <ViewMode data={data} />
        ) : (
          <EditMode
            form={form}
            saving={saving}
            handleSimple={handleSimple}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

/* ============================================================
   VIEW MODE
   ============================================================ */

const ViewMode = ({ data }) => (
  <div className="admin-footer-showcase-view">
    <Section title="Visit & Connect">
      <Field label="Title" value={data.visitTitle} />
      <Field label="Address" value={data.address} multiline />
      <Field label="Phone" value={data.phone} />
      <Field label="Phone Label" value={data.phoneLabel} />
      <Field label="Email" value={data.email} />
      <Field label="Hours" value={data.hours} />
    </Section>

    <Section title="Highlight">
      <Field label="Title" value={data.highlightTitle} />
      <Field label="Description" value={data.highlightDescription} multiline />
      <Field label="Button Text" value={data.buttonText} />
      <Field label="Button Link" value={data.buttonLink} />
    </Section>
  </div>
);

/* ============================================================
   EDIT MODE
   ============================================================ */

const EditMode = ({ form, saving, handleSimple, handleSubmit, handleCancel }) => (
  <form className="admin-footer-showcase-edit" onSubmit={handleSubmit}>
    <EditSection title="Visit & Connect">
      <TextInput label="Title" name="visitTitle" value={form.visitTitle} onChange={handleSimple} />
      <TextArea label="Address" name="address" value={form.address} onChange={handleSimple} />
      <TextInput label="Phone" name="phone" value={form.phone} onChange={handleSimple} />
      <TextInput label="Phone Label" name="phoneLabel" value={form.phoneLabel} onChange={handleSimple} />
      <TextInput label="Email" name="email" value={form.email} onChange={handleSimple} />
      <TextInput label="Hours" name="hours" value={form.hours} onChange={handleSimple} />
    </EditSection>

    <EditSection title="Highlight">
      <TextInput label="Title" name="highlightTitle" value={form.highlightTitle} onChange={handleSimple} />
      <TextArea label="Description" name="highlightDescription" value={form.highlightDescription} onChange={handleSimple} />
      <TextInput label="Button Text" name="buttonText" value={form.buttonText} onChange={handleSimple} />
      <TextInput label="Button Link" name="buttonLink" value={form.buttonLink} onChange={handleSimple} />
    </EditSection>

    <div className="admin-footer-showcase-form-actions">
      <button type="button" className="btn-cancel" onClick={handleCancel}>
        Cancel
      </button>
      <button type="submit" className="btn-submit" disabled={saving}>
        {saving ? (
          <>
            <span className="spinner"></span> Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  </form>
);

/* ============================================================
   Reusable presentational helpers
   ============================================================ */

const Section = ({ title, children }) => (
  <div className="admin-footer-showcase-section">
    <h2 className="admin-footer-showcase-section-title">{title}</h2>
    <div className="admin-footer-showcase-section-body">{children}</div>
  </div>
);

const EditSection = ({ title, children }) => (
  <div className="admin-footer-showcase-section">
    <h2 className="admin-footer-showcase-section-title">{title}</h2>
    <div className="admin-footer-showcase-section-body">{children}</div>
  </div>
);

const Field = ({ label, value, multiline }) => (
  <div className="admin-footer-showcase-field">
    <span className="admin-footer-showcase-field-label">{label}</span>
    <p className="admin-footer-showcase-field-value">
      {value ? (multiline ? value.split("\n").map((l, i) => <span key={i}>{l}{i < value.split("\n").length - 1 && <br />}</span>) : value) : "—"}
    </p>
  </div>
);

const TextInput = ({ label, name, value, onChange }) => (
  <div className="admin-footer-showcase-form-group">
    <label>{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} />
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div className="admin-footer-showcase-form-group">
    <label>{label}</label>
    <textarea rows="3" name={name} value={value} onChange={onChange} />
  </div>
);

/* ============================================================
   Helper: deep merge defaults with API data
   ============================================================ */

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

export default AdminFooterShowcase;
