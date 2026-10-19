import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  GraduationCap,
  Building2,
  Users,
  UserRound,
  UserRoundCheck,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  X,
  LockKeyhole,
} from "lucide-react";

const commonNavigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    suffix: "dashboard",
  },
  {
    label: "All Outpasses",
    icon: ClipboardList,
    suffix: "outpasses",
  },
  {
    label: "Pending Approvals",
    icon: Clock3,
    suffix: "pending",
  },
  {
    label: "Approved Outpasses",
    icon: CheckCircle2,
    suffix: "approved",
  },
  {
    label: "Rejected Outpasses",
    icon: XCircle,
    suffix: "rejected",
  },
];

const hodNavigation = [
  {
    label: "Department Students",
    icon: Users,
    suffix: "students",
  },
  {
    label: "Faculty Availability",
    icon: UserRoundCheck,
    suffix: "faculty-availability",
  },
  {
    label: "My Profile",
    icon: UserRound,
    suffix: "profile",
  },
];

export default function AuthoritySidebar({
  role = "HOD",
  isOpen = false,
  collapsed = false,
  onClose = () => {},
  onToggleCollapse = () => {},
  onLogout = () => {},
  loggingOut = false,
}) {
  const isHOI = role === "HOI";

  const base = isHOI ? "/hoi" : "/hod";
  const RoleIcon = isHOI ? Building2 : GraduationCap;

  const navigation = isHOI
    ? commonNavigation
    : [...commonNavigation, ...hodNavigation];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#020b18]/75 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh shrink-0 flex-col
          overflow-hidden
          border-r border-white/10
          bg-[#081629] text-white
          shadow-[12px_0_42px_rgba(2,12,28,0.16)]
          transition-[transform,width] duration-300
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${collapsed ? "w-[280px] lg:w-[88px]" : "w-[280px]"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* BRAND */}
        <div className="flex h-[92px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffd373] to-[#f59e0b] text-[#081629] shadow-lg shadow-amber-500/15">
              <ShieldCheck size={26} strokeWidth={2.4} />
            </div>

            <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
              <h1 className="text-[23px] font-black tracking-tight">AMIOUT</h1>

              <p className="text-[11px] font-bold tracking-wide text-[#f8c65b]">
                ENTERPRISE EDITION
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* ROLE CARD */}
        <div className="shrink-0 px-4 pt-5">
          <div
            className={`flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-400/10 to-white/[0.03] ${
              collapsed ? "p-3 lg:justify-center" : "p-4"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
              <RoleIcon size={24} />
            </div>

            <div className={collapsed ? "lg:hidden" : ""}>
              <p className="text-sm font-extrabold">{role} Portal</p>

              <p className="mt-1 text-[11px] text-slate-400">
                {isHOI ? "Institute Authority" : "Department Authority"}
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-3">
          <p
            className={`mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            Workspace
          </p>

          <nav aria-label={`${role} navigation`} className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.suffix}
                  to={`${base}/${item.suffix}`}
                  end
                  onClick={onClose}
                  title={item.label}
                  className={({ isActive }) => `
                    group relative flex min-h-11
                    items-center gap-3 rounded-xl
                    px-3.5 py-2.5 text-[13px]
                    font-semibold transition-all
                    duration-200
                    ${collapsed ? "lg:justify-center" : ""}
                    ${
                      isActive
                        ? "bg-[#f7b83c] text-[#081629] shadow-[0_7px_20px_rgba(247,184,60,0.18)]"
                        : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.5 : 1.9}
                        className="shrink-0"
                      />

                      <span
                        className={`flex-1 whitespace-nowrap ${
                          collapsed ? "lg:hidden" : ""
                        }`}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <ChevronRight
                          size={16}
                          className={collapsed ? "lg:hidden" : ""}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* SECURITY & LOGOUT */}
        <div className="shrink-0 space-y-3 border-t border-white/10 px-3 py-4">
          <div
            className={`flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <LockKeyhole size={19} className="shrink-0 text-emerald-400" />

            <div className={collapsed ? "lg:hidden" : ""}>
              <p className="text-xs font-bold text-white">
                Secure Faculty Workspace
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Academic scope enforced by server
              </p>
            </div>
          </div>

          <button
            type="button"
            title="Logout"
            disabled={loggingOut}
            onClick={onLogout}
            className={`flex w-full items-center gap-3 rounded-xl border border-rose-400/15 bg-rose-500/10 px-3.5 py-3 text-sm font-bold text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-500/20 disabled:opacity-50 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <LogOut size={19} className="shrink-0" />

            <span className={collapsed ? "lg:hidden" : ""}>
              {loggingOut ? "Signing out..." : "Logout"}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-slate-400 hover:bg-white/[0.06] hover:text-white lg:flex"
          >
            {collapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <>
                <PanelLeftClose size={19} />
                Collapse Sidebar
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
