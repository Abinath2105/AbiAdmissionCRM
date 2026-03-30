import React from "react";

export default function Table({ columns = [], data = [] }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px"
      }}
    >
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th
              key={i}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                background: "#f8fafc",
                textAlign: "left"
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center", padding: "10px" }}>
              No Data
            </td>
          </tr>
        )}

        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j} style={{ border: "1px solid #ddd", padding: "10px" }}>
                {col.render ? col.render(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}