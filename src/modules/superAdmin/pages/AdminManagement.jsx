import { useCallback, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldOff,
  UsersRound,
  X,
} from "lucide-react";

import superAdminService from "../services/superAdmin.service";

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to process request.";

const formatDate = (value) => {
  if (!value) return "Never";

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

// ============================================================
// AMIOUT SUPER ADMIN - ADMIN MANAGEMENT
//
// GET   /super-admin/admins
// PATCH /super-admin/admins/:id/status
//
// Does not delete Admin accounts.
// SUPER_ADMIN is not part of the Admin list.
// ============================================================

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

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
        toast.success("Admin list updated", {
          duration: 1000,
        });
      }
    } catch (err) {
      const message = getError(err);
      setError(message);

      if (silent) {
        toast.error(message, { duration: 1000 });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();

    return admins.filter((admin) => {
      const isActive = admin.isActive === true;

      if (filter === "ACTIVE" && !isActive) return false;
      if (filter === "INACTIVE" && isActive) return false;

      if (!query) return true;

      const searchable = [admin.name, admin.email, admin.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [admins, search, filter]);

  const activeCount = admins.filter((admin) => admin.isActive === true).length;

  const confirmStatusChange = async () => {
    if (!selectedAdmin || saving) return;

    const adminId = selectedAdmin._id || selectedAdmin.id;

    const nextStatus = !selectedAdmin.isActive;

    if (!adminId) {
      toast.error("Admin identifier is missing.", {
        duration: 1000,
      });
      return;
    }

    setSaving(true);

    try {
      await superAdminService.updateAdminStatus(adminId, nextStatus);

      setAdmins((current) =>
        current.map((admin) => {
          const id = admin._id || admin.id;

          return String(id) === String(adminId)
            ? { ...admin, isActive: nextStatus }
            : admin;
        }),
      );

      toast.success(
        nextStatus
          ? "Admin activated successfully"
          : "Admin deactivated successfully",
        { duration: 1000 },
      );

      setSelectedAdmin(null);
    } catch (err) {
      toast.error(getError(err), {
        duration: 1000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <section className="flex flex-col justify-between gap-5 rounded-3xl border border-amber-400/15 bg-gradient-to-r from-[#102138] to-[#17302c] p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
            Super Admin Portal
          </p>

          <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
            Admin Management
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            View and manage authorized AMIOUT Admin accounts.
          </p>
        </div>

        <Link
          to="/super-admin/admins/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-[#0a182b] hover:bg-amber-300"
        >
          <Plus size={19} />
          Create Admin
        </Link>
      </section>

      {/* SUMMARY */}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Admins",
              count: admins.length,
              color: "text-white",
            },
            {
              label: "Active",
              count: activeCount,
              color: "text-emerald-300",
            },
            {
              label: "Inactive",
              count: admins.length - activeCount,
              color: "text-rose-300",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#26384e] bg-[#112138] p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <h2 className={`mt-3 text-3xl font-black ${item.color}`}>
                {item.count}
              </h2>
            </div>
          ))}
        </div>
      )}

      {/* MAIN LIST */}

      <section className="overflow-hidden rounded-3xl border border-[#26384e] bg-[#112138]">
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black text-white">
              <UsersRound size={22} className="text-amber-300" />
              Registered Admin Accounts
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Live records from the Admin collection
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchAdmins(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/20 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-400/10 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* SEARCH AND FILTER */}

        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:p-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or phone"
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
          >
            <option value="ALL">All Accounts</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center gap-3 text-slate-400">
            <Loader2 size={22} className="animate-spin text-amber-400" />
            Loading Admin accounts...
          </div>
        ) : error ? (
          <div className="m-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-5 text-red-200">
            <AlertTriangle size={21} />
            <p className="text-sm">{error}</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
            <UsersRound size={36} className="text-slate-600" />
            <p className="mt-4 font-semibold text-white">
              No matching Admin accounts
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {admins.length === 0
                ? "No Admin accounts have been created yet."
                : "Try another search or filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-[#091629]">
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-4">Admin</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Last Login</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.map((admin) => {
                  const isActive = admin.isActive === true;

                  return (
                    <tr
                      key={admin._id || admin.id}
                      className="border-t border-white/5 text-sm hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">{admin.name}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {admin.mustChangePassword
                            ? "Password change pending"
                            : "ADMIN"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-slate-200">{admin.email}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {admin.phone || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                            isActive
                              ? "bg-emerald-400/10 text-emerald-300"
                              : "bg-rose-400/10 text-rose-300"
                          }`}
                        >
                          {isActive ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <ShieldOff size={14} />
                          )}
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {formatDate(admin.lastLogin)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAdmin(admin)}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold ${
                            isActive
                              ? "bg-rose-400/10 text-rose-300 hover:bg-rose-400/20"
                              : "bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
                          }`}
                        >
                          {isActive ? (
                            <ShieldOff size={15} />
                          ) : (
                            <ShieldCheck size={15} />
                          )}

                          {isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* IN-APP CONFIRMATION MODAL */}

      {selectedAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-status-modal-title"
            className="w-full max-w-md rounded-3xl border border-[#33465e] bg-[#102138] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-amber-400/10 p-3 text-amber-300">
                <AlertTriangle size={23} />
              </div>

              <button
                type="button"
                onClick={() => setSelectedAdmin(null)}
                disabled={saving}
                aria-label="Close confirmation"
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id="admin-status-modal-title"
              className="mt-5 text-xl font-black text-white"
            >
              {selectedAdmin.isActive ? "Deactivate Admin?" : "Activate Admin?"}
            </h2>

            <p className="mt-3 break-words text-sm leading-7 text-slate-300">
              {selectedAdmin.name} ({selectedAdmin.email}) will be{" "}
              {selectedAdmin.isActive ? "deactivated." : "activated."}
            </p>

            <p className="mt-3 text-xs leading-6 text-slate-400">
              The Admin record will be preserved. An inactive account must be
              denied authentication by the backend, including existing sessions.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => setSelectedAdmin(null)}
                className="rounded-xl border border-[#33465e] px-4 py-3 text-sm font-bold text-white hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={confirmStatusChange}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-50 ${
                  selectedAdmin.isActive
                    ? "bg-rose-500 text-white hover:bg-rose-600"
                    : "bg-amber-400 text-[#091629] hover:bg-amber-300"
                }`}
              >
                {saving && <Loader2 size={17} className="animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
