import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth";
import "../../styles/admin-layout.css";
import IsLoading from "../IsLoading";
import {
  FaHouseUser,
  FaInfoCircle,
  FaListUl,
  FaAddressBook,
  FaEnvelopeOpenText,
  FaUsers,
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaArrowRight,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaLayerGroup,
} from "react-icons/fa";

export const AdminLayout = () => {
  const { user, isLoading, logoutUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <IsLoading />;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navLinkClass = ({ isActive }) =>
    isActive ? "admin-nav-link active" : "admin-nav-link";

  const sections = [
    {
      to: "/admin/home",
      title: "Home Page",
      desc: "Hero banner, who we are, expertise, partners, showcase & brands.",
      icon: <FaHouseUser />,
    },
    {
      to: "/admin/about",
      title: "About Page",
      desc: "About content, vision, mission, values and call-to-action.",
      icon: <FaInfoCircle />,
    },
    {
      to: "/admin/services",
      title: "Services",
      desc: "Manage service categories and their items.",
      icon: <FaListUl />,
    },
    {
      to: "/admin/contact/content",
      title: "Contact Content",
      desc: "Edit the contact page content and details.",
      icon: <FaAddressBook />,
    },
    {
      to: "/admin/contacts",
      title: "Contacts",
      desc: "Review messages submitted through the contact form.",
      icon: <FaEnvelopeOpenText />,
    },
    {
      to: "/admin/users",
      title: "Users",
      desc: "Manage admin and website user accounts.",
      icon: <FaUsers />,
    },
    {
      to: "/admin/faq",
      title: "FAQ",
      desc: "Manage frequently asked questions.",
      icon: <FaQuestionCircle />,
    },
    {
      to: "/admin/footer-showcase",
      title: "Footer Showcase",
      desc: "Visit & connect details and the contact highlight block.",
      icon: <FaMapMarkerAlt />,
    },
  ];

  const isIndex = location.pathname === "/admin";
  const initials = (user.username || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand-block">
          <div className="brand-logo">EG</div>
          <div className="brand-text">
            <p className="brand-tag">Admin Panel</p>
            <h2>Ecogreentex</h2>
          </div>
        </div>

        <nav aria-label="Admin navigation">
          <p className="nav-group-label">
            <FaLayerGroup /> Management
          </p>
          <ul className="admin-nav-list">
            {sections.map((s) => (
              <li key={s.to}>
                <NavLink to={s.to} className={navLinkClass}>
                  <span className="nav-icon">{s.icon}</span>
                  {s.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-meta">
            <strong>{user.username}</strong>
            <span>Administrator</span>
          </div>
        </div>

        <div className="sidebar-actions">
          <NavLink to="/" className="ghost-btn">
            <FaExternalLinkAlt /> Back to site
          </NavLink>
          <button type="button" className="ghost-btn danger" onClick={logoutUser}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        {isIndex ? (
          <div className="admin-overview">
            <header className="overview-header">
              <div>
                <p className="topbar-kicker">Dashboard</p>
                <h1>Welcome back, {user.username} 👋</h1>
                <p className="overview-sub">
                  Manage your site content and records from one place.
                </p>
              </div>
              <span className="status-pill">All systems live</span>
            </header>

            <div className="overview-grid">
              {sections.map((s) => (
                <NavLink to={s.to} className="overview-card" key={s.to}>
                  <div className="overview-card-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="overview-card-link">
                    Open <FaArrowRight />
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-content-shell">
            <Outlet />
          </div>
        )}
      </div>
    </section>
  );
};
