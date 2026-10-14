import { useCallback, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Mail,
  RefreshCw,
  ShieldCheck,
  User,
  Users,
  XCircle,
  IdCard,
  Layers,
  CalendarDays,
  Phone,
  AlertTriangle,
} from "lucide-react";

import toast from "react-hot-toast";

import { getProfile, updateAvailability } from "../services/mentor.service";

// ============================================================
// FACULTY ROLE ROUTES
// Verify these paths against your App routes.
// ============================================================

const ROLE_ROUTES = {
  MENTOR: "/mentor/dashboard",
  COORDINATOR: "/coordinator/dashboard",
  HOD: "/hod/dashboard",
  HOI: "/hoi/dashboard",
};

const ROLE_LABELS = {
  MENTOR: "Mentor",
  COORDINATOR: "Coordinator",
  HOD: "Head of Department",
  HOI: "Head of Institute",
};

const ROLE_DESCRIPTIONS = {
  MENTOR: "Group-level outpass management",
  COORDINATOR: "Section-level coordination",
  HOD: "Department-level supervision",
  HOI: "Institute-level administration",
};

// ============================================================
// HELPERS
// ============================================================

const display = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not available";
  }

  return String(value);
};

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  return error?.response?.data?.message || error?.message || fallback;
};

// ============================================================
// INFORMATION FIELD
// ============================================================

const Info = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>

          <p className="mt-1 break-words text-sm font-bold text-slate-800">
            {display(value)}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SECTION WRAPPER
// ============================================================

const Section = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <Icon size={23} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

// ============================================================
// MENTOR PROFILE
// ============================================================

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================================
  // STATE
  // ==========================================================

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [availabilitySaving, setAvailabilitySaving] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");

  // ==========================================================
  // LOAD PROFILE FROM BACKEND
  // ==========================================================

  const fetchFacultyProfile = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const response = await getProfile();

      if (response?.success !== true || !response?.data) {
        throw new Error(response?.message || "Unable to load faculty profile.");
      }

      setProfile(response.data);

      return response.data;
    } catch (err) {
      console.error("Faculty Profile Error:", err);

      setError(getErrorMessage(err, "Unable to load faculty profile."));

      return null;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await getProfile();

        if (response?.success !== true || !response?.data) {
          throw new Error(
            response?.message || "Unable to load faculty profile.",
          );
        }

        if (!cancelled) {
          setProfile(response.data);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Faculty Profile Error:", err);

          setError(getErrorMessage(err, "Unable to load faculty profile."));

          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // PROFILE INFORMATION
  // ==========================================================

  const faculty = profile?.faculty || {};

  const academicAssignments = Array.isArray(profile?.academicAssignments)
    ? profile.academicAssignments
    : [];

  const roleAssignments = Array.isArray(profile?.roleAssignments)
    ? profile.roleAssignments
    : [];

  // ==========================================================
  // AUTHORIZED ROLES
  //
  // No useMemo: avoids React Compiler memoization warning.
  // ==========================================================

  const authorizedRoles = Array.isArray(profile?.authorizedRoles)
    ? [
        ...new Set(
          profile.authorizedRoles.filter((role) =>
            Object.prototype.hasOwnProperty.call(ROLE_ROUTES, role),
          ),
        ),
      ]
    : [];

  // ==========================================================
  // CURRENT ROUTE ROLE
  // ==========================================================

  const pathname = location.pathname.toLowerCase();

  const currentRouteRole =
    Object.keys(ROLE_ROUTES).find((role) => {
      const routePrefix = ROLE_ROUTES[role].replace(/\/dashboard$/, "");

      return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`);
    }) || "";

  // ==========================================================
  // EFFECTIVE SELECTED ROLE
  //
  // Derived value instead of useEffect/setState.
  // User selection is preserved if still authorized.
  // ==========================================================

  const effectiveSelectedRole = authorizedRoles.includes(selectedRole)
    ? selectedRole
    : authorizedRoles.includes(currentRouteRole)
      ? currentRouteRole
      : authorizedRoles[0] || "";

  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  const availability = profile?.availabilityStatus;

  const isAvailable = availability === "AVAILABLE";

  const availabilityKnown =
    availability === "AVAILABLE" || availability === "UNAVAILABLE";

  // ==========================================================
  // UPDATE AVAILABILITY
  // ==========================================================

  const handleAvailabilityChange = async () => {
    if (!availabilityKnown || availabilitySaving) {
      return;
    }

    const nextStatus = isAvailable ? "UNAVAILABLE" : "AVAILABLE";

    setAvailabilitySaving(true);

    try {
      const response = await updateAvailability(nextStatus);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to update availability.");
      }

      // Refresh from backend after saving.
      const freshResponse = await getProfile();

      if (freshResponse?.success !== true || !freshResponse?.data) {
        throw new Error("Availability updated, but profile refresh failed.");
      }

      const actualStatus = freshResponse.data.availabilityStatus;

      setProfile(freshResponse.data);

      if (actualStatus !== nextStatus) {
        toast.error("Saved availability does not match the requested status.");

        return;
      }

      toast.success(
        actualStatus === "AVAILABLE"
          ? "You are now available for new assignments."
          : "You are now unavailable for new assignments.",
      );
    } catch (err) {
      console.error("Availability Update Error:", err);

      toast.error(getErrorMessage(err, "Unable to update availability."));

      // Re-fetch real DB status if something fails.
      await fetchFacultyProfile(false);
    } finally {
      setAvailabilitySaving(false);
    }
  };

  // ==========================================================
  // DASHBOARD ROLE SWITCH
  // ==========================================================

  const handleRoleSwitch = () => {
    if (
      !effectiveSelectedRole ||
      !authorizedRoles.includes(effectiveSelectedRole)
    ) {
      toast.error("You are not authorized for this faculty role.");

      return;
    }

    const route = ROLE_ROUTES[effectiveSelectedRole];

    if (!route) {
      toast.error("Dashboard route is not configured.");

      return;
    }

    navigate(route);
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 animate-pulse rounded-3xl bg-slate-200" />
        <div className="h-56 animate-pulse rounded-3xl bg-slate-100" />
        <div className="h-56 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (!profile) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
        <AlertTriangle size={38} className="mx-auto text-rose-600" />

        <h2 className="mt-4 text-xl font-bold text-rose-900">
          Faculty Profile Unavailable
        </h2>

        <p className="mt-2 text-sm text-rose-700">
          {error || "No faculty profile data found."}
        </p>

        <button
          type="button"
          onClick={() => fetchFacultyProfile()}
          className="mt-5 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="space-y-7 pb-8">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white shadow-xl sm:p-9">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/15 text-4xl font-extrabold">
            {faculty.name?.charAt(0)?.toUpperCase() || "F"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              AMIOUT Faculty Portal
            </p>

            <h1 className="mt-2 break-words text-2xl font-extrabold sm:text-3xl">
              {faculty.name || "Faculty Profile"}
            </h1>

            <p className="mt-2 break-all text-sm text-blue-100">
              {faculty.email || ""}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {authorizedRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold"
                >
                  {ROLE_LABELS[role] || role}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchFacultyProfile(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20 disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* API WARNING */}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* ===================================================== */}
      {/* OFFICIAL FACULTY INFORMATION */}
      {/* ===================================================== */}

      <Section
        title="Official Faculty Information"
        subtitle="Read-only details imported from MentorMaster"
        icon={User}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Info icon={User} label="Full Name" value={faculty.name} />

          <Info icon={Mail} label="Official Email" value={faculty.email} />

          <Info icon={IdCard} label="Faculty ID" value={faculty.facultyId} />

          <Info
            icon={BadgeCheck}
            label="Designation"
            value={faculty.designation}
          />

          <Info icon={Building2} label="Institute" value={faculty.institute} />

          <Info icon={Layers} label="Department" value={faculty.department} />

          <Info icon={Phone} label="Registered Contact" value={faculty.phone} />
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
          <ShieldCheck size={19} className="shrink-0" />
          Official faculty details are maintained by university administration.
        </div>
      </Section>

      {/* ===================================================== */}
      {/* ACADEMIC ASSIGNMENTS */}
      {/* ===================================================== */}

      <Section
        title="Academic Assignments"
        subtitle="All active linked MentorMaster records"
        icon={BookOpen}
      >
        {academicAssignments.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {academicAssignments.map((assignment, index) => (
              <div
                key={assignment.id || index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900">
                    Assignment {index + 1}
                  </h3>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    {display(assignment.roles)}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Info
                    icon={Building2}
                    label="Institute"
                    value={assignment.institute}
                  />

                  <Info
                    icon={BookOpen}
                    label="Program"
                    value={assignment.program || assignment.course}
                  />

                  <Info
                    icon={Layers}
                    label="Department"
                    value={assignment.department}
                  />

                  <Info
                    icon={GraduationCap}
                    label="Semester"
                    value={assignment.semester}
                  />

                  <Info
                    icon={Users}
                    label="Section"
                    value={assignment.section}
                  />

                  <Info icon={Users} label="Group" value={assignment.group} />

                  <Info
                    icon={CalendarDays}
                    label="Coordinator Groups"
                    value={assignment.coordinatorGroups}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No active MentorMaster records are linked to this faculty account.
          </p>
        )}
      </Section>

      {/* ===================================================== */}
      {/* SWITCH DASHBOARD ROLE */}
      {/* ===================================================== */}

      <Section
        title="Switch Dashboard Role"
        subtitle="Choose from your authorized faculty roles"
        icon={ShieldCheck}
      >
        {authorizedRoles.length > 0 ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {authorizedRoles.map((role) => {
                const selected = effectiveSelectedRole === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-xl p-3 ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-50 text-blue-600"
                        }`}
                      >
                        {role === "MENTOR" ? (
                          <GraduationCap size={21} />
                        ) : (
                          <Users size={21} />
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {ROLE_LABELS[role]}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {ROLE_DESCRIPTIONS[role]}
                        </p>
                      </div>
                    </div>

                    {selected && (
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-blue-600"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleRoleSwitch}
              disabled={!effectiveSelectedRole}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              Open {ROLE_LABELS[effectiveSelectedRole] || "Selected"} Dashboard
              <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No verified active faculty role assignment is available. Contact the
            university administrator.
          </p>
        )}

        {roleAssignments.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h3 className="mb-3 font-bold text-slate-800">
              Authorized Academic Scopes
            </h3>

            <div className="space-y-3">
              {roleAssignments.map((assignment, index) => (
                <div
                  key={assignment.id || index}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {ROLE_LABELS[assignment.role] || assignment.role}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {assignment.scopeType}
                      {" · "}
                      {assignment.scopeId}
                    </p>
                  </div>

                  <CheckCircle2 size={19} className="text-emerald-600" />
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ===================================================== */}
      {/* FACULTY AVAILABILITY */}
      {/* ===================================================== */}

      <Section
        title="Faculty Availability"
        subtitle="Manage eligibility for new outpass assignments"
        icon={CheckCircle2}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            {availabilityKnown ? (
              isAvailable ? (
                <CheckCircle2 size={27} className="text-emerald-600" />
              ) : (
                <XCircle size={27} className="text-rose-600" />
              )
            ) : (
              <AlertTriangle size={27} className="text-amber-600" />
            )}

            <div>
              <p className="font-bold text-slate-900">
                {!availabilityKnown
                  ? "Status Not Loaded"
                  : isAvailable
                    ? "Available"
                    : "Unavailable"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Saved in your Mentor account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAvailabilityChange}
            disabled={!availabilityKnown || availabilitySaving || refreshing}
            className={`rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:opacity-50 ${
              isAvailable
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {availabilitySaving
              ? "Updating..."
              : !availabilityKnown
                ? "Status Unavailable"
                : isAvailable
                  ? "Set Unavailable"
                  : "Set Available"}
          </button>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Changing availability affects new faculty assignments. Already
          assigned pending requests are not automatically transferred.
        </p>
      </Section>
    </div>
  );
};

export default Profile;
