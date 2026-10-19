import { useLocation } from "react-router-dom";

import { Menu, ShieldCheck } from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

// ==========================================
// SUPER ADMIN PAGE TITLES
// ==========================================

const PAGE_TITLES = {
  "/super-admin/dashboard": "Dashboard",
  "/super-admin/admins": "Admin Management",
  "/super-admin/admins/create": "Create Admin",
  "/super-admin/students": "University Students",
  "/super-admin/outpasses": "Outpass Monitoring",
  "/super-admin/reports": "Outpass Reports",
};

// ==========================================
// SUPER ADMIN NAVBAR
// ==========================================

export default function SuperAdminNavbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || "Super Admin";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b182b]/95 px-4 backdrop-blur-xl sm:px-7">
      <div className="flex min-h-[76px] items-center justify-between gap-4">
        {/* LEFT SIDE */}

        <div className="flex min-w-0 items-center gap-3">
          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-xl border border-white/10 p-2.5 text-slate-200 transition hover:bg-white/5 lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* PAGE INFORMATION */}

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">
              AMIOUT Enterprise
            </p>

            <h2 className="mt-1 truncate text-lg font-black text-white sm:text-xl">
              {pageTitle}
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE - SUPER ADMIN PROFILE */}

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            {/* PROFILE ICON */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
              <ShieldCheck size={20} />
            </div>

            {/* PROFILE DETAILS */}

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-40 truncate text-xs font-bold text-white">
                {user?.name || "Super Admin"}
              </p>

              <p className="mt-0.5 text-[10px] font-semibold text-amber-300">
                SUPER_ADMIN
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
