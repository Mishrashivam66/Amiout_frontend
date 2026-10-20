import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, X } from "lucide-react";

import MentorForm from "./MentorForm";

import { getMentorById, updateMentor } from "../../services/mentor.service";

// ==========================================
// INITIAL FORM DATA
// ==========================================

const INITIAL_FORM_DATA = {
  name: "",
  course: "",
  semester: 1,
  group: "",
  coordinator: "",
  totalStudents: 0,
  isActive: true,
};

// ==========================================
// ERROR MESSAGE HELPER
// ==========================================

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

// ==========================================
// EDIT MENTOR MODAL
// ==========================================

const EditMentorModal = ({ open, mentorId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
  });

  // ========================================
  // FETCH MENTOR DETAILS
  // ========================================

  useEffect(() => {
    if (!open || !mentorId) return;

    let active = true;

    const loadMentor = async () => {
      try {
        const response = await getMentorById(mentorId);

        if (!active) return;

        const mentor = response?.data?.mentor || response?.data || response;

        if (!mentor || typeof mentor !== "object") {
          throw new Error("Invalid mentor details received.");
        }

        setFormData({
          name: mentor.name ?? "",
          course: mentor.course ?? "",
          semester: mentor.semester ?? 1,
          group: mentor.group ?? "",
          coordinator: mentor.coordinator ?? "",
          totalStudents: mentor.totalStudents ?? 0,
          isActive: mentor.isActive ?? true,
        });
      } catch (error) {
        if (!active) return;

        toast.error(getErrorMessage(error, "Failed to load mentor details."), {
          duration: 5000,
          position: "top-center",
        });
      } finally {
        if (active) {
          setFetching(false);
        }
      }
    };

    // Schedule loading state before the API result.
    // Avoid synchronous setState inside the effect.
    Promise.resolve().then(() => {
      if (!active) return;

      setFetching(true);
      loadMentor();
    });

    return () => {
      active = false;
    };
  }, [open, mentorId]);

  // ========================================
  // UPDATE MENTOR
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || fetching || !mentorId) return;

    try {
      setLoading(true);

      await updateMentor(mentorId, formData);

      toast.success("Mentor updated successfully.", {
        duration: 2000,
        position: "top-center",
      });

      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update mentor."), {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // MODAL VISIBILITY
  // ========================================

  if (!open) return null;

  // ========================================
  // MODAL UI
  // ========================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-mentor-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <h2
              id="edit-mentor-title"
              className="text-xl font-bold text-white sm:text-2xl"
            >
              Edit Mentor
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Update mentor information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close edit mentor modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-red-400 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 sm:px-8">
          {fetching ? (
            <div
              role="status"
              className="flex min-h-[240px] flex-col items-center justify-center gap-4"
            >
              <Loader2 size={32} className="animate-spin text-cyan-400" />

              <p className="text-sm text-slate-400">
                Loading mentor details...
              </p>
            </div>
          ) : (
            <MentorForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMentorModal;
