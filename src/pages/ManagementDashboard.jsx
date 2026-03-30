import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar
} from "recharts";
import "./ManagementDashboard.css";

export default function ManagementDashboard() {
  const { data } = useApp();

  const [selectedProgram, setSelectedProgram] = useState("ALL");
  const [courseType, setCourseType] = useState("ALL");
  const [timeRange, setTimeRange] = useState("all");
  const [chartType, setChartType] = useState("pie");

  // 🔹 Filter programs
  const filteredPrograms = useMemo(() => {
    return data.programs.filter(p => {
      return (
        (selectedProgram === "ALL" || p.id === selectedProgram) &&
        (courseType === "ALL" || p.courseType === courseType)
      );
    });
  }, [data.programs, selectedProgram, courseType]);

  // 🔹 Summary calculations
  const summary = useMemo(() => {
    const totalIntake = filteredPrograms.reduce((a, p) => a + p.intake, 0);
    const totalFilled = data.admissions.filter(a =>
      filteredPrograms.some(p => p.id === a.programId)
    ).length;
    const totalRemaining = totalIntake - totalFilled;
    const fillRate = totalIntake > 0 ? (totalFilled / totalIntake) * 100 : 0;

    const feePending = data.admissions.filter(a => a.feeStatus !== "PAID");
    const feePaid = data.admissions.filter(a => a.feeStatus === "PAID");
    const confirmed = data.admissions.filter(a => a.status === "CONFIRMED");
    const allocated = data.admissions.filter(a => a.status === "ALLOCATED");

    const docVerified = data.applicants.filter(a => a.documents === "VERIFIED");
    const docSubmitted = data.applicants.filter(a => a.documents === "SUBMITTED");
    const docPending = data.applicants.filter(a => a.documents !== "VERIFIED");

    return {
      totalIntake,
      totalFilled,
      totalRemaining,
      fillRate,
      feePending: feePending.length,
      feePaid: feePaid.length,
      confirmed: confirmed.length,
      allocated: allocated.length,
      docVerified: docVerified.length,
      docSubmitted: docSubmitted.length,
      docPending: docPending.length
    };
  }, [data.admissions, data.applicants, filteredPrograms]);

  // 🔹 Program-wise data for table and charts
  const programData = useMemo(() => {
    return filteredPrograms.map(p => {
      const filled = data.admissions.filter(a => a.programId === p.id).length;
      const remaining = p.intake - filled;
      const percentage = p.intake > 0 ? (filled / p.intake) * 100 : 0;
      
      const quotaBreakdown = {
        kcet: data.admissions.filter(a => a.programId === p.id && a.quota === "KCET").length,
        comedk: data.admissions.filter(a => a.programId === p.id && a.quota === "COMEDK").length,
        management: data.admissions.filter(a => a.programId === p.id && a.quota === "Management").length
      };

      return {
        id: p.id,
        name: p.name,
        department: p.department,
        courseType: p.courseType,
        intake: p.intake,
        filled,
        remaining,
        percentage,
        quotaBreakdown,
        status: percentage >= 100 ? "full" : percentage >= 90 ? "critical" : percentage >= 70 ? "warning" : "available"
      };
    });
  }, [data.admissions, filteredPrograms]);

  // 🔹 Quota distribution data
  const quotaData = useMemo(() => {
    const kcet = data.admissions.filter(a => a.quota === "KCET").length;
    const comedk = data.admissions.filter(a => a.quota === "COMEDK").length;
    const management = data.admissions.filter(a => a.quota === "Management").length;
    const total = kcet + comedk + management;

    return [
      { name: "KCET", value: kcet, percentage: total > 0 ? (kcet / total) * 100 : 0, color: "#3b82f6" },
      { name: "COMEDK", value: comedk, percentage: total > 0 ? (comedk / total) * 100 : 0, color: "#10b981" },
      { name: "Management", value: management, percentage: total > 0 ? (management / total) * 100 : 0, color: "#f59e0b" }
    ];
  }, [data.admissions]);

  // 🔹 Course type distribution
  const courseTypeData = useMemo(() => {
    const ug = data.programs.filter(p => p.courseType === "UG").reduce((sum, p) => sum + p.intake, 0);
    const pg = data.programs.filter(p => p.courseType === "PG").reduce((sum, p) => sum + p.intake, 0);
    const ugFilled = data.admissions.filter(a => {
      const program = data.programs.find(p => p.id === a.programId);
      return program?.courseType === "UG";
    }).length;
    const pgFilled = data.admissions.filter(a => {
      const program = data.programs.find(p => p.id === a.programId);
      return program?.courseType === "PG";
    }).length;

    return [
      { name: "UG", intake: ug, filled: ugFilled, remaining: ug - ugFilled, color: "#3b82f6" },
      { name: "PG", intake: pg, filled: pgFilled, remaining: pg - pgFilled, color: "#10b981" }
    ];
  }, [data.programs, data.admissions]);

  // 🔹 Get alert items
  const getAlertItems = () => {
    const feePendingItems = data.admissions
      .filter(a => a.feeStatus !== "PAID")
      .map(a => {
        const applicant = data.applicants.find(x => x.id === a.applicantId);
        const program = data.programs.find(p => p.id === a.programId);
        return { name: applicant?.name, program: program?.name, quota: a.quota };
      });

    const docPendingItems = data.applicants
      .filter(a => a.documents !== "VERIFIED")
      .map(a => ({ name: a.name, category: a.category, docs: a.documents }));

    const criticalPrograms = programData.filter(p => p.status === "critical" || p.status === "full");

    return { feePendingItems, docPendingItems, criticalPrograms };
  };

  const alerts = getAlertItems();

  // 🔹 Export CSV
  const exportCSV = () => {
    let csv = "Program,Department,Course Type,Intake,Filled,Remaining,Fill Rate,Status\n";
    
    programData.forEach(p => {
      csv += `"${p.name}","${p.department}","${p.courseType}",${p.intake},${p.filled},${p.remaining},${p.percentage.toFixed(1)}%,${p.status.toUpperCase()}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admission-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "full": return "🔴";
      case "critical": return "⚠️";
      case "warning": return "🟡";
      default: return "🟢";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "full": return "Full";
      case "critical": return "Almost Full";
      case "warning": return "Filling Fast";
      default: return "Available";
    }
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="md-management-dashboard">
      {/* Header */}
      <div className="md-header">
        <div className="md-header-content">
          <div className="md-header-icon">📊</div>
          <div>
            <h1 className="md-title">Management Dashboard</h1>
            <p className="md-subtitle">Real-time insights and analytics for admission management</p>
          </div>
        </div>
        <button className="md-export-btn" onClick={exportCSV}>
          <span>📥</span>
          Export Report
        </button>
      </div>

      {/* Filters Bar */}
      <div className="md-filters-bar">
        <div className="md-filter-group">
          <div className="md-filter-box">
            <span className="md-filter-icon">🎓</span>
            <select 
              className="md-filter-select"
              value={selectedProgram} 
              onChange={e => setSelectedProgram(e.target.value)}
            >
              <option value="ALL">All Programs</option>
              {data.programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="md-filter-box">
            <span className="md-filter-icon">📚</span>
            <select 
              className="md-filter-select"
              value={courseType} 
              onChange={e => setCourseType(e.target.value)}
            >
              <option value="ALL">All Course Types</option>
              <option value="UG">UG Programs</option>
              <option value="PG">PG Programs</option>
            </select>
          </div>

          <div className="md-filter-box">
            <span className="md-filter-icon">📅</span>
            <select 
              className="md-filter-select"
              value={timeRange} 
              onChange={e => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="md-stats-grid">
        <div className="md-stat-card md-stat-card--intake">
          <div className="md-stat-card-icon">🎯</div>
          <div className="md-stat-card-content">
            <div className="md-stat-card-value">{summary.totalIntake}</div>
            <div className="md-stat-card-label">Total Intake</div>
          </div>
        </div>
        <div className="md-stat-card md-stat-card--filled">
          <div className="md-stat-card-icon">✅</div>
          <div className="md-stat-card-content">
            <div className="md-stat-card-value">{summary.totalFilled}</div>
            <div className="md-stat-card-label">Seats Filled</div>
          </div>
        </div>
        <div className="md-stat-card md-stat-card--remaining">
          <div className="md-stat-card-icon">📊</div>
          <div className="md-stat-card-content">
            <div className="md-stat-card-value">{summary.totalRemaining}</div>
            <div className="md-stat-card-label">Seats Remaining</div>
          </div>
        </div>
        <div className="md-stat-card md-stat-card--fillrate">
          <div className="md-stat-card-icon">📈</div>
          <div className="md-stat-card-content">
            <div className="md-stat-card-value">{summary.fillRate.toFixed(1)}%</div>
            <div className="md-stat-card-label">Fill Rate</div>
          </div>
        </div>
        <div className="md-stat-card md-stat-card--confirmed">
          <div className="md-stat-card-icon">🎓</div>
          <div className="md-stat-card-content">
            <div className="md-stat-card-value">{summary.confirmed}</div>
            <div className="md-stat-card-label">Confirmed</div>
          </div>
        </div>
        <div className="md-stat-card md-stat-card--allocated">
          <div className="md-stat-card-icon">📋</div>
          <div className="md-stat-card-content">
            <div className="md-stat-card-value">{summary.allocated}</div>
            <div className="md-stat-card-label">Allocated</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="md-charts-section">
        <div className="md-charts-header">
          <h3 className="md-section-title">Analytics</h3>
          <div className="md-chart-toggles">
            <button 
              className={`md-chart-toggle ${chartType === 'pie' ? 'md-chart-toggle--active' : ''}`}
              onClick={() => setChartType('pie')}
            >
              Pie Chart
            </button>
            <button 
              className={`md-chart-toggle ${chartType === 'bar' ? 'md-chart-toggle--active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              Bar Chart
            </button>
          </div>
        </div>
        
        <div className="md-charts-grid">
          <div className="md-chart-card">
            <h4 className="md-chart-title">Quota Distribution</h4>
            <div className="md-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={quotaData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                    >
                      {quotaData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart data={quotaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="md-chart-card">
            <h4 className="md-chart-title">Course Type Overview</h4>
            <div className="md-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="intake" name="Total Intake" fill="#94a3b8" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="filled" name="Seats Filled" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Program Status Table */}
      <div className="md-table-section">
        <div className="md-table-header">
          <h3 className="md-section-title">Program Status</h3>
          <div className="md-table-stats">
            <span className="md-table-stat">
              <span className="md-dot md-dot--full"></span>
              Full
            </span>
            <span className="md-table-stat">
              <span className="md-dot md-dot--critical"></span>
              Critical
            </span>
            <span className="md-table-stat">
              <span className="md-dot md-dot--warning"></span>
              Warning
            </span>
            <span className="md-table-stat">
              <span className="md-dot md-dot--available"></span>
              Available
            </span>
          </div>
        </div>

        <div className="md-table-container">
          <table className="md-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Department</th>
                <th>Type</th>
                <th>Intake</th>
                <th>Filled</th>
                <th>Remaining</th>
                <th>Fill Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {programData.map(p => (
                <tr key={p.id} className={`md-table-row md-table-row--${p.status}`}>
                  <td className="md-program-name">{p.name}</td>
                  <td className="md-program-dept">{p.department}</td>
                  <td>
                    <span className={`md-badge md-badge--${p.courseType?.toLowerCase()}`}>
                      {p.courseType}
                    </span>
                  </td>
                  <td className="md-number">{p.intake}</td>
                  <td className="md-number">{p.filled}</td>
                  <td className="md-number">{p.remaining}</td>
                  <td>
                    <div className="md-progress-bar">
                      <div 
                        className="md-progress-fill" 
                        style={{ width: `${p.percentage}%` }}
                      ></div>
                      <span className="md-progress-text">{p.percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`md-status-badge md-status-badge--${p.status}`}>
                      {getStatusIcon(p.status)} {getStatusText(p.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="md-alerts-section">
        <h3 className="md-section-title">
          <span>⚠️</span>
          Alerts & Notifications
        </h3>
        
        <div className="md-alerts-grid">
          <div className="md-alert-card md-alert-card--fee">
            <div className="md-alert-header">
              <div className="md-alert-icon">💰</div>
              <h4 className="md-alert-title">Fee Payment Pending</h4>
              <span className="md-alert-count">{alerts.feePendingItems.length}</span>
            </div>
            <div className="md-alert-content">
              {alerts.feePendingItems.length === 0 ? (
                <p className="md-alert-success">All fees collected ✅</p>
              ) : (
                <ul className="md-alert-list">
                  {alerts.feePendingItems.slice(0, 5).map((item, idx) => (
                    <li key={idx} className="md-alert-item">
                      <span className="md-alert-item-name">{item.name}</span>
                      <span className="md-alert-item-detail">{item.program} ({item.quota})</span>
                    </li>
                  ))}
                  {alerts.feePendingItems.length > 5 && (
                    <li className="md-alert-more">
                      +{alerts.feePendingItems.length - 5} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="md-alert-card md-alert-card--docs">
            <div className="md-alert-header">
              <div className="md-alert-icon">📄</div>
              <h4 className="md-alert-title">Documents Pending</h4>
              <span className="md-alert-count">{alerts.docPendingItems.length}</span>
            </div>
            <div className="md-alert-content">
              {alerts.docPendingItems.length === 0 ? (
                <p className="md-alert-success">All documents verified ✅</p>
              ) : (
                <ul className="md-alert-list">
                  {alerts.docPendingItems.slice(0, 5).map((item, idx) => (
                    <li key={idx} className="md-alert-item">
                      <span className="md-alert-item-name">{item.name}</span>
                      <span className="md-alert-item-detail">{item.category} - {item.docs}</span>
                    </li>
                  ))}
                  {alerts.docPendingItems.length > 5 && (
                    <li className="md-alert-more">
                      +{alerts.docPendingItems.length - 5} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="md-alert-card md-alert-card--programs">
            <div className="md-alert-header">
              <div className="md-alert-icon">🎓</div>
              <h4 className="md-alert-title">Program Alerts</h4>
              <span className="md-alert-count">{alerts.criticalPrograms.length}</span>
            </div>
            <div className="md-alert-content">
              {alerts.criticalPrograms.length === 0 ? (
                <p className="md-alert-success">All programs have available seats ✅</p>
              ) : (
                <ul className="md-alert-list">
                  {alerts.criticalPrograms.slice(0, 5).map((program, idx) => (
                    <li key={idx} className="md-alert-item">
                      <span className="md-alert-item-name">{program.name}</span>
                      <span className="md-alert-item-detail">
                        {program.remaining} seats left ({program.percentage.toFixed(1)}% filled)
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

   
    </div>
  );
}