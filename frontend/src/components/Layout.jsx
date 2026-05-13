import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="p-4 w-100 bg-light" style={{ minHeight: "100vh" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;