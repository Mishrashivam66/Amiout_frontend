import { useEffect, useState } from "react";
import { User, Bell, Shield, Save, Info } from "lucide-react";
import toast from "react-hot-toast";

import settingsService from "../services/settings.service";

const Settings = () => {
  // ============================================================================
  // States
  // ============================================================================

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  // ============================================================================
  // Fetch Profile
  // ============================================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await settingsService.getProfile();

      setProfile(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // Life Cycle
  // ============================================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // ============================================================================
  // Loading
  // ============================================================================

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-white">Settings</h1>

        <p className="mt-2 text-slate-400">
          Manage your administrator profile and system settings.
        </p>
      </div>

      {/* Profile */}

      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">
        <div className="mb-6 flex items-center gap-3">
          <User className="text-blue-400" size={28} />

          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Full Name
            </label>

            <input
              disabled
              value={profile?.name || ""}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Email Address
            </label>

            <input
              disabled
              value={profile?.email || ""}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Phone Number
            </label>

            <input
              disabled
              value={profile?.phone || "Not Available"}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">Role</label>

            <input
              disabled
              value={profile?.role || ""}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
            />
          </div>
        </div>
      </div>

      {/* Notification */}

      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">
        <div className="mb-6 flex items-center gap-3">
          <Bell className="text-green-400" size={28} />

          <h2 className="text-2xl font-bold text-white">
            Notification Settings
          </h2>
        </div>

        <div className="space-y-5">
          <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-4">
            <div>
              <p className="font-semibold text-white">Email Notifications</p>

              <p className="text-sm text-slate-400">
                Receive important system updates.
              </p>
            </div>

            <input type="checkbox" checked readOnly />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-4">
            <div>
              <p className="font-semibold text-white">Browser Notifications</p>

              <p className="text-sm text-slate-400">
                Show notifications inside dashboard.
              </p>
            </div>

            <input type="checkbox" checked readOnly />
          </label>
        </div>
      </div>

      {/* Security */}

      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">
        <div className="mb-6 flex items-center gap-3">
          <Shield className="text-red-400" size={28} />

          <h2 className="text-2xl font-bold text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="font-semibold text-white">Account Status</p>

            <p
              className={`mt-2 font-semibold ${
                profile?.isActive ? "text-green-400" : "text-red-400"
              }`}
            >
              {profile?.isActive ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="font-semibold text-white">Email Verification</p>

            <p
              className={`mt-2 font-semibold ${
                profile?.isVerified ? "text-green-400" : "text-red-400"
              }`}
            >
              {profile?.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>
      </div>

      {/* System Information */}

      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">
        <div className="mb-6 flex items-center gap-3">
          <Info className="text-cyan-400" size={28} />

          <h2 className="text-2xl font-bold text-white">System Information</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-slate-400">Application</p>

            <h3 className="mt-2 text-xl font-bold text-white">AMIOUT</h3>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-slate-400">Version</p>

            <h3 className="mt-2 text-xl font-bold text-white">v1.0.0</h3>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-slate-400">Created</p>

            <h3 className="mt-2 text-sm font-semibold text-white">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-IN")
                : "-"}
            </h3>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-slate-400">Last Login</p>

            <h3 className="mt-2 text-sm font-semibold text-white">
              {profile?.lastLogin
                ? new Date(profile.lastLogin).toLocaleString("en-IN")
                : "Never"}
            </h3>
          </div>
        </div>
      </div>

      {/* Save */}

      <div className="flex justify-end">
        <button
          disabled
          className="flex cursor-not-allowed items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white opacity-60"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
