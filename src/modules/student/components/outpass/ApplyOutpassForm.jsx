import { useState } from "react";
import { toast } from "react-toastify";

const ApplyOutpassForm = ({ onSubmit, loading }) => {
  // ==========================================================
  // Current Date
  // ==========================================================

  const today = new Date().toISOString().split("T")[0];

  // ==========================================================
  // Form State
  // ==========================================================

  const [formData, setFormData] = useState({
    reason: "",
    destination: "",
    outDate: today,
    outTime: "",
    expectedReturn: "",
  });

  // ==========================================================
  // Handle Input Change
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Sunday Validation
    if (name === "outDate") {
      const selectedDay = new Date(value).getDay();

      if (selectedDay === 0) {
        toast.error("Outpass is not allowed on Sunday.");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // Validation
  // ==========================================================

  const validateForm = () => {
    if (
      !formData.reason.trim() ||
      !formData.destination.trim() ||
      !formData.outDate ||
      !formData.outTime ||
      !formData.expectedReturn
    ) {
      toast.error("Please fill all required fields.");
      return false;
    }

    return true;
  };

  // ==========================================================
  // Submit
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setFormData({
        reason: "",
        destination: "",
        outDate: today,
        outTime: "",
        expectedReturn: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit outpass.");
    }
  };
  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-slate-800">Apply Outpass</h1>

      <p className="mt-2 text-slate-500">
        Fill all the required details before submitting your outpass request.
      </p>

      {/* Rules */}

      <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
        <h3 className="font-semibold text-amber-800">Important Rules</h3>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-700">
          <li>Outpass is not allowed on Sunday.</li>
          <li>Application timing : 10:00 AM to 02:00 PM.</li>
          <li>Return time should be after Out Time.</li>
          <li>Select HOME if you will not return today.</li>
          <li>Carry approved QR Outpass while exiting hostel.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Reason */}

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Reason <span className="text-red-500">*</span>
          </label>

          <textarea
            rows={4}
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            maxLength={100}
            placeholder="Enter the reason for leaving the hostel..."
            className="
      w-full
      rounded-xl
      border
      border-slate-300
      p-3
      outline-none
      resize-none
      transition-all
      duration-200
      focus:border-green-500
      focus:ring-2
      focus:ring-green-500
    "
          />

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Reason must be between <strong>10</strong> and{" "}
              <strong>100</strong> characters.
            </p>

            <span
              className={`text-xs font-medium ${
                formData.reason.length >= 90 ? "text-red-500" : "text-slate-500"
              }`}
            >
              {formData.reason.length}/100
            </span>
          </div>
        </div>

        {/* Destination */}

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Destination <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Enter destination"
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              p-3
              outline-none
              focus:border-green-500
              focus:ring-2
              focus:ring-green-500
            "
          />
        </div>

        {/* Date & Out Time */}

        <div className="grid gap-5 md:grid-cols-2">
          {/* Out Date */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Out Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              name="outDate"
              value={formData.outDate}
              min={today}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                p-3
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500
              "
            />
          </div>

          {/* Out Time */}

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Out Time <span className="text-red-500">*</span>
            </label>

            <select
              name="outTime"
              value={formData.outTime}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                p-3
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500
              "
            >
              <option value="">Select Out Time</option>

              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
            </select>
          </div>
        </div>
        {/* Expected Return */}

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Expected Return <span className="text-red-500">*</span>
          </label>

          <select
            name="expectedReturn"
            value={formData.expectedReturn}
            onChange={handleChange}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              p-3
              outline-none
              focus:border-green-500
              focus:ring-2
              focus:ring-green-500
            "
          >
            <option value="">Select Expected Return</option>

            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="01:00 PM">01:00 PM</option>
            <option value="02:00 PM">02:00 PM</option>

            <option value="HOME">Home (Will Not Return Today)</option>
          </select>

          <p className="mt-2 text-xs text-slate-500">
            Select <strong>HOME</strong> if you are going home and will not
            return to the hostel today.
          </p>
        </div>

        {/* Submit Button */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-green-600
            py-3
            font-semibold
            text-white
            transition
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:bg-gray-400
          "
        >
          {loading ? "Submitting..." : "Apply Outpass"}
        </button>
      </form>
    </div>
  );
};

export default ApplyOutpassForm;
