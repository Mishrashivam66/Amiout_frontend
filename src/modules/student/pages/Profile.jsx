// ==========================================
// Project : AMIOUT
// Module  : Student
// File    : Profile.jsx
// ==========================================

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { User, Lock, CheckCircle } from "lucide-react";

import api from "../../../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch Profile

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/student/profile");

        setProfile(response?.data?.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading Profile...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}

      <div
        className="
rounded-3xl
bg-gradient-to-r
from-green-600
to-emerald-500
p-8
text-white
shadow-xl
"
      >
        <h1 className="text-3xl font-bold">My Profile</h1>

        <p className="text-green-100 mt-2">
          Student information and parent details
        </p>
      </div>

      {/* Student Details */}

      <div
        className="
bg-white
rounded-3xl
shadow-xl
p-8
"
      >
        <h2
          className="
text-xl
font-bold
mb-6
flex
items-center
gap-2
"
        >
          <User className="text-green-600" />
          Student Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Name" value={profile?.student?.name} />

          <Info
            label="Enrollment Number"
            value={profile?.student?.enrollmentNumber}
          />

          <Info label="Email" value={profile?.student?.email} />

          <Info label="Mobile Number" value={profile?.student?.mobileNumber} />

          <Info label="Course" value={profile?.student?.course} />

          <Info label="Branch" value={profile?.student?.branch} />

          <Info label="Semester" value={profile?.student?.semester} />

          <Info label="Section" value={profile?.academic?.section} />

          <Info label="Group" value={profile?.academic?.group} />
        </div>
      </div>

      {/* Parent Details */}

      {/* Parent Details */}

      <div
        className="
  bg-white
  rounded-3xl
  shadow-xl
  p-8
  "
      >
        <h2 className="text-xl font-bold mb-6">Parent Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Parent Name" value={profile?.parent?.name} />

          <Info label="Parent Email" value={profile?.parent?.email} />

          <Info label="Parent Mobile" value={profile?.parent?.mobileNumber} />
        </div>
      </div>

      {/* Status */}

      {/* Status */}

      <div
        className="
bg-white
rounded-3xl
shadow-xl
p-8
"
      >
        <h2 className="text-xl font-bold mb-5">Profile Status</h2>

        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-600" />

          <span className="font-semibold">
            {profile?.profile?.completed
              ? "Profile Completed"
              : "Profile Incomplete"}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <Lock className="text-slate-600" />

          <span>
            {profile?.profile?.locked ? "Profile Locked" : "Profile Editable"}
          </span>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div
    className="
bg-slate-50
rounded-xl
p-4
"
  >
    <p className="text-sm text-slate-500">{label}</p>

    <p className="mt-1 font-semibold text-slate-800">{value || "N/A"}</p>
  </div>
);

export default Profile;
