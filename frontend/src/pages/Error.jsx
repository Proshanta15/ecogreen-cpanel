import { Link } from "react-router-dom";
import "../styles/error.css";

const Error = () => {
    return (
        <section className="error-page">
            {/* Decorative background elements */}
            <div className="error-page-bg-circles">
                <div className="error-bg-circle circle-1"></div>
                <div className="error-bg-circle circle-2"></div>
                <div className="error-bg-circle circle-3"></div>
                <div className="error-bg-circle circle-4"></div>
                <div className="error-bg-circle circle-5"></div>
            </div>

            <div className="error-page-container">
                {/* Main Content */}
                <div className="error-page-content">
                    {/* 404 Illustration */}
                    <div className="error-page-illustration">
                        <div className="error-page-404-number">
                            <span className="error-page-digit error-page-digit-4">4</span>
                            <span className="error-page-digit error-page-digit-0">0</span>
                            <span className="error-page-digit error-page-digit-4">4</span>
                        </div>

                        {/* Decorative shapes */}
                        <div className="error-page-404-shapes">
                            <div className="error-page-shape shape-1"></div>
                            <div className="error-page-shape shape-2"></div>
                            <div className="error-page-shape shape-3"></div>
                            <div className="error-page-shape shape-4"></div>
                            <div className="error-page-shape shape-5"></div>
                        </div>

                        {/* Floating elements */}
                        <div className="error-page-floating-elements">
                            <span className="error-float-icon float-1">🚀</span>
                            <span className="error-float-icon float-2">💡</span>
                            <span className="error-float-icon float-3">🌟</span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="error-page-text">
                        <div className="error-page-badge">
                            <span className="error-page-badge-icon">🔍</span>
                            PAGE NOT FOUND
                        </div>
                        <h1 className="error-page-title">
                            Oops! Looks Like You're Lost
                        </h1>
                        <p className="error-page-description">
                            The page you are looking for might have been removed, had its name changed,
                            or is temporarily unavailable. But don't worry — we're here to help you find
                            your way back.
                        </p>

                        <div className="error-page-actions">
                            <Link to="/" className="error-page-btn-primary">
                                <span className="error-page-btn-icon">🏠</span>
                                Back to Home
                                <span className="error-page-btn-arrow">→</span>
                            </Link>
                            <Link to="/contact" className="error-page-btn-secondary">
                                <span className="error-btn-secondary-icon">✉</span>
                                Contact Support
                            </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="error-page-quick-links">
                            <span className="error-page-quick-label">Quick Navigation:</span>
                            <Link to="/about">About Us</Link>
                            <Link to="/services">Services</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/">Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Error;