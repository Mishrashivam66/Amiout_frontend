import { useEffect, useState } from "react";
import { Mail, Phone, Building2, BadgeCheck, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../services/mentor.service";
import toast from "react-hot-toast";
const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      const res = await updateProfile({
        phone: profile.phone,
        department: profile.department,
      });

      if (res.success) {
        const updatedProfile = res.data || profile;

        setProfile(updatedProfile);

        updateUser(updatedProfile);

        setIsEditing(false);

        toast.success("Profile updated successfully.");
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Unable to update profile.");
    }
  };

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-10 shadow-2xl">
        <div className="flex flex-col items-center gap-5 lg:flex-row">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/20 text-5xl font-bold text-white backdrop-blur">
            {profile?.name?.charAt(0)?.toUpperCase() || "M"}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white">
              {profile?.name || "Mentor"}
            </h1>

            <p className="mt-2 text-lg text-blue-100">{profile?.email}</p>
          </div>

          <div className="ml-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-5 py-2 text-sm font-semibold text-emerald-300">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* ================= PROFILE CARD ================= */}

      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
        <h2 className="mb-8 text-2xl font-bold text-slate-800">
          Personal Information
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Full Name */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <User size={16} />
              Full Name
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
              {profile?.name || "-"}
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Mail size={16} />
              Email
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
              {profile?.email || "-"}
            </div>
          </div>

          {/* Role */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <BadgeCheck size={16} />
              Role
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm uppercase">
              {profile?.role || "MENTOR"}
            </div>
          </div>

          {/* Mobile */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Phone size={16} />
              Mobile
            </label>

            {isEditing ? (
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 p-3 focus:border-blue-500 outline-none"
              />
            ) : (
              <div className="mt-2 rounded-xl border bg-slate-50 p-3">
                {profile?.phone || "-"}
              </div>
            )}
          </div>

          {/* Department */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Building2 size={16} />
              Department
            </label>

            {isEditing ? (
              <input
                type="text"
                value={profile.department || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    department: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 p-3 focus:border-blue-500 outline-none"
              />
            ) : (
              <div className="mt-2 rounded-xl border bg-slate-50 p-3">
                {profile?.department || "-"}
              </div>
            )}
          </div>

          {/* Employee ID */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <BadgeCheck size={16} />
              Employee ID
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
              {profile?.employeeId || "-"}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-300 px-6 py-3 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* ================= STATUS ================= */}

        <div className="mt-10 border-t border-slate-200 pt-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-700">
            Account Status
          </h3>

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 font-semibold text-emerald-700">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Active Account
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
