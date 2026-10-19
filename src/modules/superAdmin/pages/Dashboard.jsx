import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShieldPlus,
  UserRoundPlus,
  UsersRound,
  UserX,
} from "lucide-react";

import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import superAdminService from "../services/superAdmin.service";

// ============================================================
// AMIOUT SUPER ADMIN DASHBOARD
//
// Real data:
// GET /super-admin/admins
//
// No fabricated university-wide statistics.
// ============================================================

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load Admin statistics.";

function StatCard({ title, value, icon: Icon, color, note }) {
  const variants = {
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    emerald: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    rose: "text-rose-300 bg-rose-400/10 border-rose-400/20",
    blue: "text-blue-300 bg-blue-400/10 border-blue-400/20",
  };

  return (
    <div className="rounded-2xl border border-[#26384e] bg-[#112138] p-5 shadow-lg sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-400">{title}</p>

        <div
          className={`rounded-xl border p-3 ${
            variants[color] || variants.amber
          }`}
        >
          <Icon size={23} />
        </div>
      </div>

      <h3 className="mt-4 text-4xl font-black text-white">{value}</h3>

      <p className="mt-3 text-xs text-slate-400">{note}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAdmins = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const result = await superAdminService.getAdmins();

      if (!Array.isArray(result?.admins)) {
        throw new Error("Invalid Admin list response.");
      }

      setAdmins(result.admins);

      if (silent) {
        toast.success("Dashboard refreshed", {
          duration: 1000,
        });
      }
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchAdmins();
  }, [fetchAdmins]);

  const total = admins.length;
  const active = admins.filter((admin) => admin.isActive === true).length;
  const inactive = total - active;
  const firstLoginPending = admins.filter(
    (admin) => admin.mustChangePassword === true,
  ).length;

  return (
    <div className="space-y-7">
      {/* WELCOME BANNER */}

      <section className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-r from-[#102138] via-[#162941] to-[#12392f] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-amber-300">
              <ShieldCheck size={16} />
              Super Admin Control Center
            </div>

            <h1 className="mt-5 text-2xl font-black text-white sm:text-4xl">
              Welcome back,
              <span className="mt-1 block text-amber-300">
                {user?.name || "Super Admin"}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Manage authorized Admin accounts and control administrative access
              to AMIOUT Enterprise. Account statistics below come from MongoDB.
            </p>
          </div>

          <Link
            to="/super-admin/admins/create"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-black text-[#0a182b] transition hover:bg-amber-300"
          >
            <UserRoundPlus size={19} />
            Create Admin
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* SECTION HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-white">
            <LayoutDashboard size={23} className="text-amber-300" />
            Admin Account Overview
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Live statistics from the Admin collection
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAdmins(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-2.5 text-sm font-bold text-amber-300 hover:bg-amber-400/20 disabled:opacity-50"
        >
          <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* API ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
          <AlertTriangle className="shrink-0 text-red-400" />
          <div>
            <h3 className="font-bold text-red-200">
              Admin statistics unavailable
            </h3>
            <p className="mt-2 text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* REAL STATS */}

      {loading ? (
        <div className="flex h-48 items-center justify-center gap-3 text-slate-400">
          <Loader2 className="animate-spin text-amber-400" />
          Loading Admin statistics...
        </div>
      ) : !error ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Admins"
            value={total}
            icon={UsersRound}
            color="amber"
            note="Existing Admin accounts"
          />
          <StatCard
            title="Active Admins"
            value={active}
            icon={CheckCircle2}
            color="emerald"
            note="Enabled Admin accounts"
          />
          <StatCard
            title="Inactive Admins"
            value={inactive}
            icon={UserX}
            color="rose"
            note="Disabled Admin accounts"
          />
          <StatCard
            title="Password Change Pending"
            value={firstLoginPending}
            icon={Clock3}
            color="blue"
            note="Accounts with first-login change flag"
          />
        </div>
      ) : null}

      {/* REAL QUICK ACTIONS */}

      <section className="grid gap-5 md:grid-cols-2">
        <Link
          to="/super-admin/admins"
          className="group rounded-2xl border border-[#26384e] bg-[#112138] p-6 transition hover:border-amber-400/40"
        >
          <div className="flex items-center justify-between">
            <UsersRound size={29} className="text-amber-300" />
            <ArrowRight
              size={20}
              className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-300"
            />
          </div>

          <h3 className="mt-5 text-lg font-black text-white">
            Manage Admin Accounts
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Search accounts and securely enable or disable Admin login access.
          </p>
        </Link>

        <Link
          to="/super-admin/admins/create"
          className="group rounded-2xl border border-[#26384e] bg-[#112138] p-6 transition hover:border-amber-400/40"
        >
          <div className="flex items-center justify-between">
            <ShieldPlus size={29} className="text-emerald-300" />
            <ArrowRight
              size={20}
              className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-300"
            />
          </div>

          <h3 className="mt-5 text-lg font-black text-white">
            Provision New Admin
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Create an authorized Admin with a temporary password and mandatory
            first-login password change.
          </p>
        </Link>
      </section>

      <div className="rounded-2xl border border-[#26384e] bg-[#112138] p-5">
        <p className="text-xs leading-6 text-slate-400">
          <strong className="text-amber-300">Additional monitoring:</strong>{" "}
          University-wide outpass, student and faculty analytics will be
          integrated after their dedicated Super Admin API permissions are
          verified.
        </p>
      </div>
    </div>
  );
}
