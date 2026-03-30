import React from "react";

export default function Select({
  label,
  value,
  onChange,
  options = []
}) {
  return (
    <div style={{ marginBottom: "12px" }}>
      {label && <label>{label}</label>}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      >
        <option value="">Select</option>

        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}