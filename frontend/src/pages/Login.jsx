import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Logo from "../assets/logo.png";
import { useAuth } from "../store/auth.jsx";
import "../styles/login.css";
import { API_BASE_URL } from "../config.js";


export default function Login() {
  const [user, setUser] = useState({
    email: "",
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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
      const res_data = await response.json();
      if (response.ok) {
        sotreTokenInLocalStorage(res_data.token);
        setUser({
          email: "",
          password: "",
        });

        navigate("/");
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Side - Brand/Illustration */}
        <div className="login-brand">
          <div className="brand-content">
            <img className="brand-logo" src={Logo} alt="GPT LEGACY LTD." />
            <h1 className="brand-title">Welcome Back</h1>
            <p className="brand-subtitle">
              Sign in to access your dashboard and manage your sourcing
              operations.
            </p>
            <div className="brand-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Global Brands</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Client Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="brand-decoration">
            <div className="deco-shape shape-1"></div>
            <div className="deco-shape shape-2"></div>
            <div className="deco-shape shape-3"></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form">
          <div className="form-header">
            <h2 className="form-title">Sign In</h2>
            <p className="form-subtitle">
              Welcome back! Please enter your credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
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
                  placeholder="Enter your password"
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
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-btn">
              Sign In
              <span className="btn-arrow">→</span>
            </button>

            {/* Register Link */}
            <div className="register-link">
              Don't have an account? <NavLink to="/register">Create Account</NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
