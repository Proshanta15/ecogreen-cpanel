import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Logo from "../assets/logo.png";
import { useAuth } from "../store/auth.jsx";
import "../styles/register.css";

import { API_BASE } from "../config";

export default function RegisterForm() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();

  const { sotreTokenInLocalStorage } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
      const res_data = await response.json();
      console.log("Response from server:", res_data);

      if (response.ok) {
        sotreTokenInLocalStorage(res_data.token);
        setUser({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        // Handle registration errors (e.g., show error message)
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        {/* Left Side - Brand/Illustration */}
        <div className="register-brand">
          <div className="brand-content">
            <img className="brand-logo" src={Logo} alt="GPT LEGACY LTD." />
            <h1 className="brand-title">Create Your Account</h1>
            <p className="brand-subtitle">
              Join the world's leading apparel sourcing network. Start your
              journey with us today.
            </p>
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">
                  Access to 500+ certified factories
                </span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Real-time order tracking</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Dedicated account manager</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">
                  ISO-certified quality assurance
                </span>
              </div>
            </div>
          </div>
          <div className="brand-decoration">
            <div className="deco-shape shape-1"></div>
            <div className="deco-shape shape-2"></div>
            <div className="deco-shape shape-3"></div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-form">
          <div className="form-header">
            <h2 className="form-title">Get Started</h2>
            <p className="form-subtitle">
              Fill in your details to create an account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {/* Username Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span>
                Username
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={user.username}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📱</span>
                Phone Number
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={user.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={user.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="password-hint">
                Must be at least 8 characters with 1 uppercase, 1 lowercase & 1
                number
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="register-btn">
              Create Account
              <span className="btn-arrow">→</span>
            </button>

            {/* Login Link */}
            <div className="login-link">
              Already have an account? <NavLink to="/login">Sign In</NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
