import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png"; // Make sure this path is correct
import { useAuth } from "../store/auth.jsx";
import "../styles/header.css"; // Make sure this path is correct

const Header = () => {
  const { isLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="nav_container">
          <div className="logo-area">
            <NavLink to="/" className="logo-link">
              <img className="logo" src={Logo} alt="GPT LEGACY LTD. Logo" />
            </NavLink>

          </div>

          <button
            className={`hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About Us</NavLink>
            <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
            {isLoggedIn && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
            {isLoggedIn && <NavLink to="/logout" onClick={closeMenu}>Logout</NavLink>}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`} onClick={closeMenu}></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <img className="mobile-logo" src={Logo} alt="GPT LEGACY LTD. Logo" />
          <button className="close-menu" onClick={closeMenu}>
            <span className="close-icon">×</span>
          </button>
        </div>
        <div className="mobile-nav-links">
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About Us</NavLink>
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          {isLoggedIn && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
          {isLoggedIn && <NavLink to="/logout" onClick={closeMenu}>Logout</NavLink>}
        </div>
      </div>
    </>
  );
};

export default Header;