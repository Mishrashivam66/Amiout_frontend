import { Link, useLocation } from "react-router-dom";

import {
  Menu,
  Bell,
  ChevronRight,
  GraduationCap,
  Building2,
  ShieldCheck,
  UserRound,
  Sparkles,
} from "lucide-react";

const pageNames = {
  dashboard: "Dashboard",
  outpasses: "All Outpasses",
  pending: "Pending Approvals",
  approved: "Approved Outpasses",
  rejected: "Rejected Outpasses",
  students: "Department Students",
  "faculty-availability": "Faculty Availability",
  profile: "My Profile",
};

export default function AuthorityNavbar({
  role = "HOD",
  onMenuClick = () => {},
}) {
  const location = useLocation();

  const isHOI = role === "HOI";
  const base = isHOI ? "/hoi" : "/hod";

  const RoleIcon = isHOI ? Building2 : GraduationCap;

  const segment =
    location.pathname.split("/").filter(Boolean)[1] || "dashboard";

  const pageTitle = pageNames[segment] || "Dashboard";

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex min-h-[82px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3.5">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-xl border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff3d6] text-[#aa6c0c] sm:flex">
            <RoleIcon size={24} />
          </div>

          <div className="min-w-0">
            <div className="hidden items-center gap-1.5 text-[11px] font-semibold text-slate-400 sm:flex">
              <span>AMIOUT Enterprise</span>
              <ChevronRight size={12} />
              <span>{role}</span>
            </div>

            <h2 className="truncate text-lg font-black tracking-tight text-[#0b1930] sm:mt-0.5 sm:text-xl">
              {pageTitle}
            </h2>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="hidden flex-col text-right xl:flex">
            <span className="text-xs font-bold text-slate-700">
              {currentDate}
            </span>

            <span className="text-[10px] text-slate-400">
              Indian Standard Time
            </span>
          </div>

          <Link
            to={`${base}/pending`}
            title="Open pending approvals"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <Bell size={19} />
            <span className="sr-only">Pending Approvals</span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700 md:flex">
            <ShieldCheck size={15} />
            Secured
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-2.5 py-2 sm:px-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbd073] to-[#f2a71b] text-[#17233b]">
              <UserRound size={19} />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-black text-slate-900">{role}</p>

              <p className="text-[10px] text-slate-500">
                {isHOI ? "Institute Head" : "Department Head"}
              </p>
            </div>

            <Sparkles size={15} className="hidden text-amber-500 xl:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
