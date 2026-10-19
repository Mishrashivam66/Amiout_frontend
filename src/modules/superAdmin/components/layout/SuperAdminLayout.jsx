import { useState } from "react";
import { Outlet } from "react-router-dom";

import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminNavbar from "./SuperAdminNavbar";

// ============================================================
// RESPONSIVE NAVY / GOLD SUPER ADMIN LAYOUT
//
// Uses nested routes via <Outlet />.
// ============================================================

export default function SuperAdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <SuperAdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <SuperAdminNavbar onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-7 sm:py-8">
          <Outlet />
        </main>

        <footer className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-500 lg:text-left">
          AMIOUT Enterprise · Amity University Madhya Pradesh
        </footer>
      </div>
    </div>
  );
}
