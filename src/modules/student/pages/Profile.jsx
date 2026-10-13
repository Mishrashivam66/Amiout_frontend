import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCircle,
  Users,
  IdCard,
  Layers,
} from "lucide-react";

import api from "../../../services/api";

const displayValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }

  if (typeof value === "object") {
    return value.name || value.code || value.title || "Not available";
  }

  return String(value);
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load student profile.";

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/40">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <p className="mt-1 break-words text-sm font-bold text-slate-800">
          {displayValue(value)}
        </p>
      </div>
    </div>
  </div>
);

const ProfileSection = ({ title, subtitle, icon: Icon, children }) => (
  <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Icon size={23} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>

    <div className="grid gap-4 p-6 sm:grid-cols-2">{children}</div>
  </section>
);

const MentorCard = ({ title, mentor }) => {
  const mapped = mentor && typeof mentor === "object" ? mentor : {};

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
          <UserCircle size={23} />
        </div>

        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>

          <p className="mt-1 text-xs text-slate-500">
            University-assigned faculty
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-500">Faculty Name</p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {displayValue(mapped.name || mapped.mentorName)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Official Email</p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
            {displayValue(mapped.email || mapped.mentorEmail)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {mapped.group && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Group {mapped.group}
            </span>
          )}

          {mapped.availabilityStatus && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {mapped.availabilityStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/student/profile");

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Profile API returned an error.",
        );
      }

      const result = response.data?.data ?? response.data;

      setProfile(result || null);
    } catch (requestError) {
      console.error("Load Student Profile Error:", requestError);

      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-44 animate-pulse rounded-3xl bg-slate-200" />

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-3xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
        <AlertCircle size={40} className="mx-auto text-rose-600" />

        <h2 className="mt-4 text-xl font-bold text-rose-900">
          Unable to Load Profile
        </h2>

        <p className="mt-2 text-sm text-rose-700">
          {error || "No verified profile data received."}
        </p>

        <button
          type="button"
          onClick={fetchProfile}
          className="mt-5 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const student = profile.student || {};
  const academic = profile.academic || {};
  const parent = profile.parent || {};

  const mentors = profile.mentors || {};

  const primaryMentor =
    mentors.primary || profile.primaryMentor || academic.primaryMentor || {};

  const backupMentor =
    mentors.backup || profile.backupMentor || academic.backupMentor || {};

  const studentName = student.name || "Student";

  return (
    <div className="min-h-screen space-y-6 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 pb-8">
      {/* PREMIUM HEADER */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-emerald-400/10 blur-2xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
              <Sparkles size={14} />
              AMIOUT · Verified Student Record
            </div>

            <h1 className="text-2xl font-extrabold sm:text-3xl">My Profile</h1>

            <p className="mt-2 text-sm text-emerald-100">{studentName}</p>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Your official student information, academic mapping, parent
              details and assigned mentors.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-3 py-2 text-xs font-semibold text-emerald-100">
              <ShieldCheck size={16} />
              Read-only university data
            </div>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* STUDENT INFORMATION */}
      <ProfileSection
        title="Student Information"
        subtitle="Official identity and contact details"
        icon={UserCircle}
      >
        <InfoField icon={UserCircle} label="Full Name" value={student.name} />

        <InfoField
          icon={IdCard}
          label="Enrollment Number"
          value={student.enrollmentNumber}
        />

        <InfoField icon={Hash} label="Roll Number" value={student.rollNumber} />

        <InfoField icon={Mail} label="Email Address" value={student.email} />

        <InfoField
          icon={Phone}
          label="Mobile Number"
          value={student.mobileNumber}
        />
      </ProfileSection>

      {/* ACADEMIC INFORMATION */}
      <ProfileSection
        title="Academic Information"
        subtitle="Institute, course, batch and assigned group"
        icon={GraduationCap}
      >
        <InfoField
          icon={Building2}
          label="Institute"
          value={
            academic.institute?.name ||
            academic.instituteName ||
            academic.institute
          }
        />

        <InfoField
          icon={BookOpen}
          label="Program / Course"
          value={
            academic.program?.name ||
            academic.programName ||
            academic.course ||
            academic.program
          }
        />

        <InfoField
          icon={Layers}
          label="Department"
          value={academic.department || academic.program?.department}
        />

        <InfoField icon={CalendarDays} label="Batch" value={academic.batch} />

        <InfoField
          icon={GraduationCap}
          label="Semester"
          value={academic.semester}
        />

        <InfoField icon={Users} label="Section" value={academic.section} />

        <InfoField icon={Users} label="Group" value={academic.group} />

        <InfoField
          icon={Hash}
          label="Mentor Group"
          value={
            academic.mentorGroup?.name ||
            academic.mentorGroup?.code ||
            academic.mentorGroup
          }
        />
      </ProfileSection>

      {/* MENTORS */}
      <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <Users size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Assigned Mentors
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Automatically mapped through StudentMaster
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MentorCard title="Primary Mentor" mentor={primaryMentor} />

          <MentorCard title="Backup Mentor" mentor={backupMentor} />
        </div>
      </section>

      {/* PARENT INFORMATION */}
      <ProfileSection
        title="Parent Information"
        subtitle="Verified contact details for outpass consent"
        icon={ShieldCheck}
      >
        <InfoField icon={UserCircle} label="Parent Name" value={parent.name} />

        <InfoField
          icon={Phone}
          label="Registered Parent Mobile"
          value={parent.mobileNumber}
        />
      </ProfileSection>

      {/* READ-ONLY POLICY */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <CheckCircle2 size={21} className="mt-0.5 shrink-0 text-emerald-700" />

        <div>
          <p className="text-sm font-bold text-emerald-900">
            Profile managed by university records
          </p>

          <p className="mt-1 text-xs leading-5 text-emerald-800">
            Your details are read-only and sourced from StudentMaster. No
            profile completion or profile locking is needed to apply for an
            outpass. For incorrect information, contact the authorized
            university administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
