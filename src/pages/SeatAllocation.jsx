import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import "./SeatAllocation.css";

export default function SeatAllocation() {
  const { data, allocateSeat } = useApp();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    applicantId: "",
    programId: "",
    quota: "",
    allotmentNo: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search and sort states
  const [applicantSearch, setApplicantSearch] = useState("");
  const [applicantSort, setApplicantSort] = useState("name");
  const [programSearch, setProgramSearch] = useState("");
  const [programSort, setProgramSort] = useState("name");

  // Get selected items
  const selectedApplicant = data.applicants.find(a => a.id === form.applicantId);
  const selectedProgram = data.programs.find(p => p.id === form.programId);

  // Check if applicant is already allocated
  const isApplicantAllocated = (applicantId) => {
    return data.admissions.some(a => a.applicantId === applicantId);
  };

  // Get eligible applicants (not allocated yet)
  const eligibleApplicants = data.applicants.filter(app => !isApplicantAllocated(app.id));

  // Filter and sort applicants
  const filteredApplicants = useMemo(() => {
    let filtered = [...eligibleApplicants];
    
    // Search filter
    if (applicantSearch) {
      const searchLower = applicantSearch.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchLower) ||
        (app.category && app.category.toLowerCase().includes(searchLower)) ||
        (app.id && app.id.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (applicantSort === "name") return a.name.localeCompare(b.name);
      if (applicantSort === "category") return (a.category || "").localeCompare(b.category || "");
      if (applicantSort === "marks") return (b.marks || 0) - (a.marks || 0);
      return 0;
    });
    
    return filtered;
  }, [eligibleApplicants, applicantSearch, applicantSort]);

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    let filtered = [...data.programs];
    
    // Search filter
    if (programSearch) {
      const searchLower = programSearch.toLowerCase();
      filtered = filtered.filter(program => 
        program.name.toLowerCase().includes(searchLower) ||
        (program.department && program.department.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (programSort === "name") return a.name.localeCompare(b.name);
      if (programSort === "department") return (a.department || "").localeCompare(b.department || "");
      if (programSort === "intake") return b.intake - a.intake;
      if (programSort === "available") {
        const aFilled = data.admissions.filter(ad => ad.programId === a.id).length;
        const bFilled = data.admissions.filter(ad => ad.programId === b.id).length;
        return (a.intake - aFilled) - (b.intake - bFilled);
      }
      return 0;
    });
    
    return filtered;
  }, [data.programs, data.admissions, programSearch, programSort]);

  // Get remaining seats for quota
  const getRemainingSeats = (programId, quotaType) => {
    const program = data.programs.find(p => p.id === programId);
    if (!program) return 0;
    const quota = program.quotas.find(q => q.type === quotaType);
    if (!quota) return 0;
    const filled = data.admissions.filter(a => a.programId === programId && a.quota === quotaType).length;
    return quota.seats - filled;
  };

  const handleNext = () => {
    if (step === 1 && !form.applicantId) {
      setMessage({ type: "error", text: "Please select an applicant" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }
    if (step === 2 && !form.programId) {
      setMessage({ type: "error", text: "Please select a program" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }
    if (step === 3 && !form.quota) {
      setMessage({ type: "error", text: "Please select a quota" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }
    setStep(step + 1);
    setMessage({ type: "", text: "" });
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setMessage({ type: "", text: "" });
  };

  const handleAllocate = async () => {
    const remaining = getRemainingSeats(form.programId, form.quota);
    
    if (remaining <= 0) {
      setMessage({ type: "error", text: "❌ Quota is full! Cannot allocate seat." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    if (form.quota !== "Management" && !form.allotmentNo) {
      setMessage({ type: "error", text: "Please enter allotment number" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    allocateSeat({
      applicantId: form.applicantId,
      programId: form.programId,
      quota: form.quota,
      allotmentNo: form.allotmentNo,
      status: "ALLOCATED",
      feeStatus: "PENDING",
      allocatedAt: new Date().toISOString()
    });

    setMessage({ type: "success", text: "✅ Seat allocated successfully!" });
    
    // Reset form
    setForm({ applicantId: "", programId: "", quota: "", allotmentNo: "" });
    setStep(1);
    setIsSubmitting(false);
    
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const getStepIcon = (stepNum) => {
    switch(stepNum) {
      case 1: return "👤";
      case 2: return "📚";
      case 3: return "🎯";
      default: return "✅";
    }
  };

  const getStepTitle = (stepNum) => {
    switch(stepNum) {
      case 1: return "Select Applicant";
      case 2: return "Choose Program";
      case 3: return "Confirm Allocation";
      default: return "";
    }
  };

  return (
    <div className="sa-seat-allocation">
      <div className="sa-header">
        <div className="sa-title-section">
          <div className="sa-icon">🎯</div>
          <div>
            <h1 className="sa-title">Seat Allocation</h1>
            <p className="sa-subtitle">Allocate seats to eligible applicants</p>
          </div>
        </div>
        <div className="sa-stats">
          <div className="sa-stat">
            <span className="sa-stat-value">{data.admissions.length}</span>
            <span className="sa-stat-label">Allocated</span>
          </div>
          <div className="sa-stat">
            <span className="sa-stat-value">{eligibleApplicants.length}</span>
            <span className="sa-stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {message.text && (
        <div className={`sa-toast sa-toast--${message.type}`}>
          <span className="sa-toast-icon">
            {message.type === "success" ? "✓" : "⚠️"}
          </span>
          <span>{message.text}</span>
          <button 
            className="sa-toast-close"
            onClick={() => setMessage({ type: "", text: "" })}
          >
            ×
          </button>
        </div>
      )}

      {/* Progress Steps */}
      <div className="sa-steps">
        {[1, 2, 3].map((stepNum) => (
          <div 
            key={stepNum} 
            className={`sa-step ${step >= stepNum ? 'sa-step--active' : ''} ${step > stepNum ? 'sa-step--completed' : ''}`}
          >
            <div className="sa-step-circle">
              {step > stepNum ? "✓" : stepNum}
            </div>
            <div className="sa-step-content">
              <div className="sa-step-title">{getStepTitle(stepNum)}</div>
              <div className="sa-step-icon">{getStepIcon(stepNum)}</div>
            </div>
            {stepNum < 3 && <div className="sa-step-"></div>}
          </div>
        ))}
      </div>

      <div className="sa-card">
        {/* Step 1: Select Applicant */}
        {step === 1 && (
          <div className="sa-step-container">
            <div className="sa-step-header">
              <h2 className="sa-step-header-title">Choose Applicant</h2>
              <p className="sa-step-header-desc">Select the applicant who needs seat allocation</p>
            </div>
            
            {/* Search and Sort Bar */}
            <div className="sa-controls-bar">
              <div className="sa-search-box">
                <span className="sa-search-icon">🔍</span>
                <input
                  type="text"
                  className="sa-search-input"
                  placeholder="Search by name, category, or ID..."
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                />
              </div>
              <div className="sa-sort-box">
                <span className="sa-sort-icon">📊</span>
                <select 
                  className="sa-sort-select"
                  value={applicantSort}
                  onChange={(e) => setApplicantSort(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                  <option value="marks">Sort by Marks (High to Low)</option>
                </select>
              </div>
            </div>
            
            <div className="sa-applicant-grid">
              {filteredApplicants.length === 0 ? (
                <div className="sa-empty">
                  <span className="sa-empty-icon">🎉</span>
                  <p className="sa-empty-text">
                    {applicantSearch ? "No matching applicants found" : "All applicants have been allocated!"}
                  </p>
                </div>
              ) : (
                filteredApplicants.map(applicant => (
                  <div
                    key={applicant.id}
                    className={`sa-applicant-card ${form.applicantId === applicant.id ? 'sa-applicant-card--selected' : ''}`}
                    onClick={() => setForm({ ...form, applicantId: applicant.id })}
                  >
                    <div className="sa-applicant-avatar">
                      {applicant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="sa-applicant-info">
                      <div className="sa-applicant-name">{applicant.name}</div>
                      <div className="sa-applicant-details">
                        <span className={`sa-badge sa-badge--${applicant.category?.toLowerCase()}`}>
                          {applicant.category}
                        </span>
                        <span className="sa-applicant-marks">Marks: {applicant.marks || "—"}</span>
                      </div>
                      <div className="sa-applicant-docs">
                        <span className={`sa-doc-status sa-doc-status--${applicant.documents?.toLowerCase()}`}>
                          {applicant.documents === "VERIFIED" ? "✅ Verified" : applicant.documents === "SUBMITTED" ? "📤 Submitted" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>line
          </div>
        )}

        {/* Step 2: Select Program */}
        {step === 2 && selectedApplicant && (
          <div className="sa-step-container">
            <div className="sa-step-header">
              <h2 className="sa-step-header-title">Select Program</h2>
              <p className="sa-step-header-desc">Choose the program for {selectedApplicant.name}</p>
            </div>
            
            {/* Search and Sort Bar */}
            <div className="sa-controls-bar">
              <div className="sa-search-box">
                <span className="sa-search-icon">🔍</span>
                <input
                  type="text"
                  className="sa-search-input"
                  placeholder="Search by program name or department..."
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                />
              </div>
              <div className="sa-sort-box">
                <span className="sa-sort-icon">📊</span>
                <select 
                  className="sa-sort-select"
                  value={programSort}
                  onChange={(e) => setProgramSort(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="department">Sort by Department</option>
                  <option value="intake">Sort by Intake (High to Low)</option>
                  <option value="available">Sort by Available Seats</option>
                </select>
              </div>
            </div>

            <div className="sa-program-grid">
              {filteredPrograms.length === 0 ? (
                <div className="sa-empty">
                  <span className="sa-empty-icon">📖</span>
                  <p className="sa-empty-text">No matching programs found</p>
                </div>
              ) : (
                filteredPrograms.map(program => {
                  const filled = data.admissions.filter(a => a.programId === program.id).length;
                  const remaining = program.intake - filled;
                  const percentage = (filled / program.intake) * 100;
                  
                  return (
                    <div
                      key={program.id}
                      className={`sa-program-card ${form.programId === program.id ? 'sa-program-card--selected' : ''}`}
                      onClick={() => setForm({ ...form, programId: program.id, quota: "" })}
                    >
                      <div className="sa-program-header">
                        <div className="sa-program-icon">📖</div>
                        <div className="sa-program-info">
                          <div className="sa-program-name">{program.name}</div>
                          <div className="sa-program-dept">{program.department}</div>
                        </div>
                      </div>
                      <div className="sa-program-stats">
                        <div className="sa-program-stat">
                          <span className="sa-program-stat-label">Intake</span>
                          <span className="sa-program-stat-value">{program.intake}</span>
                        </div>
                        <div className="sa-program-stat">
                          <span className="sa-program-stat-label">Filled</span>
                          <span className="sa-program-stat-value">{filled}</span>
                        </div>
                        <div className="sa-program-stat">
                          <span className="sa-program-stat-label">Available</span>
                          <span className={`sa-program-stat-value ${remaining === 0 ? 'sa-program-stat-value--warning' : ''}`}>
                            {remaining}
                          </span>
                        </div>
                      </div>
                      <div className="sa-program-progress">
                        <div className="sa-program-progress-bar">
                          <div className="sa-program-progress-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="sa-program-progress-text">{Math.round(percentage)}% filled</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Step 3: Confirm Allocation */}
        {step === 3 && selectedApplicant && selectedProgram && (
          <div className="sa-step-container">
            <div className="sa-step-header">
              <h2 className="sa-step-header-title">Confirm Allocation</h2>
              <p className="sa-step-header-desc">Review and confirm seat allocation</p>
            </div>

            {/* Summary Card */}
            <div className="sa-summary">
              <div className="sa-summary-section">
                <h3 className="sa-summary-title">Applicant Information</h3>
                <div className="sa-summary-grid">
                  <div className="sa-summary-item">
                    <span className="sa-summary-label">Name</span>
                    <span className="sa-summary-value">{selectedApplicant.name}</span>
                  </div>
                  <div className="sa-summary-item">
                    <span className="sa-summary-label">Category</span>
                    <span className={`sa-badge sa-badge--${selectedApplicant.category?.toLowerCase()}`}>
                      {selectedApplicant.category}
                    </span>
                  </div>
                  <div className="sa-summary-item">
                    <span className="sa-summary-label">Marks</span>
                    <span className="sa-summary-value">{selectedApplicant.marks || "—"}</span>
                  </div>
                  <div className="sa-summary-item">
                    <span className="sa-summary-label">Documents</span>
                    <span className={`sa-doc-status sa-doc-status--${selectedApplicant.documents?.toLowerCase()}`}>
                      {selectedApplicant.documents}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sa-summary-section">
                <h3 className="sa-summary-title">Program Information</h3>
                <div className="sa-summary-grid">
                  <div className="sa-summary-item">
                    <span className="sa-summary-label">Program</span>
                    <span className="sa-summary-value">{selectedProgram.name}</span>
                  </div>
                  <div className="sa-summary-item">
                    <span className="sa-summary-label">Department</span>
                    <span className="sa-summary-value">{selectedProgram.department}</span>
                  </div>
                  <div className="sa-summary-item">
                    <span className="sa-summary-label">Intake</span>
                    <span className="sa-summary-value">{selectedProgram.intake}</span>
                  </div>
                </div>
              </div>

              {/* Quota Selection */}
              <div className="sa-summary-section">
                <h3 className="sa-summary-title">Select Quota</h3>
                <div className="sa-quota-options">
                  {selectedProgram.quotas.map(quota => {
                    const remaining = getRemainingSeats(selectedProgram.id, quota.type);
                    const isAvailable = remaining > 0;
                    
                    return (
                      <div
                        key={quota.type}
                        className={`sa-quota-option ${form.quota === quota.type ? 'sa-quota-option--selected' : ''} ${!isAvailable ? 'sa-quota-option--disabled' : ''}`}
                        onClick={() => isAvailable && setForm({ ...form, quota: quota.type })}
                      >
                        <div className="sa-quota-option-header">
                          <span className="sa-quota-option-name">{quota.type}</span>
                          <span className={`sa-quota-option-status ${remaining === 0 ? 'sa-quota-option-status--full' : ''}`}>
                            {remaining === 0 ? "Full" : `${remaining} seats left`}
                          </span>
                        </div>
                        <div className="sa-quota-option-progress">
                          <div className="sa-quota-option-progress-bar">
                            <div 
                              className="sa-quota-option-progress-fill" 
                              style={{ width: `${((quota.seats - remaining) / quota.seats) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Allotment Number */}
              {form.quota && form.quota !== "Management" && (
                <div className="sa-allotment-field">
                  <label className="sa-allotment-label">
                    Allotment Number <span className="sa-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="sa-allotment-input"
                    placeholder="Enter government allotment number"
                    value={form.allotmentNo}
                    onChange={(e) => setForm({ ...form, allotmentNo: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="sa-navigation">
          {step > 1 && (
            <button className="sa-nav-btn sa-nav-btn--prev" onClick={handlePrevious}>
              ← Previous
            </button>
          )}
          
          {step < 3 ? (
            <button className="sa-nav-btn sa-nav-btn--next" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button 
              className="sa-nav-btn sa-nav-btn--submit"
              onClick={handleAllocate}
              disabled={isSubmitting || !form.quota || (form.quota !== "Management" && !form.allotmentNo)}
            >
              {isSubmitting ? (
                <>
                  <span className="sa-spinner"></span>
                  Allocating...
                </>
              ) : (
                <>
                  🎯 Allocate Seat
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Recent Allocations */}
      {data.admissions.length > 0 && (
        <div className="sa-recent">
          <h3 className="sa-recent-title">Recent Allocations</h3>
          <div className="sa-recent-list">
            {data.admissions.slice().reverse().slice(0, 5).map(admission => {
              const applicant = data.applicants.find(a => a.id === admission.applicantId);
              const program = data.programs.find(p => p.id === admission.programId);
              return (
                <div key={admission.id} className="sa-recent-item">
                  <div className="sa-recent-avatar">
                    {applicant?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="sa-recent-info">
                    <div className="sa-recent-name">{applicant?.name}</div>
                    <div className="sa-recent-program">{program?.name}</div>
                  </div>
                  <div className={`sa-recent-quota sa-recent-quota--${admission.quota?.toLowerCase()}`}>
                    {admission.quota}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}