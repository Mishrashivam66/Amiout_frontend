import { toast } from "react-hot-toast";

import { deleteMentor } from "../../services/mentor.service";

const DeleteMentorModal = ({
  open,
  mentorId,
  mentorName,
  onClose,
  onSuccess,
}) => {
  if (!open) return null;

  const handleDelete = async () => {
    try {
      await deleteMentor(mentorId);

      toast.success("Mentor deleted successfully.");

      onSuccess();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to delete mentor.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-[#0F172A] p-8 shadow-2xl">
        {/* Header */}
        <h2 className="text-2xl font-bold text-white">Delete Mentor</h2>

        <p className="mt-4 text-slate-300">
          Are you sure you want to delete
          <span className="font-semibold text-red-400"> {mentorName}</span>?
        </p>

        <p className="mt-2 text-sm text-slate-500">
          This action will soft delete the mentor record.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-5 py-2 text-white transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMentorModal;
