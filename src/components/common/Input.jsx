import React from "react";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false
}) {
  return (
    <div style={{ marginBottom: "12px" }}>
      {label && <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>}
      
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "6px"
        }}
      />
    </div>
  );
}