import React from "react";

export default function Badge({ text, type = "default" }) {
  const colors = {
    default: "#64748b",
    success: "#16a34a",
    warning: "#f59e0b",
    danger: "#dc2626"
  };

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        color: "#fff",
        backgroundColor: colors[type] || colors.default
      }}
    >
      {text}
    </span>
  );
}