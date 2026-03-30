import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { data } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Safely check if data exists
  if (!data) {
    return (
      <div className="crm-loading">
        <div className="crm-loading__spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  // Ensure data.programs exists and is an array
  const programs = Array.isArray(data.programs) ? data.programs : [];
  const admissions = Array.isArray(data.admissions) ? data.admissions : [];
  const applicants = Array.isArray(data.applicants) ? data.applicants : [];

  // Derived statistics with safe checks
  const totalPrograms = programs.length;
  const totalAdmissions = admissions.length;
  const totalApplicants = applicants.length;
  
  const pendingFeesTotal = admissions.filter(a => a?.feeStatus !== "PAID").length;
  const pendingDocsTotal = applicants.filter(a => a?.documents !== "VERIFIED").length;
  
  const overallFillRate = totalPrograms > 0 
    ? Math.round((totalAdmissions / programs.reduce((sum, p) => sum + (p?.intake || 0), 0)) * 100)
    : 0;

  // Filter programs based on search and status
  const filteredPrograms = programs.filter(program => {
    if (!program || !program.name) return false;
    
    const matchesSearch = (program.name?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) ||
                          (program.institution?.toLowerCase() || '').includes((searchTerm || '').toLowerCase());
    
    const admitted = admissions.filter(a => a?.programId === program.id).length;
    
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "full") {
      return matchesSearch && admitted >= (program.intake || 0);
    }
    if (activeFilter === "available") {
      return matchesSearch && admitted < (program.intake || 0);
    }
    return matchesSearch;
  });

  // Stats cards data
  const statsCards = [
    {
      title: "Total Programs",
      value: totalPrograms,
      icon: "🎓",
      color: "crm-stats-card--blue",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: "👥",
      color: "crm-stats-card--purple",
      trend: "+23%",
      trendUp: true
    },
    {
      title: "Admissions Confirmed",
      value: totalAdmissions,
      icon: "✓",
      color: "crm-stats-card--green",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Pending Documents",
      value: pendingDocsTotal,
      icon: "📄",
      color: "crm-stats-card--orange",
      trend: "-5%",
      trendUp: false
    },
    {
      title: "Pending Fees",
      value: pendingFeesTotal,
      icon: "💰",
      color: "crm-stats-card--red",
      trend: "-2%",
      trendUp: false
    },
    {
      title: "Overall Fill Rate",
      value: `${overallFillRate}%`,
      icon: "📈",
      color: "crm-stats-card--emerald",
      trend: "+18%",
      trendUp: true
    }
  ];

  // Function to handle program click and open modal
  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  // Function to generate pie chart data for a program
  const getPieChartData = (program) => {
    if (!program || !program.quotas) return [];
    
    const programAdmissions = admissions.filter(a => a?.programId === program.id);
    
    return program.quotas.map(quota => {
      const filled = programAdmissions.filter(a => a?.quota === quota?.type).length;
      const remaining = (quota?.seats || 0) - filled;
      return {
        name: quota?.type || 'Unknown',
        filled: filled,
        remaining: remaining,
        total: quota?.seats || 0,
        percentage: quota?.seats ? (filled / quota.seats) * 100 : 0
      };
    });
  };

  // Program Card Component with Pie Chart
  const ProgramCard = ({ program }) => {
    const programAdmissions = admissions.filter(a => a?.programId === program?.id);
    const admittedCount = programAdmissions.length;
    const remainingSeats = (program?.intake || 0) - admittedCount;
    const fillPercentage = program?.intake ? Math.round((admittedCount / program.intake) * 100) : 0;
    
    // Calculate color based on fill percentage
    const getProgressColor = () => {
      if (fillPercentage === 100) return '#ef4444';
      if (fillPercentage >= 80) return '#f59e0b';
      if (fillPercentage >= 50) return '#3b82f6';
      return '#10b981';
    };

    // Generate pie chart data
    const pieData = getPieChartData(program);
    
    // Calculate angles for pie chart segments
    let currentAngle = 0;
    const segments = pieData.map(item => {
      const angle = (item.filled / (item.total || 1)) * 360;
      const segment = { ...item, angle, startAngle: currentAngle };
      currentAngle += angle;
      return segment;
    });

    return (
      <div className="crm-program-card" onClick={() => handleProgramClick(program)}>
        <div className="crm-program-card__header">
          <div className="crm-program-card__title-section">
            <div className="crm-program-card__icon">
              <span>🎓</span>
            </div>
            <div>
              <h3 className="crm-program-card__title">{program.name || 'Unnamed Program'}</h3>
              <div className="crm-program-card__meta">
                <span className="crm-badge crm-badge--light">{program.institution || 'N/A'}</span>
                <span className="crm-badge crm-badge--light">{program.campus || 'N/A'}</span>
                <span className="crm-badge crm-badge--light">{program.department || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="crm-program-card__stats-badge">
            <span className={`crm-fill-badge ${fillPercentage === 100 ? 'crm-fill-badge--full' : ''}`}>
              {fillPercentage}% Filled
            </span>
          </div>
        </div>

        <div className="crm-program-card__content">
          {/* Pie Chart Container */}
          <div className="crm-pie-chart-container">
            <div className="crm-pie-chart">
              <svg viewBox="0 0 100 100" className="crm-pie-svg">
                {segments.map((segment, index) => {
                  if (segment.angle === 0) return null;
                  const startRad = (segment.startAngle * Math.PI) / 180;
                  const endRad = ((segment.startAngle + segment.angle) * Math.PI) / 180;
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);
                  const largeArc = segment.angle > 180 ? 1 : 0;
                  
                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={getQuotaColor(index)}
                      className="crm-pie-segment"
                    />
                  );
                })}
                {segments.length === 0 && (
                  <circle cx="50" cy="50" r="40" fill="#e5e7eb" />
                )}
                <circle cx="50" cy="50" r="25" fill="white" className="crm-pie-center" />
              </svg>
              <div className="crm-pie-center-text">
                <span className="crm-pie-percentage">{fillPercentage}%</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="crm-legend">
              {pieData.map((item, index) => (
                <div key={index} className="crm-legend__item">
                  <div className="crm-legend__color" style={{ backgroundColor: getQuotaColor(index) }}></div>
                  <div className="crm-legend__info">
                    <span className="crm-legend__name">{item.name}</span>
                    <span className="crm-legend__stats">{item.filled}/{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="crm-quick-stats">
            <div className="crm-quick-stat">
              <span className="crm-quick-stat__label">Total Intake</span>
              <span className="crm-quick-stat__value">{program.intake || 0}</span>
            </div>
            <div className="crm-quick-stat">
              <span className="crm-quick-stat__label">Admitted</span>
              <span className="crm-quick-stat__value crm-quick-stat__value--success">{admittedCount}</span>
            </div>
            <div className="crm-quick-stat">
              <span className="crm-quick-stat__label">Remaining</span>
              <span className={`crm-quick-stat__value ${remainingSeats === 0 ? 'crm-quick-stat__value--danger' : 'crm-quick-stat__value--warning'}`}>
                {remainingSeats}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="crm-progress-bar">
            <div className="crm-progress-bar__track">
              <div 
                className="crm-progress-bar__fill"
                style={{ width: `${fillPercentage}%`, backgroundColor: getProgressColor() }}
              />
            </div>
          </div>

          <div className="crm-card-footer">
            <span className="crm-click-hint">Click to view full details →</span>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to get quota colors
  const getQuotaColor = (index) => {
    const colors = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
    return colors[index % colors.length];
  };

  // Modal Component
  const ProgramModal = ({ program, onClose }) => {
    if (!program) return null;
    
    const programAdmissions = admissions.filter(a => a?.programId === program.id);
    const admittedCount = programAdmissions.length;
    const remainingSeats = (program.intake || 0) - admittedCount;
    const fillPercentage = program.intake ? Math.round((admittedCount / program.intake) * 100) : 0;
    
    const pendingFees = programAdmissions.filter(a => a?.feeStatus !== "PAID");
    const applicantsForProgram = applicants.filter(app =>
      programAdmissions.some(a => a?.applicantId === app?.id)
    );
    const pendingDocs = applicantsForProgram.filter(a => a?.documents !== "VERIFIED");
    
    // Generate quota data for modal
    const quotaData = program.quotas?.map(quota => {
      const filled = programAdmissions.filter(a => a?.quota === quota?.type).length;
      const remaining = (quota?.seats || 0) - filled;
      const percentage = quota?.seats ? (filled / quota.seats) * 100 : 0;
      return { ...quota, filled, remaining, percentage };
    }) || [];

    return (
      <div className="crm-modal-overlay" onClick={onClose}>
        <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="crm-modal__header">
            <div className="crm-modal__title-section">
              <div className="crm-modal__icon">🎓</div>
              <div>
                <h2 className="crm-modal__title">{program.name}</h2>
                <p className="crm-modal__subtitle">{program.institution} | {program.campus} | {program.department}</p>
              </div>
            </div>
            <button className="crm-modal__close" onClick={onClose}>✕</button>
          </div>
          
          <div className="crm-modal__body">
            {/* Overall Stats */}
            <div className="crm-modal-stats">
              <div className="crm-modal-stat">
                <span className="crm-modal-stat__label">Total Intake</span>
                <span className="crm-modal-stat__value">{program.intake}</span>
              </div>
              <div className="crm-modal-stat">
                <span className="crm-modal-stat__label">Admitted</span>
                <span className="crm-modal-stat__value crm-modal-stat__value--success">{admittedCount}</span>
              </div>
              <div className="crm-modal-stat">
                <span className="crm-modal-stat__label">Remaining Seats</span>
                <span className={`crm-modal-stat__value ${remainingSeats === 0 ? 'crm-modal-stat__value--danger' : 'crm-modal-stat__value--warning'}`}>
                  {remainingSeats}
                </span>
              </div>
              <div className="crm-modal-stat">
                <span className="crm-modal-stat__label">Fill Rate</span>
                <span className="crm-modal-stat__value">{fillPercentage}%</span>
              </div>
            </div>

            {/* Quota Details Table */}
            <div className="crm-modal-section">
              <h3 className="crm-modal-section__title">
                <span className="crm-modal-section__icon">📊</span>
                Quota-wise Distribution
              </h3>
              <table className="crm-modal-table">
                <thead>
                  <tr>
                    <th>Quota Type</th>
                    <th>Total Seats</th>
                    <th>Filled</th>
                    <th>Remaining</th>
                    <th>Fill Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {quotaData.map((q, i) => (
                    <tr key={i}>
                      <td className="crm-modal-table__quota">{q.type}</td>
                      <td>{q.seats}</td>
                      <td className="crm-modal-table__filled">{q.filled}</td>
                      <td className={q.remaining === 0 ? 'crm-modal-table__remaining--danger' : 'crm-modal-table__remaining--success'}>
                        {q.remaining}
                      </td>
                      <td>
                        <div className="crm-modal-progress">
                          <div className="crm-modal-progress__track">
                            <div 
                              className="crm-modal-progress__fill"
                              style={{ width: `${q.percentage}%`, backgroundColor: getQuotaColor(i) }}
                            />
                          </div>
                          <span className="crm-modal-progress__text">{Math.round(q.percentage)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pending Documents */}
            <div className="crm-modal-section">
              <h3 className="crm-modal-section__title">
                <span className="crm-modal-section__icon">📋</span>
                Pending Documents
                <span className="crm-modal-section__count">{pendingDocs.length}</span>
              </h3>
              {pendingDocs.length === 0 ? (
                <div className="crm-modal-empty">
                  <span>✅</span>
                  <p>All documents verified</p>
                </div>
              ) : (
                <ul className="crm-modal-list">
                  {pendingDocs.map(applicant => (
                    <li key={applicant.id} className="crm-modal-list__item">
                      <span className="crm-modal-list__icon">📎</span>
                      <span className="crm-modal-list__text">{applicant.name}</span>
                      <span className="crm-badge crm-badge--warning">Pending</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Fee Pending */}
            <div className="crm-modal-section">
              <h3 className="crm-modal-section__title">
                <span className="crm-modal-section__icon">💰</span>
                Fee Pending
                <span className="crm-modal-section__count">{pendingFees.length}</span>
              </h3>
              {pendingFees.length === 0 ? (
                <div className="crm-modal-empty">
                  <span>✅</span>
                  <p>All fees cleared</p>
                </div>
              ) : (
                <ul className="crm-modal-list">
                  {pendingFees.map(admission => {
                    const applicant = applicants.find(ap => ap?.id === admission?.applicantId);
                    return (
                      <li key={admission.id} className="crm-modal-list__item">
                        <span className="crm-modal-list__icon">💳</span>
                        <span className="crm-modal-list__text">{applicant?.name || 'Unknown'}</span>
                        <span className="crm-badge crm-badge--danger">Pending</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="crm-dashboard">
      <main className="crm-main">
        {/* Header */}
        <header className="crm-header">
          <div className="crm-header__left">
            <h1 className="crm-header__title">Admission Dashboard</h1>
            <p className="crm-header__subtitle">Track program admissions, quotas, and pending items</p>
          </div>
          <div className="crm-header__right">
            <div className="crm-search">
              <span className="crm-search__icon">🔍</span>
              <input
                type="text"
                className="crm-search__input"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="crm-stats-grid">
          {statsCards.map((card, index) => (
            <div key={index} className={`crm-stats-card ${card.color}`}>
              <div className="crm-stats-card__icon">{card.icon}</div>
              <div className="crm-stats-card__content">
                <h3 className="crm-stats-card__title">{card.title}</h3>
                <p className="crm-stats-card__value">{card.value}</p>
                <div className={`crm-stats-card__trend crm-stats-card__trend--${card.trendUp ? 'up' : 'down'}`}>
                  <span>{card.trend}</span>
                  <span>{card.trendUp ? '↑' : '↓'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="crm-filters">
          <div className="crm-filters__tabs">
            <button 
              className={`crm-filter-tab ${activeFilter === 'all' ? 'crm-filter-tab--active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Programs
            </button>
            <button 
              className={`crm-filter-tab ${activeFilter === 'available' ? 'crm-filter-tab--active' : ''}`}
              onClick={() => setActiveFilter('available')}
            >
              Seats Available
            </button>
            <button 
              className={`crm-filter-tab ${activeFilter === 'full' ? 'crm-filter-tab--active' : ''}`}
              onClick={() => setActiveFilter('full')}
            >
              Full Programs
            </button>
          </div>
          <div className="crm-filters__stats">
            <span>Showing {filteredPrograms.length} of {programs.length} programs</span>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="crm-programs-grid">
          {filteredPrograms.length === 0 ? (
            <div className="crm-empty-state">
              <span className="crm-empty-state__icon">🔍</span>
              <h3>No programs found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredPrograms.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && selectedProgram && (
        <ProgramModal program={selectedProgram} onClose={closeModal} />
      )}
    </div>
  );
}