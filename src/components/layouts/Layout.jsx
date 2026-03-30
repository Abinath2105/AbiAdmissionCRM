import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" , overflow:"hidden"}}>
     
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header />

        <div style={{ padding: "20px" }}>
          {children}
        </div>
      </div>

    </div>
  );
}