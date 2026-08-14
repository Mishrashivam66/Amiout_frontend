import { useState } from "react";
import { toast } from "react-hot-toast";

import MentorForm from "./MentorForm";

import { createMentor } from "../../services/mentor.service";

const AddMentorModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    semester: 1,
    group: "",
    coordinator: "",
    totalStudents: 0,
    isActive: true,
  });

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createMentor(formData);

      toast.success("Mentor added successfully.");

      onSuccess();

      onClose();

      setFormData({
        name: "",
        course: "",
        semester: 1,
        group: "",
        coordinator: "",
        totalStudents: 0,
        isActive: true,
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to add mentor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0F172A] p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add Mentor</h2>

          <button
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-red-500"
          >
            ×
          </button>
        </div>

        <MentorForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AddMentorModal;
