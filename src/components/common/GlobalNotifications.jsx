/* ==========================================
   AMIOUT ENTERPRISE
   GLOBAL NOTIFICATION SYSTEM
========================================== */

import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// ==========================================
// COMMON TOAST DESIGN
// ==========================================

const toastStyle = {
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "14px 16px",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "1.6",
  boxShadow: "0 12px 36px rgba(15,23,42,0.16)",
  maxWidth: "calc(100vw - 32px)",
  overflowWrap: "anywhere",
};

// ==========================================
// GLOBAL NOTIFICATION COMPONENT
// ==========================================

const GlobalNotifications = () => {
  return (
    <>
      {/* ==================================
          REACT HOT TOAST
      ================================== */}

      <HotToaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        containerStyle={{
          top: 20,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 4000,
          style: toastStyle,

          success: {
            duration: 2000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "4px solid #10b981",
            },
          },

          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },

          loading: {
            duration: Infinity,
          },
        }}
      />

      {/* ==================================
          SONNER
      ================================== */}

      <SonnerToaster
        position="top-center"
        duration={4000}
        visibleToasts={3}
        gap={10}
        richColors
        closeButton
        toastOptions={{
          style: toastStyle,

          classNames: {
            success: "amiout-sonner-success",
            error: "amiout-sonner-error",
            warning: "amiout-sonner-warning",
            info: "amiout-sonner-info",
          },
        }}
      />

      {/* ==================================
          REACT TOASTIFY
      ================================== */}

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
        draggable={false}
        limit={3}
        theme="light"
        style={{
          width: "min(440px, calc(100vw - 32px))",
          zIndex: 99999,
        }}
      />
    </>
  );
};

export default GlobalNotifications;
