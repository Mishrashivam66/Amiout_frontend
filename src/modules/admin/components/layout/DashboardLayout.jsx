
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050B14] text-white">
      {/* ========================================================= */}
      {/* Mobile Overlay */}
      {/* ========================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* Sidebar */}
      {/* ========================================================= */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-72
          transform
          bg-[#081018]
          border-r
          border-[#1E293B]
          transition-transform
          duration-300
          ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      {/* ========================================================= */}
      {/* Main Content */}
      {/* ========================================================= */}

      <div className="lg:ml-72 flex min-h-screen flex-col">
        {/* Navbar */}

        <Navbar openSidebar={() => setSidebarOpen(true)} />

        {/* Page Content */}

        <main className="flex-1 bg-[#050B14] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
