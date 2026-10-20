/* ==========================================
   AMIOUT ENTERPRISE - MAIN ENTRY
========================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";

import GlobalNotifications from "./components/common/GlobalNotifications";

import "./index.css";

// ==========================================
// APPLICATION ROOT
// ==========================================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />

        {/* GLOBAL NOTIFICATION SYSTEM */}
        <GlobalNotifications />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
