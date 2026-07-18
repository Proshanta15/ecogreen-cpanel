import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import IsLoading from "../components/IsLoading";
import { useAuth } from "../store/auth";
import "../styles/admin-home.css";

const API_BASE = "https://api.ecogreentex.eu.com";

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${API_BASE}/${img.replace(/\\/g, "/")}`;
};

const emptyForm = {
  banner: {
    title: "",
    titleHighlight: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    video: "",
    image: "",
    showVideo: true,
    showImage: false,
  },
  whoWeAre: {
    badge: "",
    title: "",
    titleHighlight: "",
    description: "",
    description2: "",
    buttonText: "",
    buttonLink: "",
    cards: [],
    stats: [],
  },
  expertise: {
    badge: "",
    title: "",
    titleHighlight: "",
    subtitle: "",
    cards: [],
  },
  partner: {
    badge: "",
    title: "",
    titleHighlight: "",
    subtitle: "",
    descriptionTitle: "",
    descriptionText: "",
    descriptionText2: "",
    descriptionStats: [],
    features: [],
    ctaText: "",
    ctaButtonText: "",
    ctaLink: "",
  },
  showcase: {
    badge: "",
    title: "",
    titleHighlight: "",
    subtitle: "",
    products: [],
  },
  brands: {
    badge: "",
    title: "",
    titleHighlight: "",
    subtitle: "",
    brands: [],
    trustIndicators: [],
  },
};

// Single (non-array) image uploads
const SINGLE_IMAGE_FIELDS = ["bannerImage"];

const AdminHome = () => {
  const { authorizationToken } = useAuth();
  const [mode, setMode] = useState("view"); // "view" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(emptyForm);
  const [form, setForm] = useState(emptyForm);

  const [singleFiles, setSingleFiles] = useState({});
  const [singlePreviews, setSinglePreviews] = useState({});

  const fetchHome = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/home`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      const result = await response.json();
      if (response.ok && result.success && result.data) {
        const merged = deepMerge(emptyForm, result.data);
        setData(merged);
        setForm(merged);
      } else {
        toast.error(result.message || "Failed to load home content");
      }
    } catch (error) {
      console.error("Error fetching home content:", error);
      toast.error("Failed to load home content");
    } finally {
      setLoading(false);
    }
  }, [authorizationToken]);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

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

  /* ---------------- boolean flag updater ---------------- */

  const handleFlag = (name, value) => {
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

  /* ---------------- array image upload ---------------- */

  const handleArrayImage = (arrayName, index, e) => {
    const file = e.target.files[0];
    setForm((prev) => {
      const arr = [...prev[arrayName]];
      const item = { ...arr[index] };
      if (file) {
        item._file = file;
        item._preview = URL.createObjectURL(file);
      }
      arr[index] = item;
      return { ...prev, [arrayName]: arr };
    });
  };

  /* ---------------- array helpers ---------------- */

  const updateArrayItem = (arrayName, index, field, value) => {
    setForm((prev) => {
      const arr = [...prev[arrayName]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayName]: arr };
    });
  };

  const addArrayItem = (arrayName, template) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...template }],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  // Nested array helpers (e.g. whoWeAre.cards, expertise.cards)
  const updateNestedArrayItem = (section, arrayName, index, field, value) => {
    setForm((prev) => {
      const arr = [...prev[section][arrayName]];
      arr[index] = { ...arr[index], [field]: value };
      return {
        ...prev,
        [section]: { ...prev[section], [arrayName]: arr },
      };
    });
  };

  const addNestedArrayItem = (section, arrayName, template) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayName]: [...prev[section][arrayName], { ...template }],
      },
    }));
  };

  const removeNestedArrayItem = (section, arrayName, index) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayName]: prev[section][arrayName].filter((_, i) => i !== index),
      },
    }));
  };

  const handleNestedArrayImage = (section, arrayName, index, e) => {
    const file = e.target.files[0];
    setForm((prev) => {
      const arr = [...prev[section][arrayName]];
      const item = { ...arr[index] };
      if (file) {
        item._file = file;
        item._preview = URL.createObjectURL(file);
      }
      arr[index] = item;
      return {
        ...prev,
        [section]: { ...prev[section], [arrayName]: arr },
      };
    });
  };

  /* ---------------- save ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = structuredClone(form);
      const fd = new FormData();

      // Expertise card images
      if (Array.isArray(payload.expertise?.cards)) {
        payload.expertise.cards = payload.expertise.cards.map((card, i) => {
          const { _file, _preview, ...rest } = card;
          if (_file) fd.append(`expertiseImage_${i}`, _file);
          return rest;
        });
      }
      // Showcase product images
      if (Array.isArray(payload.showcase?.products)) {
        payload.showcase.products = payload.showcase.products.map((product, i) => {
          const { _file, _preview, ...rest } = product;
          if (_file) fd.append(`showcaseImage_${i}`, _file);
          return rest;
        });
      }
      // Brand logos
      if (Array.isArray(payload.brands?.brands)) {
        payload.brands.brands = payload.brands.brands.map((brand, i) => {
          const { _file, _preview, ...rest } = brand;
          if (_file) fd.append(`brandLogo_${i}`, _file);
          return rest;
        });
      }

      fd.append("data", JSON.stringify(payload));

      Object.entries(singleFiles).forEach(([fieldName, file]) => {
        fd.append(fieldName, file);
      });

      const response = await fetch(`${API_BASE}/api/admin/home`, {
        method: "PUT",
        headers: {
          Authorization: authorizationToken,
        },
        body: fd,
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("Home page content updated successfully!");
        const merged = deepMerge(emptyForm, result.data || form);
        setData(merged);
        setForm(merged);
        setSingleFiles({});
        setSinglePreviews({});
        setMode("view");
      } else {
        toast.error(result.message || "Failed to update home content");
      }
    } catch (error) {
      console.error("Error updating home content:", error);
      toast.error("Failed to update home content");
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
      <div className="admin-home-page">
        <div className="admin-home-container">
          <div className="admin-home-loading">
            <IsLoading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-home-page">
      <div className="admin-home-container">
        {/* Header */}
        <div className="admin-home-header">
          <div className="admin-home-header-top">
            <div className="admin-home-badge">
              <span className="admin-home-badge-icon">🏠</span>
              Home Page Content
            </div>
          </div>
          <h1 className="admin-home-title">Manage Home Page</h1>
          <p className="admin-home-subtitle">
            {mode === "view"
              ? "Review all home page content below."
              : "Edit any section, then save your changes."}
          </p>

          <div className="admin-home-mode-toggle">
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
            handleFlag={handleFlag}
            handleSingleImage={handleSingleImage}
            handleArrayImage={handleArrayImage}
            updateArrayItem={updateArrayItem}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            updateNestedArrayItem={updateNestedArrayItem}
            addNestedArrayItem={addNestedArrayItem}
            removeNestedArrayItem={removeNestedArrayItem}
            handleNestedArrayImage={handleNestedArrayImage}
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
  <div className="admin-home-view">
    {/* Banner */}
    <Section title="Banner Section">
      <Field label="Title" value={data.banner.title} />
      <Field label="Title Highlight" value={data.banner.titleHighlight} />
      <Field label="Description" value={data.banner.description} />
      <Field label="Button Text" value={data.banner.buttonText} />
      <Field label="Button Link" value={data.banner.buttonLink} />
      <Field label="Video" value={data.banner.video} />
      <Field label="Show Video" value={data.banner.showVideo ? "Active" : "Inactive"} />
      <Field label="Show Image" value={data.banner.showImage ? "Active" : "Inactive"} />
      <ImagePreview src={data.banner.image} alt="Banner" />
    </Section>

    {/* Who We Are */}
    <Section title="Who We Are Section">
      <Field label="Badge" value={data.whoWeAre.badge} />
      <Field label="Title" value={data.whoWeAre.title} />
      <Field label="Title Highlight" value={data.whoWeAre.titleHighlight} />
      <Field label="Description" value={data.whoWeAre.description} />
      <Field label="Description 2" value={data.whoWeAre.description2} />
      <Field label="Button Text" value={data.whoWeAre.buttonText} />
      <Field label="Button Link" value={data.whoWeAre.buttonLink} />
      <ArrayChips label="Cards" items={data.whoWeAre.cards.map((c) => `${c.icon} · ${c.title}`)} />
      <ArrayChips label="Stats" items={data.whoWeAre.stats.map((s) => `${s.number} ${s.label}`)} />
    </Section>

    {/* Expertise */}
    <Section title="Expertise Section">
      <Field label="Badge" value={data.expertise.badge} />
      <Field label="Title" value={data.expertise.title} />
      <Field label="Title Highlight" value={data.expertise.titleHighlight} />
      <Field label="Subtitle" value={data.expertise.subtitle} />
      <div className="admin-home-value-grid">
        {data.expertise.cards.map((c, i) => (
          <div className="admin-home-value-card" key={i}>
            <div className="admin-home-value-media">
              <ImagePreview src={c.image} alt={c.title} />
              <span className="admin-home-value-icon">{c.icon}</span>
            </div>
            <h4>{c.title}</h4>
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Partner */}
    <Section title="Why Choose Us Section">
      <Field label="Badge" value={data.partner.badge} />
      <Field label="Title" value={data.partner.title} />
      <Field label="Title Highlight" value={data.partner.titleHighlight} />
      <Field label="Subtitle" value={data.partner.subtitle} />
      <Field label="Description Title" value={data.partner.descriptionTitle} />
      <Field label="Description Text" value={data.partner.descriptionText} />
      <Field label="Description Text 2" value={data.partner.descriptionText2} />
      <ArrayChips label="Description Stats" items={data.partner.descriptionStats.map((s) => `${s.number} ${s.label}`)} />
      <Field label="CTA Text" value={data.partner.ctaText} />
      <Field label="CTA Button Text" value={data.partner.ctaButtonText} />
      <Field label="CTA Link" value={data.partner.ctaLink} />
      <ArrayChips label="Features" items={data.partner.features.map((f) => `${f.icon} · ${f.title}`)} />
    </Section>

    {/* Showcase */}
    <Section title="Product Showcase Section">
      <Field label="Badge" value={data.showcase.badge} />
      <Field label="Title" value={data.showcase.title} />
      <Field label="Title Highlight" value={data.showcase.titleHighlight} />
      <Field label="Subtitle" value={data.showcase.subtitle} />
      <div className="admin-home-chip-grid">
        {data.showcase.products.map((p, i) => (
          <div className="admin-home-chip" key={i}>
            <ImagePreview src={p.image} alt={`Product ${i + 1}`} />
          </div>
        ))}
      </div>
    </Section>

    {/* Brands */}
    <Section title="Brands Section">
      <Field label="Badge" value={data.brands.badge} />
      <Field label="Title" value={data.brands.title} />
      <Field label="Title Highlight" value={data.brands.titleHighlight} />
      <Field label="Subtitle" value={data.brands.subtitle} />
      <div className="admin-home-chip-grid">
        {data.brands.brands.map((b, i) => (
          <div className="admin-home-chip" key={i}>
            <ImagePreview src={b.logo} alt={b.name} />
            <span>{b.name}</span>
          </div>
        ))}
      </div>
      <ArrayChips label="Trust Indicators" items={data.brands.trustIndicators.map((t) => `${t.icon} · ${t.title} ${t.subtitle}`)} />
    </Section>
  </div>
);

/* ============================================================
   EDIT MODE
   ============================================================ */

const EditMode = ({
  form,
  saving,
  singlePreviews,
  handleSimple,
  handleFlag,
  handleSingleImage,
  handleArrayImage,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  updateNestedArrayItem,
  addNestedArrayItem,
  removeNestedArrayItem,
  handleNestedArrayImage,
  handleSubmit,
  handleCancel,
}) => (
  <form className="admin-home-edit" onSubmit={handleSubmit} encType="multipart/form-data">
    {/* Banner */}
    <EditSection title="Banner Section">
      <TextInput label="Title" name="banner.title" value={form.banner.title} onChange={handleSimple} />
      <TextInput label="Title Highlight" name="banner.titleHighlight" value={form.banner.titleHighlight} onChange={handleSimple} />
      <TextArea label="Description" name="banner.description" value={form.banner.description} onChange={handleSimple} />
      <TextInput label="Button Text" name="banner.buttonText" value={form.banner.buttonText} onChange={handleSimple} />
      <TextInput label="Button Link" name="banner.buttonLink" value={form.banner.buttonLink} onChange={handleSimple} />
      <VideoEditField
        label="Banner Video"
        fieldName="bannerVideo"
        currentPath={form.banner.video}
        preview={singlePreviews.bannerVideo}
        onSelect={(e) => handleSingleImage("bannerVideo", e)}
      />
      <ImageEditField
        label="Banner Image (used as poster / fallback)"
        fieldName="bannerImage"
        currentPath={form.banner.image}
        preview={singlePreviews.bannerImage}
        onSelect={(e) => handleSingleImage("bannerImage", e)}
      />
      <ToggleField label="Show Video" name="banner.showVideo" value={form.banner.showVideo} onChange={handleFlag} />
      <ToggleField label="Show Image" name="banner.showImage" value={form.banner.showImage} onChange={handleFlag} />
    </EditSection>

    {/* Who We Are */}
    <EditSection title="Who We Are Section">
      <TextInput label="Badge" name="whoWeAre.badge" value={form.whoWeAre.badge} onChange={handleSimple} />
      <TextInput label="Title" name="whoWeAre.title" value={form.whoWeAre.title} onChange={handleSimple} />
      <TextInput label="Title Highlight" name="whoWeAre.titleHighlight" value={form.whoWeAre.titleHighlight} onChange={handleSimple} />
      <TextArea label="Description" name="whoWeAre.description" value={form.whoWeAre.description} onChange={handleSimple} />
      <TextArea label="Description 2" name="whoWeAre.description2" value={form.whoWeAre.description2} onChange={handleSimple} />
      <TextInput label="Button Text" name="whoWeAre.buttonText" value={form.whoWeAre.buttonText} onChange={handleSimple} />
      <TextInput label="Button Link" name="whoWeAre.buttonLink" value={form.whoWeAre.buttonLink} onChange={handleSimple} />
      <RepeatArray
        title="Cards"
        addLabel="+ Add Card"
        items={form.whoWeAre.cards}
        onAdd={() => addNestedArrayItem("whoWeAre", "cards", { icon: "", title: "", subtitle: "" })}
        onRemove={(i) => removeNestedArrayItem("whoWeAre", "cards", i)}
        renderItem={(card, i) => (
          <>
            <TextInput label="Icon" value={card.icon} onChange={(e) => updateNestedArrayItem("whoWeAre", "cards", i, "icon", e.target.value)} />
            <TextInput label="Title" value={card.title} onChange={(e) => updateNestedArrayItem("whoWeAre", "cards", i, "title", e.target.value)} />
            <TextInput label="Subtitle" value={card.subtitle} onChange={(e) => updateNestedArrayItem("whoWeAre", "cards", i, "subtitle", e.target.value)} />
          </>
        )}
      />
      <RepeatArray
        title="Stats"
        addLabel="+ Add Stat"
        items={form.whoWeAre.stats}
        onAdd={() => addNestedArrayItem("whoWeAre", "stats", { number: "", label: "" })}
        onRemove={(i) => removeNestedArrayItem("whoWeAre", "stats", i)}
        renderItem={(stat, i) => (
          <>
            <TextInput label="Number" value={stat.number} onChange={(e) => updateNestedArrayItem("whoWeAre", "stats", i, "number", e.target.value)} />
            <TextInput label="Label" value={stat.label} onChange={(e) => updateNestedArrayItem("whoWeAre", "stats", i, "label", e.target.value)} />
          </>
        )}
      />
    </EditSection>

    {/* Expertise */}
    <EditSection title="Expertise Section">
      <TextInput label="Badge" name="expertise.badge" value={form.expertise.badge} onChange={handleSimple} />
      <TextInput label="Title" name="expertise.title" value={form.expertise.title} onChange={handleSimple} />
      <TextInput label="Title Highlight" name="expertise.titleHighlight" value={form.expertise.titleHighlight} onChange={handleSimple} />
      <TextArea label="Subtitle" name="expertise.subtitle" value={form.expertise.subtitle} onChange={handleSimple} />
      <EditSection title="Expertise Cards" nested>
        {form.expertise.cards.map((card, i) => (
          <div className="admin-home-value-edit" key={i}>
            <div className="admin-home-value-edit-head">
              <span>Card {i + 1}</span>
              <button type="button" className="admin-home-remove-btn" onClick={() => removeNestedArrayItem("expertise", "cards", i)}>
                ✕
              </button>
            </div>
            <TextInput label="Icon" value={card.icon} onChange={(e) => updateNestedArrayItem("expertise", "cards", i, "icon", e.target.value)} />
            <TextInput label="Title" value={card.title} onChange={(e) => updateNestedArrayItem("expertise", "cards", i, "title", e.target.value)} />
            <TextArea label="Description" value={card.description} onChange={(e) => updateNestedArrayItem("expertise", "cards", i, "description", e.target.value)} />
            <TextInput label="Alt" value={card.alt} onChange={(e) => updateNestedArrayItem("expertise", "cards", i, "alt", e.target.value)} />
            <TextInput label="Gradient Class" value={card.gradient} onChange={(e) => updateNestedArrayItem("expertise", "cards", i, "gradient", e.target.value)} />
            <ImageEditField
              label="Card Image"
              fieldName={`expertiseImage_${i}`}
              currentPath={card._preview ? "" : card.image}
              preview={card._preview}
              onSelect={(e) => handleNestedArrayImage("expertise", "cards", i, e)}
            />
          </div>
        ))}
        <button type="button" className="admin-home-add-btn" onClick={() => addNestedArrayItem("expertise", "cards", { icon: "", title: "", description: "", image: "", alt: "", gradient: "" })}>
          + Add Card
        </button>
      </EditSection>
    </EditSection>

    {/* Partner */}
    <EditSection title="Why Choose Us Section">
      <TextInput label="Badge" name="partner.badge" value={form.partner.badge} onChange={handleSimple} />
      <TextInput label="Title" name="partner.title" value={form.partner.title} onChange={handleSimple} />
      <TextInput label="Title Highlight" name="partner.titleHighlight" value={form.partner.titleHighlight} onChange={handleSimple} />
      <TextInput label="Subtitle" name="partner.subtitle" value={form.partner.subtitle} onChange={handleSimple} />
      <TextInput label="Description Title" name="partner.descriptionTitle" value={form.partner.descriptionTitle} onChange={handleSimple} />
      <TextArea label="Description Text" name="partner.descriptionText" value={form.partner.descriptionText} onChange={handleSimple} />
      <TextArea label="Description Text 2" name="partner.descriptionText2" value={form.partner.descriptionText2} onChange={handleSimple} />
      <RepeatArray
        title="Description Stats"
        addLabel="+ Add Stat"
        items={form.partner.descriptionStats}
        onAdd={() => addNestedArrayItem("partner", "descriptionStats", { number: "", label: "" })}
        onRemove={(i) => removeNestedArrayItem("partner", "descriptionStats", i)}
        renderItem={(stat, i) => (
          <>
            <TextInput label="Number" value={stat.number} onChange={(e) => updateNestedArrayItem("partner", "descriptionStats", i, "number", e.target.value)} />
            <TextInput label="Label" value={stat.label} onChange={(e) => updateNestedArrayItem("partner", "descriptionStats", i, "label", e.target.value)} />
          </>
        )}
      />
      <EditSection title="Features" nested>
        {form.partner.features.map((feature, i) => (
          <div className="admin-home-value-edit" key={i}>
            <div className="admin-home-value-edit-head">
              <span>Feature {i + 1}</span>
              <button type="button" className="admin-home-remove-btn" onClick={() => removeNestedArrayItem("partner", "features", i)}>
                ✕
              </button>
            </div>
            <TextInput label="Icon" value={feature.icon} onChange={(e) => updateNestedArrayItem("partner", "features", i, "icon", e.target.value)} />
            <TextInput label="Title" value={feature.title} onChange={(e) => updateNestedArrayItem("partner", "features", i, "title", e.target.value)} />
            <TextArea label="Description" value={feature.description} onChange={(e) => updateNestedArrayItem("partner", "features", i, "description", e.target.value)} />
            <TextInput label="Gradient Class" value={feature.gradient} onChange={(e) => updateNestedArrayItem("partner", "features", i, "gradient", e.target.value)} />
          </div>
        ))}
        <button type="button" className="admin-home-add-btn" onClick={() => addNestedArrayItem("partner", "features", { icon: "", title: "", description: "", gradient: "" })}>
          + Add Feature
        </button>
      </EditSection>
      <TextInput label="CTA Text" name="partner.ctaText" value={form.partner.ctaText} onChange={handleSimple} />
      <TextInput label="CTA Button Text" name="partner.ctaButtonText" value={form.partner.ctaButtonText} onChange={handleSimple} />
      <TextInput label="CTA Link" name="partner.ctaLink" value={form.partner.ctaLink} onChange={handleSimple} />
    </EditSection>

    {/* Showcase */}
    <EditSection title="Product Showcase Section">
      <TextInput label="Badge" name="showcase.badge" value={form.showcase.badge} onChange={handleSimple} />
      <TextInput label="Title" name="showcase.title" value={form.showcase.title} onChange={handleSimple} />
      <TextInput label="Title Highlight" name="showcase.titleHighlight" value={form.showcase.titleHighlight} onChange={handleSimple} />
      <TextArea label="Subtitle" name="showcase.subtitle" value={form.showcase.subtitle} onChange={handleSimple} />
      <EditSection title="Products" nested>
        {form.showcase.products.map((product, i) => (
          <div className="admin-home-value-edit" key={i}>
            <div className="admin-home-value-edit-head">
              <span>Product {i + 1}</span>
              <button type="button" className="admin-home-remove-btn" onClick={() => removeNestedArrayItem("showcase", "products", i)}>
                ✕
              </button>
            </div>
            <ImageEditField
              label="Product Image"
              fieldName={`showcaseImage_${i}`}
              currentPath={product._preview ? "" : product.image}
              preview={product._preview}
              onSelect={(e) => handleNestedArrayImage("showcase", "products", i, e)}
            />
          </div>
        ))}
        <button type="button" className="admin-home-add-btn" onClick={() => addNestedArrayItem("showcase", "products", { image: "" })}>
          + Add Product
        </button>
      </EditSection>
    </EditSection>

    {/* Brands */}
    <EditSection title="Brands Section">
      <TextInput label="Badge" name="brands.badge" value={form.brands.badge} onChange={handleSimple} />
      <TextInput label="Title" name="brands.title" value={form.brands.title} onChange={handleSimple} />
      <TextInput label="Title Highlight" name="brands.titleHighlight" value={form.brands.titleHighlight} onChange={handleSimple} />
      <TextInput label="Subtitle" name="brands.subtitle" value={form.brands.subtitle} onChange={handleSimple} />
      <EditSection title="Brands" nested>
        {form.brands.brands.map((brand, i) => (
          <div className="admin-home-value-edit" key={i}>
            <div className="admin-home-value-edit-head">
              <span>Brand {i + 1}</span>
              <button type="button" className="admin-home-remove-btn" onClick={() => removeNestedArrayItem("brands", "brands", i)}>
                ✕
              </button>
            </div>
            <TextInput label="Name" value={brand.name} onChange={(e) => updateNestedArrayItem("brands", "brands", i, "name", e.target.value)} />
            <TextInput label="Logo URL" value={brand.logo} onChange={(e) => updateNestedArrayItem("brands", "brands", i, "logo", e.target.value)} />
            <ImageEditField
              label="Logo Upload"
              fieldName={`brandLogo_${i}`}
              currentPath={brand._preview ? "" : brand.logo}
              preview={brand._preview}
              onSelect={(e) => handleNestedArrayImage("brands", "brands", i, e)}
            />
          </div>
        ))}
        <button type="button" className="admin-home-add-btn" onClick={() => addNestedArrayItem("brands", "brands", { name: "", logo: "" })}>
          + Add Brand
        </button>
      </EditSection>
      <RepeatArray
        title="Trust Indicators"
        addLabel="+ Add Indicator"
        items={form.brands.trustIndicators}
        onAdd={() => addNestedArrayItem("brands", "trustIndicators", { icon: "", title: "", subtitle: "" })}
        onRemove={(i) => removeNestedArrayItem("brands", "trustIndicators", i)}
        renderItem={(t, i) => (
          <>
            <TextInput label="Icon" value={t.icon} onChange={(e) => updateNestedArrayItem("brands", "trustIndicators", i, "icon", e.target.value)} />
            <TextInput label="Title" value={t.title} onChange={(e) => updateNestedArrayItem("brands", "trustIndicators", i, "title", e.target.value)} />
            <TextInput label="Subtitle" value={t.subtitle} onChange={(e) => updateNestedArrayItem("brands", "trustIndicators", i, "subtitle", e.target.value)} />
          </>
        )}
      />
    </EditSection>

    <div className="admin-home-form-actions">
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
  <div className="admin-home-section">
    <h2 className="admin-home-section-title">{title}</h2>
    <div className="admin-home-section-body">{children}</div>
  </div>
);

const EditSection = ({ title, nested, action, children }) => (
  <div className={`admin-home-section ${nested ? "nested" : ""}`}>
    <div className="admin-home-section-head">
      <h2 className="admin-home-section-title">{title}</h2>
      {action}
    </div>
    <div className="admin-home-section-body">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="admin-home-field">
    <span className="admin-home-field-label">{label}</span>
    <p className="admin-home-field-value">{value || "—"}</p>
  </div>
);

const ArrayChips = ({ label, items }) => (
  <div className="admin-home-array">
    <span className="admin-home-field-label">{label}</span>
    <div className="admin-home-chip-grid">
      {items.length ? (
        items.map((it, i) => (
          <div className="admin-home-chip" key={i}>
            {it}
          </div>
        ))
      ) : (
        <span className="admin-home-field-value">—</span>
      )}
    </div>
  </div>
);

const ImagePreview = ({ src, alt }) => {
  const resolved = getImageUrl(src);
  return resolved ? (
    <div className="admin-home-img-preview">
      <img src={resolved} alt={alt} />
    </div>
  ) : null;
};

const TextInput = ({ label, name, value, onChange }) => (
  <div className="admin-home-form-group">
    <label>{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} />
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div className="admin-home-form-group">
    <label>{label}</label>
    <textarea rows="3" name={name} value={value} onChange={onChange} />
  </div>
);

const ImageEditField = ({ label, fieldName, currentPath, preview, onSelect }) => (
  <div className="admin-home-form-group">
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
      <div className="admin-home-img-preview">
        <img src={preview || getImageUrl(currentPath)} alt={label} />
      </div>
    )}
    <small className="help-text">Leave unchanged to keep the current image</small>
  </div>
);

const VideoEditField = ({ label, fieldName, currentPath, preview, onSelect }) => (
  <div className="admin-home-form-group">
    <label>{label}</label>
    <div className="file-upload-wrapper">
      <input
        type="file"
        accept="video/*"
        onChange={onSelect}
        className="file-input"
        id={fieldName}
      />
      <label htmlFor={fieldName} className="file-upload-label">
        <span className="upload-icon">📤</span>
        {preview || currentPath ? "Change Video" : "Upload Video"}
      </label>
    </div>
    {(preview || currentPath) && (
      <div className="admin-home-img-preview">
        <video src={preview || getImageUrl(currentPath)} controls style={{ width: "100%" }} />
      </div>
    )}
    <small className="help-text">Leave unchanged to keep the current video. If empty, the default background video is used.</small>
  </div>
);

const ToggleField = ({ label, name, value, onChange }) => (
  <div className="admin-home-form-group">
    <label>{label}</label>
    <div className="admin-home-mode-toggle">
      <button
        type="button"
        className={value ? "mode-btn active" : "mode-btn"}
        onClick={() => onChange(name, true)}
      >
        Active
      </button>
      <button
        type="button"
        className={!value ? "mode-btn active" : "mode-btn"}
        onClick={() => onChange(name, false)}
      >
        Inactive
      </button>
    </div>
  </div>
);

const RepeatArray = ({ title, addLabel, items, onAdd, onRemove, renderItem }) => (
  <div className="admin-home-repeat">
    <div className="admin-home-repeat-head">
      <span className="admin-home-field-label">{title}</span>
      <button type="button" className="admin-home-add-btn" onClick={onAdd}>
        {addLabel}
      </button>
    </div>
    {items.map((item, i) => (
      <div className="admin-home-repeat-row" key={i}>
        {renderItem(item, i)}
        <button type="button" className="admin-home-remove-btn" onClick={() => onRemove(i)}>
          ✕
        </button>
      </div>
    ))}
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

export default AdminHome;
