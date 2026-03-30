import React from "react";
import { useApp } from "../context/AppContext";
import "./OfficerDashboard.css";

export default function OfficerDashboard() {
  const { data } = useApp();

  // Metrics
  const totalApplicants = data.applicants.length;
  const totalAllocated = data.admissions.length;
  const totalConfirmed = data.admissions.filter(a => a.status === "CONFIRMED").length;
  const pendingAllocation = data.applicants.filter(app => !data.admissions.some(a => a.applicantId === app.id));

  // Pending Documents
  const pendingDocs = data.applicants.filter(a => a.documents !== "VERIFIED");

  // Fee Pending
  const feePending = data.admissions.filter(a => a.feeStatus !== "PAID");

  // Calculate percentages
  const allocationRate = totalApplicants > 0 ? (totalAllocated / totalApplicants) * 100 : 0;
  const confirmationRate = totalAllocated > 0 ? (totalConfirmed / totalAllocated) * 100 : 0;
  const documentVerificationRate = totalApplicants > 0 ? ((totalApplicants - pendingDocs.length) / totalApplicants) * 100 : 0;
  const feeCollectionRate = totalAllocated > 0 ? ((totalAllocated - feePending.length) / totalAllocated) * 100 : 0;

  // Category Distribution Data
  const categoryData = {
    GM: data.applicants.filter(a => a.category === "GM").length,
    SC: data.applicants.filter(a => a.category === "SC").length,
    ST: data.applicants.filter(a => a.category === "ST").length,
    OBC: data.applicants.filter(a => a.category === "OBC").length,
  };

  // Quota Distribution Data
  const quotaData = {
    KCET: data.applicants.filter(a => a.quotaType === "KCET").length,
    COMEDK: data.applicants.filter(a => a.quotaType === "COMEDK").length,
    Management: data.applicants.filter(a => a.quotaType === "Management").length,
  };

  // Document Status Data
  const documentData = {
    Verified: data.applicants.filter(a => a.documents === "VERIFIED").length,
    Submitted: data.applicants.filter(a => a.documents === "SUBMITTED").length,
    Pending: data.applicants.filter(a => a.documents === "PENDING").length,
  };

  // Admission Status Data
  const admissionData = {
    Confirmed: totalConfirmed,
    Allocated: totalAllocated - totalConfirmed,
    Pending: pendingAllocation.length,
  };

  return (
    <div className="officer-dashboard">
      <div className="officer-dashboard__header">
        <div className="officer-dashboard__title-section">
          <div className="officer-dashboard__icon">📊</div>
          <div>
            <h1 className="officer-dashboard__title">Admission Officer Dashboard</h1>
            <p className="officer-dashboard__subtitle">Monitor admission progress with visual analytics</p>
          </div>
        </div>
    
      </div>

      {/* Main Progress Bars */}
      <div className="officer-dashboard__main-bars">
        <h3 className="officer-dashboard__section-title">Overall Admission Progress</h3>
        <div className="officer-dashboard__bars-grid">
          <ProgressBar 
            title="Seat Allocation"
            value={totalAllocated}
            total={totalApplicants}
            percentage={allocationRate}
            color="#3b82f6"
            icon="🎯"
          />
          <ProgressBar 
            title="Document Verification"
            value={totalApplicants - pendingDocs.length}
            total={totalApplicants}
            percentage={documentVerificationRate}
            color="#8b5cf6"
            icon="📄"
          />
          <ProgressBar 
            title="Admission Confirmation"
            value={totalConfirmed}
            total={totalAllocated}
            percentage={confirmationRate}
            color="#f59e0b"
            icon="✅"
          />
          <ProgressBar 
            title="Fee Collection"
            value={totalAllocated - feePending.length}
            total={totalAllocated}
            percentage={feeCollectionRate}
            color="#10b981"
            icon="💰"
          />
        </div>
      </div>

      {/* Category Distribution */}
      <div className="officer-dashboard__stats-section">
        <h3 className="officer-dashboard__section-title">Category Distribution</h3>
        <div className="officer-dashboard__stats-grid">
          <HorizontalBarGraph 
            title="Category Wise Distribution"
            data={categoryData}
            colors={['#3b82f6', '#8b5cf6', '#ec489a', '#f59e0b']}
            total={totalApplicants}
          />
          
          <HorizontalBarGraph 
            title="Quota Distribution"
            data={quotaData}
            colors={['#10b981', '#06b6d4', '#f59e0b']}
            total={totalApplicants}
          />
        </div>
      </div>

      {/* Document & Admission Status */}
      <div className="officer-dashboard__stats-section">
        <h3 className="officer-dashboard__section-title">Status Overview</h3>
        <div className="officer-dashboard__stats-grid">
          <StackedBarGraph 
            title="Document Status"
            data={documentData}
            colors={['#10b981', '#f59e0b', '#ef4444']}
          />
          
          <StackedBarGraph 
            title="Admission Status"
            data={admissionData}
            colors={['#10b981', '#3b82f6', '#ef4444']}
          />
        </div>
      </div>

      {/* Detailed Lists */}
      <div className="officer-dashboard__sections">
        {/* Pending Documents */}
        <Section 
          title="Pending Document Verification" 
          icon="📄"
          color="#ef4444"
          count={pendingDocs.length}
        >
          {pendingDocs.length === 0 ? (
            <EmptyState message="All documents verified" icon="✅" />
          ) : (
            <div className="officer-dashboard__list">
              {pendingDocs.map(applicant => (
                <ListItem 
                  key={applicant.id}
                  name={applicant.name}
                  status={applicant.documents}
                  statusColor="#ef4444"
                  icon="📄"
                  action="Verify"
                />
              ))}
            </div>
          )}
        </Section>

        {/* Not Allocated */}
        <Section 
          title="Applicants Pending Allocation" 
          icon="🎯"
          color="#f59e0b"
          count={pendingAllocation.length}
        >
          {pendingAllocation.length === 0 ? (
            <EmptyState message="All applicants allocated" icon="🎉" />
          ) : (
            <div className="officer-dashboard__list">
              {pendingAllocation.map(applicant => (
                <ListItem 
                  key={applicant.id}
                  name={applicant.name}
                  status="Not Allocated"
                  statusColor="#f59e0b"
                  icon="👤"
                  action="Allocate"
                />
              ))}
            </div>
          )}
        </Section>

        {/* Fee Pending */}
        <Section 
          title="Fee Pending" 
          icon="💰"
          color="#ef4444"
          count={feePending.length}
        >
          {feePending.length === 0 ? (
            <EmptyState message="All fees cleared" icon="💳" />
          ) : (
            <div className="officer-dashboard__list">
              {feePending.map(admission => {
                const applicant = data.applicants.find(ap => ap.id === admission.applicantId);
                return (
                  <ListItem 
                    key={admission.id}
                    name={applicant?.name || "Unknown"}
                    status="Pending"
                    statusColor="#ef4444"
                    icon="💰"
                    action="Collect Fee"
                  />
                );
              })}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ title, value, total, percentage, color, icon }) {
  return (
    <div className="progress-bar-card">
      <div className="progress-bar-card__header">
        <div className="progress-bar-card__title-wrapper">
          <span className="progress-bar-card__icon">{icon}</span>
          <span className="progress-bar-card__title">{title}</span>
        </div>
        <div className="progress-bar-card__stats">
          <span className="progress-bar-card__value">{value}</span>
          <span className="progress-bar-card__total">/ {total}</span>
        </div>
      </div>
      <div className="progress-bar-card__bar-container">
        <div 
          className="progress-bar-card__bar" 
          style={{ width: `${percentage}%`, background: color }}
        >
          <div className="progress-bar-card__bar-shine"></div>
        </div>
      </div>
      <div className="progress-bar-card__percentage" style={{ color }}>
        {Math.round(percentage)}% Complete
      </div>
    </div>
  );
}

// Horizontal Bar Graph Component
function HorizontalBarGraph({ title, data, colors, total }) {
  const items = Object.entries(data).filter(([_, value]) => value > 0);
  
  return (
    <div className="horizontal-graph">
      <h4 className="horizontal-graph__title">{title}</h4>
      <div className="horizontal-graph__bars">
        {items.map(([key, value], index) => {
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={key} className="horizontal-graph__item">
              <div className="horizontal-graph__item-header">
                <span className="horizontal-graph__item-label">{key}</span>
                <span className="horizontal-graph__item-value">{value} ({Math.round(percentage)}%)</span>
              </div>
              <div className="horizontal-graph__bar-container">
                <div 
                  className="horizontal-graph__bar" 
                  style={{ width: `${percentage}%`, background: colors[index % colors.length] }}
                >
                  <div className="horizontal-graph__bar-shine"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="horizontal-graph__total">
        Total: {total}
      </div>
    </div>
  );
}

// Stacked Bar Graph Component
function StackedBarGraph({ title, data, colors }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const items = Object.entries(data).filter(([_, value]) => value > 0);
  
  return (
    <div className="stacked-graph">
      <h4 className="stacked-graph__title">{title}</h4>
      <div className="stacked-graph__bar-container">
        {items.map(([key, value], index) => {
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return (
            <div 
              key={key}
              className="stacked-graph__segment"
              style={{ width: `${percentage}%`, background: colors[index % colors.length] }}
              title={`${key}: ${value} (${Math.round(percentage)}%)`}
            >
              <div className="stacked-graph__segment-shine"></div>
            </div>
          );
        })}
      </div>
      <div className="stacked-graph__legend">
        {items.map(([key, value], index) => (
          <div key={key} className="stacked-graph__legend-item">
            <div className="stacked-graph__legend-color" style={{ background: colors[index % colors.length] }}></div>
            <span className="stacked-graph__legend-label">{key}</span>
            <span className="stacked-graph__legend-value">{value} ({Math.round((value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
      <div className="stacked-graph__total">
        Total: {total}
      </div>
    </div>
  );
}

// Section Component
function Section({ title, icon, color, count, children }) {
  return (
    <div className="dashboard-section">
      <div className="dashboard-section__header">
        <div className="dashboard-section__title-wrapper">
          <span className="dashboard-section__icon">{icon}</span>
          <h3 className="dashboard-section__title">{title}</h3>
        </div>
        {count > 0 && (
          <span className="dashboard-section__badge" style={{ background: color }}>
            {count} Pending
          </span>
        )}
      </div>
      <div className="dashboard-section__content">
        {children}
      </div>
    </div>
  );
}

// List Item Component
function ListItem({ name, status, statusColor, icon, action }) {
  return (
    <div className="list-item">
      <div className="list-item__info">
        <span className="list-item__icon">{icon}</span>
        <div>
          <div className="list-item__name">{name}</div>
          <div className="list-item__status" style={{ color: statusColor }}>
            {status}
          </div>
        </div>
      </div>
      <button className="list-item__action">
        {action} →
      </button>
    </div>
  );
}

// Empty State Component
function EmptyState({ message, icon }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}