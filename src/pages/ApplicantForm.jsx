import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import "./ApplicantForm.css";

export default function ApplicantForm() {
  const { data, addApplicant } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    category: "",
    entryType: "",
    quotaType: "",
    marks: "",
    exam: "",
    documents: "PENDING"
  });

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterQuota, setFilterQuota] = useState("");
  const [filterDocuments, setFilterDocuments] = useState("");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (showModal) {
      setForm({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        category: "",
        entryType: "",
        quotaType: "",
        marks: "",
        exam: "",
        documents: "PENDING"
      });
    }
  }, [showModal]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.quotaType) {
      showNotification("error", "Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    addApplicant({
      ...form,
      id: Date.now(),
      status: "CREATED",
      createdAt: new Date().toISOString()
    });

    showNotification("success", "✅ Applicant created successfully!");
    setShowModal(false);
    setIsSubmitting(false);
  };

  // Filter and Sort Applicants
  const filteredApplicants = data.applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          applicant.phone?.includes(searchTerm);
    const matchesCategory = !filterCategory || applicant.category === filterCategory;
    const matchesQuota = !filterQuota || applicant.quotaType === filterQuota;
    const matchesDocuments = !filterDocuments || applicant.documents === filterDocuments;
    
    return matchesSearch && matchesCategory && matchesQuota && matchesDocuments;
  });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === "marks") {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    }
    
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getDocumentStatusColor = (status) => {
    switch(status) {
      case "VERIFIED": return "#10b981";
      case "SUBMITTED": return "#f59e0b";
      default: return "#ef4444";
    }
  };

  const getDocumentStatusIcon = (status) => {
    switch(status) {
      case "VERIFIED": return "✅";
      case "SUBMITTED": return "📤";
      default: return "⏳";
    }
  };

  return (
    <div className="applicant-module">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`applicant-module__toast applicant-module__toast--${notification.type}`}>
          <span className="applicant-module__toast-icon">
            {notification.type === "success" ? "✓" : "⚠️"}
          </span>
          <span className="applicant-module__toast-message">{notification.message}</span>
          <button 
            className="applicant-module__toast-close"
            onClick={() => setNotification({ show: false, type: "", message: "" })}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="applicant-module__header">
        <div className="applicant-module__title-section">
          <div className="applicant-module__icon">👥</div>
          <div>
            <h1 className="applicant-module__title">Applicant Management</h1>
            <p className="applicant-module__subtitle">Manage and track all applicant records</p>
          </div>
        </div>
        <button 
          className="applicant-module__add-btn"
          onClick={() => setShowModal(true)}
        >
          <span className="applicant-module__add-btn-icon">+</span>
          Add New Applicant
        </button>
      </div>

      {/* Stats Cards */}
      <div className="applicant-module__stats">
        <div className="applicant-module__stat-card">
          <div className="applicant-module__stat-icon">📊</div>
          <div className="applicant-module__stat-info">
            <div className="applicant-module__stat-value">{data.applicants.length}</div>
            <div className="applicant-module__stat-label">Total Applicants</div>
          </div>
        </div>
        <div className="applicant-module__stat-card">
          <div className="applicant-module__stat-icon">✅</div>
          <div className="applicant-module__stat-info">
            <div className="applicant-module__stat-value">
              {data.applicants.filter(a => a.documents === "VERIFIED").length}
            </div>
            <div className="applicant-module__stat-label">Verified</div>
          </div>
        </div>
        <div className="applicant-module__stat-card">
          <div className="applicant-module__stat-icon">⏳</div>
          <div className="applicant-module__stat-info">
            <div className="applicant-module__stat-value">
              {data.applicants.filter(a => a.documents === "PENDING").length}
            </div>
            <div className="applicant-module__stat-label">Pending</div>
          </div>
        </div>
        <div className="applicant-module__stat-card">
          <div className="applicant-module__stat-icon">🎯</div>
          <div className="applicant-module__stat-info">
            <div className="applicant-module__stat-value">
              {data.applicants.filter(a => a.quotaType === "Management").length}
            </div>
            <div className="applicant-module__stat-label">Management Quota</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="applicant-module__filters">
        <div className="applicant-module__search">
          <span className="applicant-module__search-icon">🔍</span>
          <input
            type="text"
            className="applicant-module__search-input"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="applicant-module__filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="GM">GM</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
        </select>

        <select 
          className="applicant-module__filter-select"
          value={filterQuota}
          onChange={(e) => setFilterQuota(e.target.value)}
        >
          <option value="">All Quotas</option>
          <option value="KCET">KCET</option>
          <option value="COMEDK">COMEDK</option>
          <option value="Management">Management</option>
        </select>

        <select 
          className="applicant-module__filter-select"
          value={filterDocuments}
          onChange={(e) => setFilterDocuments(e.target.value)}
        >
          <option value="">All Documents</option>
          <option value="PENDING">Pending</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="VERIFIED">Verified</option>
        </select>

        <button 
          className="applicant-module__clear-filters"
          onClick={() => {
            setSearchTerm("");
            setFilterCategory("");
            setFilterQuota("");
            setFilterDocuments("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Applicants Table */}
      <div className="applicant-module__table-container">
        {sortedApplicants.length === 0 ? (
          <div className="applicant-module__empty-state">
            <span className="applicant-module__empty-icon">📭</span>
            <p className="applicant-module__empty-text">No applicants found</p>
            <button 
              className="applicant-module__empty-btn"
              onClick={() => setShowModal(true)}
            >
              Add your first applicant
            </button>
          </div>
        ) : (
          <table className="applicant-module__table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} className="applicant-module__sortable">
                  Name
                  {sortBy === "name" && (
                    <span className="applicant-module__sort-icon">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th>Email</th>
                <th>Phone</th>
                <th onClick={() => handleSort("category")} className="applicant-module__sortable">
                  Category
                  {sortBy === "category" && (
                    <span className="applicant-module__sort-icon">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort("quotaType")} className="applicant-module__sortable">
                  Quota
                  {sortBy === "quotaType" && (
                    <span className="applicant-module__sort-icon">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort("marks")} className="applicant-module__sortable">
                  Marks
                  {sortBy === "marks" && (
                    <span className="applicant-module__sort-icon">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th>Documents</th>
              </tr>
            </thead>
            <tbody>
              {sortedApplicants.map(applicant => (
                <tr key={applicant.id} className="applicant-module__table-row">
                  <td className="applicant-module__table-cell applicant-module__table-cell--name">
                    <div className="applicant-module__applicant-info">
                      <div className="applicant-module__applicant-avatar">
                        {applicant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="applicant-module__applicant-name">{applicant.name}</div>
                        <div className="applicant-module__applicant-dob">
                          {applicant.dob ? new Date(applicant.dob).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="applicant-module__table-cell">{applicant.email || "—"}</td>
                  <td className="applicant-module__table-cell">{applicant.phone || "—"}</td>
                  <td className="applicant-module__table-cell">
                    <span className={`applicant-module__badge applicant-module__badge--${applicant.category?.toLowerCase()}`}>
                      {applicant.category}
                    </span>
                  </td>
                  <td className="applicant-module__table-cell">
                    <span className="applicant-module__quota-badge">
                      {applicant.quotaType}
                    </span>
                  </td>
                  <td className="applicant-module__table-cell">
                    <span className="applicant-module__marks">
                      {applicant.marks || "—"}
                    </span>
                  </td>
                  <td className="applicant-module__table-cell">
                    <span 
                      className="applicant-module__status-badge"
                      style={{ background: `${getDocumentStatusColor(applicant.documents)}10`, color: getDocumentStatusColor(applicant.documents) }}
                    >
                      {getDocumentStatusIcon(applicant.documents)} {applicant.documents}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Adding Applicant */}
      {showModal && (
        <div className="applicant-modal" onClick={() => setShowModal(false)}>
          <div className="applicant-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="applicant-modal__header">
              <div className="applicant-modal__header-left">
                <div className="applicant-modal__icon">👤</div>
                <div>
                  <h2 className="applicant-modal__title">Add New Applicant</h2>
                  <p className="applicant-modal__subtitle">Enter applicant details below</p>
                </div>
              </div>
              <button 
                className="applicant-modal__close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="applicant-modal__body">
              <div className="applicant-modal__form-grid">
                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">
                    Full Name <span className="applicant-modal__required">*</span>
                  </label>
                  <input
                    type="text"
                    className="applicant-modal__input"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">Email</label>
                  <input
                    type="email"
                    className="applicant-modal__input"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">Phone</label>
                  <input
                    type="tel"
                    className="applicant-modal__input"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">Date of Birth</label>
                  <input
                    type="date"
                    className="applicant-modal__input"
                    value={form.dob}
                    onChange={e => setForm({ ...form, dob: e.target.value })}
                  />
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">Gender</label>
                  <select
                    className="applicant-modal__select"
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">
                    Category <span className="applicant-modal__required">*</span>
                  </label>
                  <select
                    className="applicant-modal__select"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="GM">GM (General Merit)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                  </select>
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">Entry Type</label>
                  <select
                    className="applicant-modal__select"
                    value={form.entryType}
                    onChange={e => setForm({ ...form, entryType: e.target.value })}
                  >
                    <option value="">Select Entry Type</option>
                    <option value="Regular">Regular (1st Year)</option>
                    <option value="Lateral">Lateral (2nd Year)</option>
                  </select>
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">
                    Quota Type <span className="applicant-modal__required">*</span>
                  </label>
                  <select
                    className="applicant-modal__select"
                    value={form.quotaType}
                    onChange={e => setForm({ ...form, quotaType: e.target.value })}
                  >
                    <option value="">Select Quota</option>
                    <option value="KCET">KCET</option>
                    <option value="COMEDK">COMEDK</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">Marks</label>
                  <input
                    type="number"
                    className="applicant-modal__input"
                    placeholder="Enter marks"
                    value={form.marks}
                    onChange={e => setForm({ ...form, marks: e.target.value })}
                  />
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">Exam</label>
                  <input
                    type="text"
                    className="applicant-modal__input"
                    placeholder="Enter exam name"
                    value={form.exam}
                    onChange={e => setForm({ ...form, exam: e.target.value })}
                  />
                </div>

                <div className="applicant-modal__field">
                  <label className="applicant-modal__label">Document Status</label>
                  <select
                    className="applicant-modal__select"
                    value={form.documents}
                    onChange={e => setForm({ ...form, documents: e.target.value })}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="VERIFIED">Verified</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="applicant-modal__footer">
              <button 
                className="applicant-modal__btn applicant-modal__btn--secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="applicant-modal__btn applicant-modal__btn--primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="applicant-modal__spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Applicant
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}