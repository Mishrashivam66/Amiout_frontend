// ==========================================
// IMPORTS
// ==========================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";

import "./index.css";

// ==========================================
// ROOT
// ==========================================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          containerStyle={{
            top: 20,
            right: 20,
          }}
          toastOptions={{
            duration: 10000,

            style: {
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: "16px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: "500",
              boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
            },

            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
