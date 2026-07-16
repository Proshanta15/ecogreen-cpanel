import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import "../styles/admin-about.css";
import IsLoading from "../components/IsLoading";
import { API_BASE_URL, resolveMediaUrl } from "../config";



const getImageUrl = (img) => resolveMediaUrl(img);

const emptyForm = {
  hero: {
    badge: "",
    title: "",
    titleHighlight: "",
    description: "",
    image: "",
    floatingCards: {
      card1: { icon: "", number: "", label: "" },
      card2: { icon: "", number: "", label: "" },
    },
  },
  stats: [],
  aboutContent: {
    badge: "",
    title: "",
    titleHighlight: "",
    description: "",
    description2: "",
    image: "",
  },
  visionMission: {
    vision: { icon: "", title: "", description: "", image: "" },
    mission: { icon: "", title: "", description: "", image: "" },
  },
  values: [],
  cta: { title: "", description: "", buttonText: "", image: "" },
};

// Field names used for single (non-array) image uploads
const SINGLE_IMAGE_FIELDS = [
  "heroImage",
  "aboutImage",
  "visionImage",
  "missionImage",
  "ctaImage",
];

const AdminAbout = () => {
  const { authorizationToken } = useAuth();
  const [mode, setMode] = useState("view"); // "view" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(emptyForm);
  const [form, setForm] = useState(emptyForm);

  // Image upload state (single fields)
  const [singleFiles, setSingleFiles] = useState({});
  const [singlePreviews, setSinglePreviews] = useState({});

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/about`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      const result = await response.json();
      if (response.ok && result.success && result.data) {
        const merged = deepMerge(emptyForm, result.data);
        setData(merged);
        setForm(merged);
      } else {
        toast.error(result.message || "Failed to load about content");
      }
    } catch (error) {
      console.error("Error fetching about content:", error);
      toast.error("Failed to load about content");
    } finally {
      setLoading(false);
    }
  }, [authorizationToken]);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  /* ---------------- generic field updaters ---------------- */

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

  /* ---------------- single image upload ---------------- */

  const handleSingleImage = (fieldName, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSingleFiles((prev) => ({ ...prev, [fieldName]: file }));
      setSinglePreviews((prev) => ({ ...prev, [fieldName]: url }));
    }
  };

  /* ---------------- value image upload ---------------- */

  const handleValueImage = (index, e) => {
    const file = e.target.files[0];
    setForm((prev) => {
      const values = [...prev.values];
      const v = { ...values[index] };
      if (file) {
        v._file = file;
        v._preview = URL.createObjectURL(file);
      }
      values[index] = v;
      return { ...prev, values };
    });
  };

  /* ---------------- array helpers (stats) ---------------- */

  const updateStat = (index, field, value) => {
    setForm((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  const addStat = () => {
    setForm((prev) => ({
      ...prev,
      stats: [...prev.stats, { number: "", label: "" }],
    }));
  };

  const removeStat = (index) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- array helpers (values) ---------------- */

  const updateValue = (index, field, value) => {
    setForm((prev) => {
      const values = [...prev.values];
      values[index] = { ...values[index], [field]: value };
      return { ...prev, values };
    });
  };

  const addValue = () => {
    setForm((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        { icon: "", title: "", description: "", image: "" },
      ],
    }));
  };

  const removeValue = (index) => {
    setForm((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- save ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = structuredClone(form);
      const fd = new FormData();

      // Collect value image files and strip transient fields from payload
      if (Array.isArray(payload.values)) {
        payload.values = payload.values.map((v, i) => {
          const { _file, _preview, ...rest } = v;
          if (_file) {
            fd.append(`valueImage_${i}`, _file);
          }
          return rest;
        });
      }

      fd.append("data", JSON.stringify(payload));

      // Attach single image files
      Object.entries(singleFiles).forEach(([fieldName, file]) => {
        fd.append(fieldName, file);
      });

      const response = await fetch(`${API_BASE_URL}/admin/about`, {
        method: "PUT",
        headers: {
          Authorization: authorizationToken,
        },
        body: fd,
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("About page content updated successfully!");
        const merged = deepMerge(emptyForm, result.data || form);
        setData(merged);
        setForm(merged);
        setSingleFiles({});
        setSinglePreviews({});
        setMode("view");
      } else {
        toast.error(result.message || "Failed to update about content");
      }
    } catch (error) {
      console.error("Error updating about content:", error);
      toast.error("Failed to update about content");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(data);
    setSingleFiles({});
    setSinglePreviews({});
    setMode("view");
  };

  if (loading) {
    return (
      <div className="admin-about-page">
        <div className="admin-about-container">
          <div className="admin-about-loading">
            <IsLoading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-about-page">
      <div className="admin-about-container">
        {/* Header */}
        <div className="admin-about-header">
          <div className="admin-about-header-top">
            <div className="admin-about-badge">
              <span className="admin-about-badge-icon">📄</span>
              About Page Content
            </div>
          </div>
          <h1 className="admin-about-title">Manage About Page</h1>
          <p className="admin-about-subtitle">
            {mode === "view"
              ? "Review all about page content below."
              : "Edit any section, then save your changes."}
          </p>

          <div className="admin-about-mode-toggle">
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
            singlePreviews={singlePreviews}
            handleSimple={handleSimple}
            handleSingleImage={handleSingleImage}
            handleValueImage={handleValueImage}
            updateStat={updateStat}
            addStat={addStat}
            removeStat={removeStat}
            updateValue={updateValue}
            addValue={addValue}
            removeValue={removeValue}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

/* ============================================================
   VIEW MODE — shows all content
   ============================================================ */

const ViewMode = ({ data }) => (
  <div className="admin-about-view">
    {/* Hero */}
    <Section title="Hero Section">
      <Field label="Badge" value={data.hero.badge} />
      <Field label="Title" value={data.hero.title} />
      <Field label="Title Highlight" value={data.hero.titleHighlight} />
      <Field label="Description" value={data.hero.description} />
      <ImagePreview src={data.hero.image} alt="Hero" />
      <div className="admin-about-subgrid">
        <div>
          <Field label="Card 1 Icon" value={data.hero.floatingCards.card1.icon} />
          <Field label="Card 1 Number" value={data.hero.floatingCards.card1.number} />
          <Field label="Card 1 Label" value={data.hero.floatingCards.card1.label} />
        </div>
        <div>
          <Field label="Card 2 Icon" value={data.hero.floatingCards.card2.icon} />
          <Field label="Card 2 Number" value={data.hero.floatingCards.card2.number} />
          <Field label="Card 2 Label" value={data.hero.floatingCards.card2.label} />
        </div>
      </div>
    </Section>

    {/* Stats */}
    <Section title="Stats Section">
      <div className="admin-about-chip-grid">
        {data.stats.map((s, i) => (
          <div className="admin-about-chip" key={i}>
            <strong>{s.number}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </Section>

    {/* About Content */}
    <Section title="About Content Section">
      <Field label="Badge" value={data.aboutContent.badge} />
      <Field label="Title" value={data.aboutContent.title} />
      <Field label="Title Highlight" value={data.aboutContent.titleHighlight} />
      <Field label="Description" value={data.aboutContent.description} />
      <Field label="Description 2" value={data.aboutContent.description2} />
      <ImagePreview src={data.aboutContent.image} alt="About Content" />
    </Section>

    {/* Vision & Mission */}
    <Section title="Vision & Mission Section">
      <div className="admin-about-subgrid">
        <div>
          <h4 className="admin-about-subtitle-sm">Vision</h4>
          <Field label="Icon" value={data.visionMission.vision.icon} />
          <Field label="Title" value={data.visionMission.vision.title} />
          <Field label="Description" value={data.visionMission.vision.description} />
          <ImagePreview src={data.visionMission.vision.image} alt="Vision" />
        </div>
        <div>
          <h4 className="admin-about-subtitle-sm">Mission</h4>
          <Field label="Icon" value={data.visionMission.mission.icon} />
          <Field label="Title" value={data.visionMission.mission.title} />
          <Field label="Description" value={data.visionMission.mission.description} />
          <ImagePreview src={data.visionMission.mission.image} alt="Mission" />
        </div>
      </div>
    </Section>

    {/* Values */}
    <Section title="Values Section">
      <div className="admin-about-value-grid">
        {data.values.map((v, i) => (
          <div className="admin-about-value-card" key={i}>
            <div className="admin-about-value-media">
              <ImagePreview src={v.image} alt={v.title} />
              <span className="admin-about-value-icon">{v.icon}</span>
            </div>
            <h4>{v.title}</h4>
            <p>{v.description}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* CTA */}
    <Section title="CTA Section">
      <Field label="Title" value={data.cta.title} />
      <Field label="Description" value={data.cta.description} />
      <Field label="Button Text" value={data.cta.buttonText} />
      <ImagePreview src={data.cta.image} alt="CTA" />
    </Section>
  </div>
);

/* ============================================================
   EDIT MODE — editable form for all content
   ============================================================ */

const EditMode = ({
  form,
  saving,
  singlePreviews,
  handleSimple,
  handleSingleImage,
  handleValueImage,
  updateStat,
  addStat,
  removeStat,
  updateValue,
  addValue,
  removeValue,
  handleSubmit,
  handleCancel,
}) => (
  <form className="admin-about-edit" onSubmit={handleSubmit} encType="multipart/form-data">
    {/* Hero */}
    <EditSection title="Hero Section">
      <TextInput label="Badge" name="hero.badge" value={form.hero.badge} onChange={handleSimple} />
      <TextInput label="Title" name="hero.title" value={form.hero.title} onChange={handleSimple} />
      <TextInput label="Title Highlight" name="hero.titleHighlight" value={form.hero.titleHighlight} onChange={handleSimple} />
      <TextArea label="Description" name="hero.description" value={form.hero.description} onChange={handleSimple} />
      <ImageEditField
        label="Hero Image"
        fieldName="heroImage"
        currentPath={form.hero.image}
        preview={singlePreviews.heroImage}
        onSelect={(e) => handleSingleImage("heroImage", e)}
      />
      <div className="admin-about-subgrid">
        <div>
          <h4 className="admin-about-subtitle-sm">Floating Card 1</h4>
          <TextInput label="Icon" name="hero.floatingCards.card1.icon" value={form.hero.floatingCards.card1.icon} onChange={handleSimple} />
          <TextInput label="Number" name="hero.floatingCards.card1.number" value={form.hero.floatingCards.card1.number} onChange={handleSimple} />
          <TextInput label="Label" name="hero.floatingCards.card1.label" value={form.hero.floatingCards.card1.label} onChange={handleSimple} />
        </div>
        <div>
          <h4 className="admin-about-subtitle-sm">Floating Card 2</h4>
          <TextInput label="Icon" name="hero.floatingCards.card2.icon" value={form.hero.floatingCards.card2.icon} onChange={handleSimple} />
          <TextInput label="Number" name="hero.floatingCards.card2.number" value={form.hero.floatingCards.card2.number} onChange={handleSimple} />
          <TextInput label="Label" name="hero.floatingCards.card2.label" value={form.hero.floatingCards.card2.label} onChange={handleSimple} />
        </div>
      </div>
    </EditSection>

    {/* Stats */}
    <EditSection
      title="Stats Section"
      action={
        <button type="button" className="admin-about-add-btn" onClick={addStat}>
          + Add Stat
        </button>
      }
    >
      {form.stats.map((s, i) => (
        <div className="admin-about-repeat-row" key={i}>
          <TextInput label="Number" value={s.number} onChange={(e) => updateStat(i, "number", e.target.value)} />
          <TextInput label="Label" value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
          <button type="button" className="admin-about-remove-btn" onClick={() => removeStat(i)}>
            ✕
          </button>
        </div>
      ))}
    </EditSection>

    {/* About Content */}
    <EditSection title="About Content Section">
      <TextInput label="Badge" name="aboutContent.badge" value={form.aboutContent.badge} onChange={handleSimple} />
      <TextInput label="Title" name="aboutContent.title" value={form.aboutContent.title} onChange={handleSimple} />
      <TextInput label="Title Highlight" name="aboutContent.titleHighlight" value={form.aboutContent.titleHighlight} onChange={handleSimple} />
      <TextArea label="Description" name="aboutContent.description" value={form.aboutContent.description} onChange={handleSimple} />
      <TextArea label="Description 2" name="aboutContent.description2" value={form.aboutContent.description2} onChange={handleSimple} />
      <ImageEditField
        label="About Image"
        fieldName="aboutImage"
        currentPath={form.aboutContent.image}
        preview={singlePreviews.aboutImage}
        onSelect={(e) => handleSingleImage("aboutImage", e)}
      />
    </EditSection>

    {/* Vision & Mission */}
    <EditSection title="Vision & Mission Section">
      <div className="admin-about-subgrid">
        <div>
          <h4 className="admin-about-subtitle-sm">Vision</h4>
          <TextInput label="Icon" name="visionMission.vision.icon" value={form.visionMission.vision.icon} onChange={handleSimple} />
          <TextInput label="Title" name="visionMission.vision.title" value={form.visionMission.vision.title} onChange={handleSimple} />
          <TextArea label="Description" name="visionMission.vision.description" value={form.visionMission.vision.description} onChange={handleSimple} />
          <ImageEditField
            label="Vision Image"
            fieldName="visionImage"
            currentPath={form.visionMission.vision.image}
            preview={singlePreviews.visionImage}
            onSelect={(e) => handleSingleImage("visionImage", e)}
          />
        </div>
        <div>
          <h4 className="admin-about-subtitle-sm">Mission</h4>
          <TextInput label="Icon" name="visionMission.mission.icon" value={form.visionMission.mission.icon} onChange={handleSimple} />
          <TextInput label="Title" name="visionMission.mission.title" value={form.visionMission.mission.title} onChange={handleSimple} />
          <TextArea label="Description" name="visionMission.mission.description" value={form.visionMission.mission.description} onChange={handleSimple} />
          <ImageEditField
            label="Mission Image"
            fieldName="missionImage"
            currentPath={form.visionMission.mission.image}
            preview={singlePreviews.missionImage}
            onSelect={(e) => handleSingleImage("missionImage", e)}
          />
        </div>
      </div>
    </EditSection>

    {/* Values */}
    <EditSection
      title="Values Section"
      action={
        <button type="button" className="admin-about-add-btn" onClick={addValue}>
          + Add Value
        </button>
      }
    >
      {form.values.map((v, i) => (
        <div className="admin-about-value-edit" key={i}>
          <div className="admin-about-value-edit-head">
            <span>Value {i + 1}</span>
            <button type="button" className="admin-about-remove-btn" onClick={() => removeValue(i)}>
              ✕
            </button>
          </div>
          <TextInput label="Icon" value={v.icon} onChange={(e) => updateValue(i, "icon", e.target.value)} />
          <TextInput label="Title" value={v.title} onChange={(e) => updateValue(i, "title", e.target.value)} />
          <TextArea label="Description" value={v.description} onChange={(e) => updateValue(i, "description", e.target.value)} />
          <ImageEditField
            label="Value Image"
            fieldName={`valueImage_${i}`}
            currentPath={v._preview ? "" : v.image}
            preview={v._preview}
            onSelect={(e) => handleValueImage(i, e)}
          />
        </div>
      ))}
    </EditSection>

    {/* CTA */}
    <EditSection title="CTA Section">
      <TextInput label="Title" name="cta.title" value={form.cta.title} onChange={handleSimple} />
      <TextArea label="Description" name="cta.description" value={form.cta.description} onChange={handleSimple} />
      <TextInput label="Button Text" name="cta.buttonText" value={form.cta.buttonText} onChange={handleSimple} />
      <ImageEditField
        label="CTA Image"
        fieldName="ctaImage"
        currentPath={form.cta.image}
        preview={singlePreviews.ctaImage}
        onSelect={(e) => handleSingleImage("ctaImage", e)}
      />
    </EditSection>

    <div className="admin-about-form-actions">
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
  <div className="admin-about-section">
    <h2 className="admin-about-section-title">{title}</h2>
    <div className="admin-about-section-body">{children}</div>
  </div>
);

const EditSection = ({ title, action, children }) => (
  <div className="admin-about-section">
    <div className="admin-about-section-head">
      <h2 className="admin-about-section-title">{title}</h2>
      {action}
    </div>
    <div className="admin-about-section-body">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="admin-about-field">
    <span className="admin-about-field-label">{label}</span>
    <p className="admin-about-field-value">{value || "—"}</p>
  </div>
);

const ImagePreview = ({ src, alt }) => {
  const resolved = getImageUrl(src);
  return resolved ? (
    <div className="admin-about-img-preview">
      <img src={resolved} alt={alt} />
    </div>
  ) : null;
};

const TextInput = ({ label, name, value, onChange }) => (
  <div className="admin-about-form-group">
    <label>{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} />
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div className="admin-about-form-group">
    <label>{label}</label>
    <textarea rows="3" name={name} value={value} onChange={onChange} />
  </div>
);

const ImageEditField = ({ label, fieldName, currentPath, preview, onSelect }) => (
  <div className="admin-about-form-group">
    <label>{label}</label>
    <div className="file-upload-wrapper">
      <input
        type="file"
        accept="image/*"
        onChange={onSelect}
        className="file-input"
        id={fieldName}
      />
      <label htmlFor={fieldName} className="file-upload-label">
        <span className="upload-icon">📤</span>
        {preview || currentPath ? "Change Image" : "Upload Image"}
      </label>
    </div>
    {(preview || currentPath) && (
      <div className="admin-about-img-preview">
        <img src={preview || getImageUrl(currentPath)} alt={label} />
      </div>
    )}
    <small className="help-text">Leave unchanged to keep the current image</small>
  </div>
);

/* ============================================================
   Helper: deep merge defaults with API data so missing keys
   are never undefined.
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

export default AdminAbout;
