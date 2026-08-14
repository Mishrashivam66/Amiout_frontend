// ==========================================
// Project : AMIOUT
// Module  : Student
// File    : CompleteProfile.jsx
// ==========================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  Phone,
  Save,
  ArrowLeft,
  Users,
  Layers,
} from "lucide-react";

import api from "../../../services/api";

const CompleteProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    section: "",

    group: "",

    parentName: "",

    parentEmail: "",

    parentMobileNumber: "",
  });

  // ==========================================
  // Handle Input Change
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Submit Profile
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.put("/student/profile", formData);

      try {
        await api.patch("/student/profile/map-mentor");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Mentor mapping failed.");
      }

      toast.success(
        response?.data?.message || "Profile completed successfully.",
      );

      navigate("/student/profile");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to complete profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* =====================================
          Header
      ===================================== */}

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
        <button
          onClick={() => navigate(-1)}
          className="
          flex
          items-center
          gap-2
          mb-5
          text-green-100
          hover:text-white
          "
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-3xl font-bold">Complete Your Profile</h1>

        <p className="mt-2 text-green-100">
          Add your academic and parent details
        </p>
      </div>

      {/* =====================================
          Form
      ===================================== */}

      <form
        onSubmit={handleSubmit}
        className="
        bg-white
        rounded-3xl
        shadow-xl
        p-8
        space-y-8
        "
      >
        {/* Academic Section */}

        <div>
          <h2
            className="
            text-xl
            font-bold
            text-slate-800
            mb-5
            "
          >
            Academic Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              icon={Users}
              label="Section"
              name="section"
              placeholder="Example: C"
              value={formData.section}
              onChange={handleChange}
            />

            <InputField
              icon={Layers}
              label="Group"
              name="group"
              placeholder="Example: C1"
              value={formData.group}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Parent Section */}

        <div>
          <h2
            className="
            text-xl
            font-bold
            text-slate-800
            mb-5
            "
          >
            Parent Information
          </h2>

          <div className="space-y-5">
            <InputField
              icon={User}
              label="Parent Name"
              name="parentName"
              placeholder="Enter parent name"
              value={formData.parentName}
              onChange={handleChange}
            />

            <InputField
              icon={Mail}
              label="Parent Email"
              name="parentEmail"
              type="email"
              placeholder="example@gmail.com"
              value={formData.parentEmail}
              onChange={handleChange}
            />

            <InputField
              icon={Phone}
              label="Parent Mobile Number"
              name="parentMobileNumber"
              placeholder="10 digit mobile number"
              value={formData.parentMobileNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit Button */}

        <button
          disabled={loading}
          className="
          w-full
          flex
          justify-center
          items-center
          gap-3
          bg-green-600
          hover:bg-green-700
          text-white
          py-4
          rounded-xl
          font-semibold
          transition
          shadow-lg
          "
        >
          <Save size={20} />

          {loading ? "Saving..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
};

// ==========================================
// Input Component
// ==========================================

const InputField = ({
  icon: Icon,

  label,

  name,

  value,

  onChange,

  placeholder,

  type = "text",
}) => {
  return (
    <div>
      <label
        className="
      block
      mb-2
      font-semibold
      text-slate-700
      "
      >
        {label}
      </label>

      <div
        className="
      flex
      items-center
      gap-3
      border
      rounded-xl
      px-4
      py-3
      focus-within:border-green-600
      transition
      "
      >
        <Icon size={20} className="text-green-600" />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="
        w-full
        outline-none
        text-slate-800
        "
        />
      </div>
    </div>
  );
};

export default CompleteProfile;
