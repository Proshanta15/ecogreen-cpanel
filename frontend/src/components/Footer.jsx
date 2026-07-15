import { FaMapMarkerAlt, FaMapPin } from "react-icons/fa";
import { FaArrowRight, FaInstagram, FaLinkedin, FaSquareFacebook, FaSquareXTwitter } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { IoMailUnreadOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import "../styles/footer.css";


const Footer = () => {
  return (
    <div className="container">
      

      {/* Quick Links & Social */}
      <div className="quick-links-modern">
        <div className="links-group">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </div>
        <div className="social-icons">
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Facebook">
            <FaSquareFacebook />
          </a>
          <a href="#" aria-label="X">
            <FaSquareXTwitter />
          </a>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="footer-copyright">
        <span>© {new Date().getFullYear()} Eco Green Tex Ltd. All Rights Reserved.</span>
        <span>
          Developed with ⚡ by <a href="https://www.bytebari.com" target="_blank" rel="noopener noreferrer">
            ByteBari.com
          </a> · Modern Sourcing
          Solutions
        </span>
      </div>
    </div>
  );
};

export default Footer;
