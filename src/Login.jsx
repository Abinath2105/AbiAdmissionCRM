import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials if remember me was checked
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedUsername && savedPassword) {
      setForm({ username: savedUsername, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 800));

//     // Demo credentials
//     if (form.username === "admin" && form.password === "admin123") {
//       setRole("ADMIN");
//       localStorage.setItem("role", "ADMIN");
      
//       if (rememberMe) {
//         localStorage.setItem("rememberedUsername", form.username);
//         localStorage.setItem("rememberedPassword", form.password);
//       } else {
//         localStorage.removeItem("rememberedUsername");
//         localStorage.removeItem("rememberedPassword");
//       }
      
//       navigate("/");
//     } else if (form.username === "officer" && form.password === "officer123") {
//       setRole("OFFICER");
//       localStorage.setItem("role", "OFFICER");
      
//       if (rememberMe) {
//         localStorage.setItem("rememberedUsername", form.username);
//         localStorage.setItem("rememberedPassword", form.password);
//       } else {
//         localStorage.removeItem("rememberedUsername");
//         localStorage.removeItem("rememberedPassword");
//       }
      
//       navigate("/managementDashboard");
//     } else if (form.username === "mgmt" && form.password === "mgmt123") {
//       setRole("MANAGEMENT");
//       localStorage.setItem("role", "MANAGEMENT");
      
//       if (rememberMe) {
//         localStorage.setItem("rememberedUsername", form.username);
//         localStorage.setItem("rememberedPassword", form.password);
//       } else {
//         localStorage.removeItem("rememberedUsername");
//         localStorage.removeItem("rememberedPassword");
//       }
      
//       navigate("/");
//     } else {
//       setError("Invalid username or password. Please try again.");
//       setIsLoading(false);
//     }
//   };
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  // ⏳ Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let role = null;
  let redirectPath = "";

  // 🔐 Validate credentials
  if (form.username === "admin" && form.password === "admin123") {
    role = "ADMIN";
    redirectPath = "/";
  } 
  else if (form.username === "officer" && form.password === "officer123") {
    role = "OFFICER";
    redirectPath = "/officerDashboard";   // ✅ FIXED
  } 
  else if (form.username === "mgmt" && form.password === "mgmt123") {
    role = "MANAGEMENT";
    redirectPath = "/managementDashboard"; // ✅ FIXED
  } 
  else {
    setError("Invalid username or password. Please try again.");
    setIsLoading(false);
    return;
  }

  // ✅ Set role (this already updates localStorage via AuthContext)
  setRole(role);

  // 💾 Remember Me
  if (rememberMe) {
    localStorage.setItem("rememberedUsername", form.username);
    localStorage.setItem("rememberedPassword", form.password);
  } else {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");
  }

  // 🚀 Redirect
  navigate(redirectPath);
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError("");
  };

  return (
    <div className="premium-login">
      <div className="premium-login__container">
        {/* Left Side - Branding */}
        <div className="premium-login__brand">
          <div className="premium-login__brand-content">
            <div className="premium-login__logo">
              <div className="premium-login__logo-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 6L6 16L24 26L42 16L24 6Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M6 24L24 34L42 24" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M6 34L24 44L42 34" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="16" r="3" fill="currentColor"/>
                </svg>
              </div>
              <div className="premium-login__logo-text">
                <span className="premium-login__logo-title">Admission CRM</span>
              
              </div>
            </div>
            <div className="premium-login__tagline">
              <h1 className="premium-login__tagline-title">Welcome Back</h1>
              <p className="premium-login__tagline-text">
                Streamline your admission process with our comprehensive management system
              </p>
            </div>
            <div className="premium-login__features">
              <div className="premium-login__feature">
                <div className="premium-login__feature-icon">📊</div>
                <div className="premium-login__feature-text">
                  <strong>Real-time Analytics</strong>
                  <span>Track admissions instantly</span>
                </div>
              </div>
              <div className="premium-login__feature">
                <div className="premium-login__feature-icon">🎯</div>
                <div className="premium-login__feature-text">
                  <strong>Smart Allocation</strong>
                  <span>Automated seat distribution</span>
                </div>
              </div>
              <div className="premium-login__feature">
                <div className="premium-login__feature-icon">🔒</div>
                <div className="premium-login__feature-text">
                  <strong>Secure Access</strong>
                  <span>Role-based permissions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="premium-login__form-container">
          <div className="premium-login__form-wrapper">
            <div className="premium-login__form-header">
              <h2 className="premium-login__form-title">Sign In</h2>
              <p className="premium-login__form-subtitle">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Demo Credentials Hint */}
            <div className="premium-login__demo-hint">
              <div className="premium-login__demo-icon">💡</div>
              <div className="premium-login__demo-text">
                <strong>Demo Credentials:</strong>
                <div className="premium-login__demo-list">
                  <span>Admin: admin / admin123</span>
                  <span>Officer: officer / officer123</span>
                  <span>Management: mgmt / mgmt123</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="premium-login__error">
                <span className="premium-login__error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="premium-login__form">
              <div className="premium-login__form-group">
                <label htmlFor="username" className="premium-login__label">
                  Username
                </label>
                <div className="premium-login__input-wrapper">
                  <span className="premium-login__input-icon">👤</span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="premium-login__input"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleInputChange}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="premium-login__form-group">
                <label htmlFor="password" className="premium-login__label">
                  Password
                </label>
                <div className="premium-login__input-wrapper">
                  <span className="premium-login__input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="premium-login__input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="premium-login__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="premium-login__options">
                <label className="premium-login__checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="premium-login__checkbox-label">Remember me</span>
                </label>
                <a href="#" className="premium-login__forgot-link">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="premium-login__submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="premium-login__spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="premium-login__submit-icon">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="premium-login__footer">
              <p className="premium-login__footer-text">
                © 2024 Admission CRM. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}