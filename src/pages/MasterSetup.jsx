import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import "./MasterSetup.css";

export default function MasterSetup() {
  const { addProgram } = useApp();

  const [program, setProgram] = useState({
    institution: "",
    campus: "",
    department: "",
    academicYear: "",
    name: "",
    courseType: "",
    entryType: "",
    admissionMode: "",
    intake: "",
    quotas: [
      { type: "KCET", seats: 0, color: "#3b82f6" },
      { type: "COMEDK", seats: 0, color: "#10b981" },
      { type: "Management", seats: 0, color: "#f59e0b" }
    ]
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    const totalQuota = program.quotas.reduce((a, q) => a + q.seats, 0);
    const intakeNum = Number(program.intake);

    if (totalQuota !== intakeNum) {
      setMessage({
        type: "error",
        text: `Total quota (${totalQuota}) must match intake (${intakeNum})!`
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return;
    }

    // Validate required fields
    const requiredFields = ["institution", "campus", "department", "academicYear", "name", "courseType", "entryType", "admissionMode", "intake"];
    const missingFields = requiredFields.filter(field => !program[field]);
    
    if (missingFields.length > 0) {
      setMessage({
        type: "error",
        text: `Please fill all required fields: ${missingFields.join(", ")}`
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    addProgram({
      ...program,
      id: program.name + Date.now(),
      createdAt: new Date().toISOString()
    });

    setMessage({
      type: "success",
      text: "✅ Program created successfully!"
    });

    // Reset form
    setProgram({
      institution: "",
      campus: "",
      department: "",
      academicYear: "",
      name: "",
      courseType: "",
      entryType: "",
      admissionMode: "",
      intake: "",
      quotas: [
        { type: "KCET", seats: 0, color: "#3b82f6" },
        { type: "COMEDK", seats: 0, color: "#10b981" },
        { type: "Management", seats: 0, color: "#f59e0b" }
      ]
    });
    setActiveTab("basic");
    setIsSubmitting(false);

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleQuotaChange = (index, value) => {
    const updated = [...program.quotas];
    updated[index].seats = Math.max(0, Number(value));
    setProgram({ ...program, quotas: updated });
  };

  const totalQuota = program.quotas.reduce((a, q) => a + q.seats, 0);
  const intakeNum = Number(program.intake) || 0;
  const quotaBalance = intakeNum - totalQuota;

  return (
    <div className="master-setup">
      <div className="master-setup__header">
        <div className="master-setup__title-section">
          <div className="master-setup__icon">📚</div>
          <div>
            <h1 className="master-setup__title">Master Setup</h1>
            <p className="master-setup__subtitle">Create and configure academic programs</p>
          </div>
        </div>
        <div className="master-setup__stats">
         
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`master-setup__toast master-setup__toast--${message.type}`}>
          <span className="master-setup__toast-icon">
            {message.type === "success" ? "✓" : "⚠️"}
          </span>
          <span>{message.text}</span>
          <button 
            className="master-setup__toast-close"
            onClick={() => setMessage({ type: "", text: "" })}
          >
            ×
          </button>
        </div>
      )}

      <div className="master-setup__card">
        {/* Tabs */}
        <div className="master-setup__tabs">
          <button
            className={`master-setup__tab ${activeTab === "basic" ? "master-setup__tab--active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            <span className="master-setup__tab-icon">📝</span>
            Basic Information
          </button>
          <button
            className={`master-setup__tab ${activeTab === "quotas" ? "master-setup__tab--active" : ""}`}
            onClick={() => setActiveTab("quotas")}
          >
            <span className="master-setup__tab-icon">📊</span>
            Quota Distribution
          </button>
        </div>

        <form className="master-setup__form" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <div className="master-setup__tab-content">
              <div className="master-setup__grid">
                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Institution <span className="master-setup__required">*</span>
                  </label>
                  <input
                    className="master-setup__input"
                    placeholder="e.g., ABC University"
                    value={program.institution}
                    onChange={(e) => setProgram({ ...program, institution: e.target.value })}
                  />
                </div>

                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Campus <span className="master-setup__required">*</span>
                  </label>
                  <input
                    className="master-setup__input"
                    placeholder="e.g., Main Campus"
                    value={program.campus}
                    onChange={(e) => setProgram({ ...program, campus: e.target.value })}
                  />
                </div>

                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Department <span className="master-setup__required">*</span>
                  </label>
                  <input
                    className="master-setup__input"
                    placeholder="e.g., Computer Science"
                    value={program.department}
                    onChange={(e) => setProgram({ ...program, department: e.target.value })}
                  />
                </div>

                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Academic Year <span className="master-setup__required">*</span>
                  </label>
                  <input
                    className="master-setup__input"
                    placeholder="e.g., 2026-2027"
                    value={program.academicYear}
                    onChange={(e) => setProgram({ ...program, academicYear: e.target.value })}
                  />
                </div>

                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Program Name <span className="master-setup__required">*</span>
                  </label>
                  <input
                    className="master-setup__input"
                    placeholder="e.g., B.Tech Computer Science"
                    value={program.name}
                    onChange={(e) => setProgram({ ...program, name: e.target.value })}
                  />
                </div>

                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Course Type <span className="master-setup__required">*</span>
                  </label>
                  <select
                    className="master-setup__select"
                    value={program.courseType}
                    onChange={(e) => setProgram({ ...program, courseType: e.target.value })}
                  >
                    <option value="">Select Course Type</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Entry Type <span className="master-setup__required">*</span>
                  </label>
                  <select
                    className="master-setup__select"
                    value={program.entryType}
                    onChange={(e) => setProgram({ ...program, entryType: e.target.value })}
                  >
                    <option value="">Select Entry Type</option>
                    <option value="Regular">Regular (1st Year)</option>
                    <option value="Lateral">Lateral (2nd Year)</option>
                  </select>
                </div>

                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Admission Mode <span className="master-setup__required">*</span>
                  </label>
                  <select
                    className="master-setup__select"
                    value={program.admissionMode}
                    onChange={(e) => setProgram({ ...program, admissionMode: e.target.value })}
                  >
                    <option value="">Select Admission Mode</option>
                    <option value="Government">Government Quota</option>
                    <option value="Management">Management Quota</option>
                  </select>
                </div>

                <div className="master-setup__field">
                  <label className="master-setup__label">
                    Total Intake <span className="master-setup__required">*</span>
                  </label>
                  <input
                    type="number"
                    className="master-setup__input"
                    placeholder="Number of seats"
                    value={program.intake}
                    onChange={(e) =>
                      setProgram({ ...program, intake: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quota Distribution Tab */}
          {activeTab === "quotas" && (
            <div className="master-setup__tab-content">
              <div className="master-setup__quota-summary">
                <div className="master-setup__quota-summary-item">
                  <span className="master-setup__quota-summary-label">Total Intake:</span>
                  <span className="master-setup__quota-summary-value">{intakeNum || 0}</span>
                </div>
                <div className="master-setup__quota-summary-item">
                  <span className="master-setup__quota-summary-label">Allocated Seats:</span>
                  <span className="master-setup__quota-summary-value">{totalQuota}</span>
                </div>
                <div className="master-setup__quota-summary-item">
                  <span className="master-setup__quota-summary-label">Remaining:</span>
                  <span className={`master-setup__quota-summary-value ${quotaBalance !== 0 ? 'master-setup__quota-summary-value--warning' : 'master-setup__quota-summary-value--success'}`}>
                    {quotaBalance}
                  </span>
                </div>
              </div>

              <div className="master-setup__quotas">
                {program.quotas.map((q, i) => (
                  <div key={i} className="master-setup__quota-card">
                    <div 
                      className="master-setup__quota-card-header"
                      style={{ background: `${q.color}10`, borderLeftColor: q.color }}
                    >
                      <span className="master-setup__quota-card-icon">
                        {q.type === "KCET" && "🎓"}
                        {q.type === "COMEDK" && "📚"}
                        {q.type === "Management" && "👔"}
                      </span>
                      <span className="master-setup__quota-card-title">{q.type}</span>
                    </div>
                    <div className="master-setup__quota-card-body">
                      <label className="master-setup__quota-label">
                        Number of Seats
                      </label>
                      <input
                        type="number"
                        className="master-setup__quota-input"
                        value={q.seats}
                        onChange={(e) => handleQuotaChange(i, e.target.value)}
                        min="0"
                        max={intakeNum}
                      />
                      <div className="master-setup__quota-progress">
                        <div 
                          className="master-setup__quota-progress-bar"
                          style={{
                            width: `${intakeNum ? (q.seats / intakeNum) * 100 : 0}%`,
                            background: q.color
                          }}
                        />
                      </div>
                      <span className="master-setup__quota-percentage">
                        {intakeNum ? Math.round((q.seats / intakeNum) * 100) : 0}% of total intake
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="master-setup__actions">
            <button
              type="button"
              className="master-setup__btn master-setup__btn--secondary"
              onClick={() => {
                setProgram({
                  institution: "",
                  campus: "",
                  department: "",
                  academicYear: "",
                  name: "",
                  courseType: "",
                  entryType: "",
                  admissionMode: "",
                  intake: "",
                  quotas: [
                    { type: "KCET", seats: 0, color: "#3b82f6" },
                    { type: "COMEDK", seats: 0, color: "#10b981" },
                    { type: "Management", seats: 0, color: "#f59e0b" }
                  ]
                });
              }}
            >
              <span>🔄</span> Reset Form
            </button>
            <button
              type="button"
              className="master-setup__btn master-setup__btn--primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="master-setup__spinner"></span>
                  Creating...
                </>
              ) : (
                <>
                  <span>💾</span> Create Program
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="master-setup__help">
        <div className="master-setup__help-icon">ℹ️</div>
        <div className="master-setup__help-content">
          <h4>Quick Tips</h4>
          <ul>
            <li>Total quota seats must equal the program intake</li>
            <li>You can adjust quota distribution in the next tab</li>
            <li>All fields marked with <span className="master-setup__required">*</span> are required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}