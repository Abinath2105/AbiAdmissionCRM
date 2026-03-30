import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { setRole, role, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleLogout = () => {
    setRole(null);
    setShowDropdown(false);
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  const getRoleBadgeClass = () => {
    switch(role) {
      case "ADMIN": return "premium-header__badge--admin";
      case "OFFICER": return "premium-header__badge--officer";
      case "MANAGEMENT": return "premium-header__badge--management";
      default: return "";
    }
  };

  return (
    <>
      <header className="premium-header">
        <div className="premium-header__container">
          {/* Logo Section */}
          <div className="premium-header__logo">
          
          </div>

          {/* Right Section */}
          <div className="premium-header__right">
            {/* Role Badge */}
            <div className={`premium-header__badge ${getRoleBadgeClass()}`}>
              <span className="premium-header__badge-icon">
                {role === "ADMIN" && ""}
                {role === "OFFICER" && "📋"}
                {role === "MANAGEMENT" && "📊"}
              </span>
              <span className="premium-header__badge-text">{role}</span>
            </div>

            {/* User Profile Dropdown */}
            <div className="premium-header__user">
              <button 
                className="premium-header__user-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
              >
                <div className="premium-header__avatar">
                  {getUserInitials()}
                </div>
                <div className="premium-header__user-info">
                  <span className="premium-header__user-name">
                    {user?.name || "admin"}
                  </span>
                  <span className="premium-header__user-email">
                    {user?.email || "admin@gmail.com"}
                  </span>
                </div>
                <svg 
                  className={`premium-header__chevron ${showDropdown ? 'premium-header__chevron--open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="premium-header__dropdown">
                  <div className="premium-header__dropdown-header">
                    <div className="premium-header__dropdown-avatar">
                      {getUserInitials()}
                    </div>
                    <div className="premium-header__dropdown-info">
                      <span className="premium-header__dropdown-name">
                        {user?.name || "Guest User"}
                      </span>
                      <span className="premium-header__dropdown-email">
                        {user?.email || "user@admission.com"}
                      </span>
                    </div>
                  </div>
                  <div className="premium-header__dropdown-divider"></div>
                  <button className="premium-header__dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                      <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
                      <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
                    </svg>
                    Profile Settings
                  </button>
                  <button className="premium-header__dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1L8 11M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                      <path d="M2 13H14" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    Change Password
                  </button>
                  <button 
                    className="premium-header__dropdown-item premium-header__dropdown-item--danger"
                    onClick={() => setShowResetModal(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13 3L3 13M3 3L13 13" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    Reset Data
                  </button>
                  <div className="premium-header__dropdown-divider"></div>
                  <button 
                    className="premium-header__dropdown-item premium-header__dropdown-item--logout"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6 3H3V13H6M10 3L14 8L10 13M8 8H3" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="premium-header__actions">
              <button className="premium-header__action-btn" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C8.5 2 7 3 7 5C7 6 7.5 7 8 8C5.5 8.5 4 10 4 12H16C16 10 14.5 8.5 12 8C12.5 7 13 6 13 5C13 3 11.5 2 10 2Z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8 15C8 16 9 17 10 17C11 17 12 16 12 15" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                <span className="premium-header__badge-notification">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="premium-modal" onClick={() => setShowResetModal(false)}>
          <div className="premium-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="premium-modal__icon premium-modal__icon--warning">
              ⚠️
            </div>
            <h3 className="premium-modal__title">Reset All Data?</h3>
            <p className="premium-modal__message">
              This action will permanently delete all local data and reset the application. 
              This cannot be undone.
            </p>
            <div className="premium-modal__actions">
              <button 
                className="premium-modal__btn premium-modal__btn--secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button 
                className="premium-modal__btn premium-modal__btn--danger"
                onClick={handleReset}
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}