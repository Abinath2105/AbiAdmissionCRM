import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const { role } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!role) return null;

  const getRoleIcon = () => {
    switch(role) {
      case "ADMIN": return "👑";
      case "OFFICER": return "📋";
      case "MANAGEMENT": return "📊";
      default: return "👤";
    }
  };

  const getRoleColor = () => {
    switch(role) {
      case "ADMIN": return "#f59e0b";
      case "OFFICER": return "#3b82f6";
      case "MANAGEMENT": return "#10b981";
      default: return "#64748b";
    }
  };

  return (
    <div className={`premium-sidebar ${isCollapsed ? 'premium-sidebar--collapsed' : ''}`}>
   
      <div className="premium-sidebar__header">
        <div className="premium-sidebar__logo">
          <div className="premium-sidebar__logo-icon">🎓</div>
          {!isCollapsed && (
            <div className="premium-sidebar__logo-text">
              <span className="premium-sidebar__logo-title">Admission CRM</span>
              <span className="premium-sidebar__logo-subtitle">Management System</span>
            </div>
          )}
        </div>
      </div>

    

      {/* Navigation */}
      <nav className="premium-sidebar__nav">
        <ul className="premium-sidebar__menu">
  
          {role === "ADMIN" && (
            <li className="premium-sidebar__menu-item">
                  <li className="premium-sidebar__menu-item">
            <Link to="/" className="premium-sidebar__menu-link">
              <span className="premium-sidebar__menu-icon">📊</span>
              {!isCollapsed && <span className="premium-sidebar__menu-text">Dashboard</span>}
            </Link>
          </li>

              <Link to="/setup" className="premium-sidebar__menu-link">
                <span className="premium-sidebar__menu-icon">⚙️</span>
                {!isCollapsed && <span className="premium-sidebar__menu-text">Master Setup</span>}
              </Link>
            </li>
          )}

          {/* OFFICER */}
          {role === "OFFICER" && (
            <>
              <li className="premium-sidebar__menu-item">
            <Link to="/officerDashboard" className="premium-sidebar__menu-link">
              <span className="premium-sidebar__menu-icon">📊</span>
              {!isCollapsed && <span className="premium-sidebar__menu-text">Dashboard</span>}
            </Link>
          </li>

              <li className="premium-sidebar__menu-item">
                <Link to="/applicant" className="premium-sidebar__menu-link">
                  <span className="premium-sidebar__menu-icon">👥</span>
                  {!isCollapsed && <span className="premium-sidebar__menu-text">Applicant</span>}
                </Link>
              </li>
              <li className="premium-sidebar__menu-item">
                <Link to="/allocation" className="premium-sidebar__menu-link">
                  <span className="premium-sidebar__menu-icon">🎯</span>
                  {!isCollapsed && <span className="premium-sidebar__menu-text">Seat Allocation</span>}
                </Link>
              </li>
              <li className="premium-sidebar__menu-item">
                <Link to="/confirm" className="premium-sidebar__menu-link">
                  <span className="premium-sidebar__menu-icon">✅</span>
                  {!isCollapsed && <span className="premium-sidebar__menu-text">Admission</span>}
                </Link>
              </li>
            </>
          )}
           {role === "MANAGEMENT" && (
            <>
              <li className="premium-sidebar__menu-item">
            <Link to="/managementDashboard" className="premium-sidebar__menu-link">
              <span className="premium-sidebar__menu-icon">📊</span>
              {!isCollapsed && <span className="premium-sidebar__menu-text">Dashboard</span>}
            </Link>
          </li>

          
           
            </>
          )}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="premium-sidebar__footer">
          <div className="premium-sidebar__footer-line"></div>
          <div className="premium-sidebar__footer-text">
            <span className="premium-sidebar__footer-version">v2.0.0</span>
            <span className="premium-sidebar__footer-copyright">© 2026 CRM</span>
          </div>
        </div>
      )}
    </div>
  );
}