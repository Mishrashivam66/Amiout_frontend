import { NavLink } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  ScanLine,
  History,
  UserRound,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  {
    label: "QR Verification",
    path: "/security/dashboard",
    icon: ScanLine,
  },
  {
    label: "Gate History",
    path: "/security/history",
    icon: History,
  },
  {
    label: "My Profile",
    path: "/security/profile",
    icon: UserRound,
  },
];

export default function SecuritySidebar({
  isOpen,
  onClose,
  onLogout,
  loggingOut = false,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-slate-800
          bg-slate-950 text-white
          transition-transform duration-300
          lg:sticky lg:top-0 lg:h-screen
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500 p-3 text-slate-950">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-wide">AMIOUT</h1>
              <p className="text-xs text-amber-400">Security Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Security badge */}
        <div className="mx-4 mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={23} className="text-amber-400" />
            <div>
              <p className="text-sm font-bold">Security Dashboard</p>
              <p className="mt-1 text-xs text-slate-400">
                Campus Gate Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 space-y-2 overflow-y-auto px-4">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  rounded-xl px-4 py-3.5
                  text-sm font-semibold transition
                  ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
          >
            <LogOut size={20} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            AMIOUT Enterprise Edition
          </p>
        </div>
      </aside>
    </>
  );
}
