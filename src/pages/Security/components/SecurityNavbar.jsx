import { useLocation } from "react-router-dom";
import { Menu, ShieldCheck, UserRound, Clock3 } from "lucide-react";

const pageTitles = {
  "/security/dashboard": "QR Verification",
  "/security/history": "Gate History",
  "/security/profile": "Security Profile",
};

export default function SecurityNavbar({ onMenuClick }) {
  const location = useLocation();

  const title = pageTitles[location.pathname] || "Security Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl">
      <div className="flex min-h-18 items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open security menu"
            className="rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-white lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden rounded-xl bg-amber-500/10 p-3 text-amber-400 sm:block">
            <ShieldCheck size={23} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold text-white sm:text-xl">
              {title}
            </h2>

            <p className="mt-1 hidden text-xs text-slate-400 sm:block">
              AMIOUT Smart Campus Security
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 md:flex">
            <Clock3 size={16} className="text-amber-400" />
            IST Gate Operations
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 p-2.5">
            <UserRound size={20} className="text-amber-400" />
            <span className="hidden text-sm font-semibold text-white sm:inline">
              Security Officer
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
