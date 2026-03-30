import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import "./AdmissionConfirmation.css";

export default function AdmissionConfirmation() {
  const { data, confirmAdmission, updateFeeStatus } = useApp();

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // 🔹 Filters and sorting
  const filteredAdmissions = useMemo(() => {
    let filtered = data.admissions.filter(adm => {
      const applicant = data.applicants.find(a => a.id === adm.applicantId);
      const program = data.programs.find(p => p.id === adm.programId);

      const matchSearch = 
        applicant?.name.toLowerCase().includes(search.toLowerCase()) ||
        program?.name.toLowerCase().includes(search.toLowerCase()) ||
        adm.admissionNumber?.toLowerCase().includes(search.toLowerCase());

      if (filter === "CONFIRMED") return adm.status === "CONFIRMED" && matchSearch;
      if (filter === "PENDING") return adm.feeStatus !== "PAID" && matchSearch;
      if (filter === "UNCONFIRMED") return adm.status !== "CONFIRMED" && matchSearch;

      return matchSearch;
    });

    // Sorting
    filtered.sort((a, b) => {
      const applicantA = data.applicants.find(app => app.id === a.applicantId);
      const applicantB = data.applicants.find(app => app.id === b.applicantId);
      const programA = data.programs.find(p => p.id === a.programId);
      const programB = data.programs.find(p => p.id === b.programId);

      switch(sortBy) {
        case "name":
          return applicantA?.name.localeCompare(applicantB?.name);
        case "date":
          return new Date(b.allocatedAt) - new Date(a.allocatedAt);
        case "program":
          return programA?.name.localeCompare(programB?.name);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data.admissions, data.applicants, data.programs, search, filter, sortBy]);

  // 🔹 Stats
  const stats = useMemo(() => {
    const total = data.admissions.length;
    const confirmed = data.admissions.filter(a => a.status === "CONFIRMED").length;
    const feePaid = data.admissions.filter(a => a.feeStatus === "PAID").length;
    const feePending = data.admissions.filter(a => a.feeStatus !== "PAID").length;
    const unconfirmed = data.admissions.filter(a => a.status !== "CONFIRMED").length;
    
    return { total, confirmed, feePaid, feePending, unconfirmed };
  }, [data.admissions]);

  const handleConfirm = async (adm) => {
    if (adm.feeStatus !== "PAID") {
      setPendingAction({ type: "fee", admission: adm });
      return;
    }
    if (adm.admissionNumber) return;

    setPendingAction({ type: "confirm", admission: adm });
    setShowConfirmModal(true);
  };

  const handleFeePayment = (admId) => {
    updateFeeStatus(admId, "PAID");
    setPendingAction(null);
  };

  const executeConfirm = () => {
    if (pendingAction?.admission) {
      confirmAdmission(pendingAction.admission.id);
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "CONFIRMED": return "✓";
      case "ALLOCATED": return "🎯";
      default: return "⏳";
    }
  };

  const getFeeStatusIcon = (status) => {
    return status === "PAID" ? "💰" : "💳";
  };

  return (
    <div className="ac-admission-confirmation">
      {/* Header Section */}
      <div className="ac-header">
        <div className="ac-header-content">
          <div className="ac-header-icon">🎓</div>
          <div>
            <h1 className="ac-title">Admission Confirmation</h1>
            <p className="ac-subtitle">Manage and confirm student admissions</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ac-stats-grid">
        <div className="ac-stat-card ac-stat-card--total">
          <div className="ac-stat-card-icon">📊</div>
          <div className="ac-stat-card-content">
            <div className="ac-stat-card-value">{stats.total}</div>
            <div className="ac-stat-card-label">Total Admissions</div>
          </div>
        </div>
        <div className="ac-stat-card ac-stat-card--confirmed">
          <div className="ac-stat-card-icon">✓</div>
          <div className="ac-stat-card-content">
            <div className="ac-stat-card-value">{stats.confirmed}</div>
            <div className="ac-stat-card-label">Confirmed</div>
          </div>
        </div>
        <div className="ac-stat-card ac-stat-card--fee-paid">
          <div className="ac-stat-card-icon">💰</div>
          <div className="ac-stat-card-content">
            <div className="ac-stat-card-value">{stats.feePaid}</div>
            <div className="ac-stat-card-label">Fee Paid</div>
          </div>
        </div>
        <div className="ac-stat-card ac-stat-card--fee-pending">
          <div className="ac-stat-card-icon">⏳</div>
          <div className="ac-stat-card-content">
            <div className="ac-stat-card-value">{stats.feePending}</div>
            <div className="ac-stat-card-label">Fee Pending</div>
          </div>
        </div>
        <div className="ac-stat-card ac-stat-card--unconfirmed">
          <div className="ac-stat-card-icon">⚠️</div>
          <div className="ac-stat-card-content">
            <div className="ac-stat-card-value">{stats.unconfirmed}</div>
            <div className="ac-stat-card-label">Unconfirmed</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="ac-controls-bar">
        <div className="ac-search-box">
          <span className="ac-search-icon">🔍</span>
          <input
            type="text"
            className="ac-search-input"
            placeholder="Search by name, program, or admission number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="ac-clear-search" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <div className="ac-filter-group">
          <div className="ac-filter-box">
            <span className="ac-filter-icon">🏷️</span>
            <select 
              className="ac-filter-select"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Admissions</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="UNCONFIRMED">Unconfirmed</option>
              <option value="PENDING">Fee Pending</option>
            </select>
          </div>

          <div className="ac-sort-box">
            <span className="ac-sort-icon">📊</span>
            <select 
              className="ac-sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date (Newest)</option>
              <option value="name">Sort by Name</option>
              <option value="program">Sort by Program</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admissions List */}
      <div className="ac-list-container">
        {filteredAdmissions.length === 0 ? (
          <div className="ac-empty-state">
            <div className="ac-empty-icon">📭</div>
            <h3 className="ac-empty-title">No admissions found</h3>
            <p className="ac-empty-text">
              {search ? "Try adjusting your search criteria" : "No admissions have been allocated yet"}
            </p>
          </div>
        ) : (
          <div className="ac-list">
            {filteredAdmissions.map(adm => {
              const applicant = data.applicants.find(a => a.id === adm.applicantId);
              const program = data.programs.find(p => p.id === adm.programId);
              const isConfirmed = adm.status === "CONFIRMED";
              const isFeePaid = adm.feeStatus === "PAID";
              
              return (
                <div 
                  key={adm.id} 
                  className={`ac-admission-card ${isConfirmed ? 'ac-admission-card--confirmed' : ''} ${!isFeePaid ? 'ac-admission-card--fee-pending' : ''}`}
                  onClick={() => setSelectedAdmission(selectedAdmission === adm.id ? null : adm.id)}
                >
                  <div className="ac-card-header">
                    <div className="ac-card-avatar">
                      {applicant?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="ac-card-info">
                      <div className="ac-card-name">{applicant?.name}</div>
                      <div className="ac-card-details">
                        <span className="ac-card-program">{program?.name}</span>
                        <span className="ac-card-quota ac-card-quota--${adm.quota?.toLowerCase()}">
                          {adm.quota}
                        </span>
                      </div>
                    </div>
                    <div className="ac-card-badges">
                      <div className={`ac-status-badge ac-status-badge--${adm.status?.toLowerCase()}`}>
                        <span className="ac-status-icon">{getStatusIcon(adm.status)}</span>
                        <span>{adm.status}</span>
                      </div>
                      <div className={`ac-fee-badge ac-fee-badge--${adm.feeStatus?.toLowerCase()}`}>
                        <span className="ac-fee-icon">{getFeeStatusIcon(adm.feeStatus)}</span>
                        <span>{adm.feeStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedAdmission === adm.id && (
                    <div className="ac-card-expanded">
                      <div className="ac-expanded-grid">
                        <div className="ac-expanded-item">
                          <span className="ac-expanded-label">Admission Number</span>
                          <span className="ac-expanded-value">
                            {adm.admissionNumber || "Not assigned yet"}
                          </span>
                        </div>
                        <div className="ac-expanded-item">
                          <span className="ac-expanded-label">Allotment Number</span>
                          <span className="ac-expanded-value">{adm.allotmentNo || "—"}</span>
                        </div>
                        <div className="ac-expanded-item">
                          <span className="ac-expanded-label">Allocated Date</span>
                          <span className="ac-expanded-value">
                            {new Date(adm.allocatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="ac-expanded-item">
                          <span className="ac-expanded-label">Category</span>
                          <span className="ac-expanded-value">{applicant?.category || "—"}</span>
                        </div>
                        <div className="ac-expanded-item">
                          <span className="ac-expanded-label">Marks</span>
                          <span className="ac-expanded-value">{applicant?.marks || "—"}</span>
                        </div>
                        <div className="ac-expanded-item">
                          <span className="ac-expanded-label">Documents</span>
                          <span className={`ac-doc-status ac-doc-status--${applicant?.documents?.toLowerCase()}`}>
                            {applicant?.documents}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="ac-card-actions">
                        {!isFeePaid && (
                          <button 
                            className="ac-btn ac-btn--fee"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeePayment(adm.id);
                            }}
                          >
                            <span>💰</span>
                            Mark Fee Paid
                          </button>
                        )}

                        {!isConfirmed && (
                          <button 
                            className="ac-btn ac-btn--confirm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirm(adm);
                            }}
                            disabled={!isFeePaid}
                          >
                            <span>✓</span>
                            Confirm Admission
                          </button>
                        )}

                        {isConfirmed && adm.admissionNumber && (
                          <div className="ac-admission-number-badge">
                            📋 Admission No: {adm.admissionNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Collapsed Info */}
                  {selectedAdmission !== adm.id && (
                    <div className="ac-card-footer">
                      <div className="ac-footer-info">
                        {adm.admissionNumber && (
                          <span className="ac-admission-number">📋 {adm.admissionNumber}</span>
                        )}
                        {!isFeePaid && (
                          <span className="ac-pending-warning">⚠️ Fee pending</span>
                        )}
                        {!isConfirmed && isFeePaid && (
                          <span className="ac-ready-status">✅ Ready for confirmation</span>
                        )}
                      </div>
                      <div className="ac-expand-hint">
                        Click to {selectedAdmission === adm.id ? "collapse" : "expand"} details
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="ac-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ac-modal-header">
              <div className="ac-modal-icon">🎓</div>
              <h3 className="ac-modal-title">Confirm Admission</h3>
              <button className="ac-modal-close" onClick={() => setShowConfirmModal(false)}>✕</button>
            </div>
            <div className="ac-modal-body">
              <p>Are you sure you want to confirm admission for:</p>
              <div className="ac-modal-details">
                <strong>{data.applicants.find(a => a.id === pendingAction?.admission?.applicantId)?.name}</strong>
                <span>{data.programs.find(p => p.id === pendingAction?.admission?.programId)?.name}</span>
              </div>
              <p className="ac-modal-warning">This action will generate an admission number and cannot be undone.</p>
            </div>
            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn--cancel" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className="ac-btn ac-btn--confirm-action" onClick={executeConfirm}>
                Confirm Admission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fee Payment Alert Modal */}
      {pendingAction?.type === "fee" && (
        <div className="ac-modal-overlay" onClick={() => setPendingAction(null)}>
          <div className="ac-modal ac-modal--warning" onClick={(e) => e.stopPropagation()}>
            <div className="ac-modal-header">
              <div className="ac-modal-icon">⚠️</div>
              <h3 className="ac-modal-title">Fee Payment Required</h3>
              <button className="ac-modal-close" onClick={() => setPendingAction(null)}>✕</button>
            </div>
            <div className="ac-modal-body">
              <p>Please mark the fee as paid before confirming admission.</p>
              <div className="ac-modal-details">
                <strong>{data.applicants.find(a => a.id === pendingAction?.admission?.applicantId)?.name}</strong>
                <span>Fee Status: {pendingAction?.admission?.feeStatus}</span>
              </div>
            </div>
            <div className="ac-modal-footer">
              <button 
                className="ac-btn ac-btn--fee" 
                onClick={() => {
                  handleFeePayment(pendingAction.admission.id);
                  setPendingAction(null);
                }}
              >
                Mark Fee Paid Now
              </button>
              <button className="ac-btn ac-btn--cancel" onClick={() => setPendingAction(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}