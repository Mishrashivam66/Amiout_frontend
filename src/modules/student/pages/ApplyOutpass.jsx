
import { useNavigate } from "react-router-dom";
import ApplyOutpassForm from "../components/outpass/ApplyOutpassForm";
import useOutpass from "../hooks/useOutpass";
import Swal from "sweetalert2";
const ApplyOutpass = () => {
  const navigate = useNavigate();

  const { loading, submitOutpass } = useOutpass();

  // ==========================================================
  // Today's Date
  // ==========================================================

  const today = new Date().toISOString().split("T")[0];

  // ==========================================================
  // Submit Outpass
  // ==========================================================
  const handleSubmit = async (payload) => {
    const result = await Swal.fire({
      title: "Submit Outpass?",
      text: "Please verify all the details before submitting your outpass request.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Review",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await submitOutpass(payload);

      await Swal.fire({
        icon: "success",
        title: "Outpass Applied!",
        text: "Your outpass request has been submitted successfully.",
        confirmButtonColor: "#16a34a",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/student/history", { replace: true });
    } catch (error) {
      console.error("Apply Outpass Error :", error);
    }
  };

  return (
    <ApplyOutpassForm
      loading={loading}
      onSubmit={handleSubmit}
      defaultValues={{
        outDate: today,
      }}
    />
  );
};

export default ApplyOutpass;
