import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LoaderCircle, ShieldCheck } from "lucide-react";

import { subscribeGlobalLoading } from "../../utils/globalLoading";

export default function GlobalPageLoader() {
  const [visible, setVisible] = useState(false);

  const timerRef = useRef(null);
  const visibleRef = useRef(false);

  // ============================================================
  // SUBSCRIBE TO GLOBAL API LOADING
  // ============================================================

  useEffect(() => {
    const unsubscribe = subscribeGlobalLoading((activeRequests) => {
      // ======================================================
      // API REQUESTS IN PROGRESS
      // ======================================================

      if (activeRequests > 0) {
        // Already visible: do not schedule another timer.
        if (visibleRef.current) {
          return;
        }

        // A timer is already running.
        if (timerRef.current !== null) {
          return;
        }

        // Avoid flashing on very fast requests.
        timerRef.current = setTimeout(() => {
          timerRef.current = null;

          visibleRef.current = true;
          setVisible(true);
        }, 400);

        return;
      }

      // ======================================================
      // ALL TRACKED API REQUESTS COMPLETED
      // ======================================================

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      visibleRef.current = false;
      setVisible(false);
    });

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      unsubscribe();
    };
  }, []);

  // ============================================================
  // DO NOT RENDER WHEN INACTIVE
  // ============================================================

  if (!visible) {
    return null;
  }

  // ============================================================
  // GLOBAL LOADING UI
  // ============================================================

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading information"
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-7 text-center shadow-2xl"
        style={{
          width: "280px",
          maxWidth: "calc(100vw - 32px)",
          flexShrink: 0,
        }}
      >
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

        {/* Loading icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <LoaderCircle size={32} className="animate-spin text-emerald-600" />
        </div>

        {/* Heading */}
        <h2 className="mt-4 text-lg font-black text-[#10243A]">
          Please Wait...
        </h2>

        {/* Description */}
        <p className="mt-2 text-xs text-slate-500">
          Fetching information securely
        </p>

        {/* Branding */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <ShieldCheck size={15} className="text-emerald-600" />
          AMIOUT Enterprise
        </div>
      </div>
    </div>,
    document.body,
  );
}
