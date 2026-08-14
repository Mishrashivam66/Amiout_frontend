import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  XCircle,
  User,
  Users,
  MapPin,
  CalendarDays,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import Swal from "sweetalert2";

import PageHeader from "../components/layout/PageHeader";
import useOutpass from "../hooks/useOutpass";

const OutpassDetails = () => {
  const { outpassId } = useParams();

  const navigate = useNavigate();

  const { loading, fetchOutpassDetails, cancelOutpass } = useOutpass();

  const [outpass, setOutpass] = useState(null);

  // ==========================================================
  // Load Outpass
  // ==========================================================

  const loadOutpass = useCallback(async () => {
    try {
      const response = await fetchOutpassDetails(outpassId);

      if (response.success) {
        setOutpass(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [outpassId, fetchOutpassDetails]);

  useEffect(() => {
    loadOutpass();
  }, [loadOutpass]);

  // ==========================================================
  // Cancel Outpass
  // ==========================================================

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Cancel Outpass?",
      text: "Are you sure you want to cancel this outpass?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await cancelOutpass(outpassId);

      if (response?.success) {
        await Swal.fire({
          icon: "success",
          title: "Cancelled!",
          text: "Your outpass has been cancelled successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/student/outpass/history");
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to cancel outpass.",
      });
    }
  };

  // ==========================================================
  // Status Badge Color
  // ==========================================================

  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    EXITED: "bg-blue-100 text-blue-700",
    RETURNED: "bg-purple-100 text-purple-700",
  };

  // ==========================================================
  // Loading
  // ==========================================================

  if (loading || !outpass) {
    return (
      <div className="space-y-6">
        <div className="h-20 rounded-3xl bg-slate-200 animate-pulse" />

        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outpass Details"
        subtitle="View complete outpass information"
      />

      {/* Part 2 Starts Here */}
      {/* ========================================================== */}
      {/* Header Card */}
      {/* ========================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Outpass #{outpass.outpassId}
            </h2>

            <p className="mt-2 text-slate-500">
              Complete details of your outpass request
            </p>
          </div>

          <span
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              statusColor[outpass.status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {outpass.status}
          </span>
        </div>
      </div>

      {/* ========================================================== */}
      {/* Student & Parent Information */}
      {/* ========================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3">
              <User className="text-green-700" size={22} />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Student Information
            </h3>
          </div>

          <div className="space-y-3 text-slate-700">
            <p>
              <strong>Name :</strong> {outpass.studentName}
            </p>

            <p>
              <strong>Enrollment :</strong> {outpass.enrollmentNumber}
            </p>

            <p>
              <strong>Branch :</strong> {outpass.branch}
            </p>

            <p>
              <strong>Semester :</strong> {outpass.semester}
            </p>
          </div>
        </div>

        {/* Parent */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <Users className="text-blue-700" size={22} />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Parent Information
            </h3>
          </div>

          <div className="space-y-3 text-slate-700">
            <p>
              <strong>Name :</strong> {outpass.parentName}
            </p>

            <p>
              <strong>Email :</strong> {outpass.parentEmail}
            </p>

            <p>
              <strong>Mobile :</strong> {outpass.parentMobileNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Part 3 Starts Here */}
      {/* ========================================================== */}
      {/* Leave Details */}
      {/* ========================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3">
            <MapPin className="text-emerald-700" size={22} />
          </div>

          <h3 className="text-xl font-bold text-slate-800">Leave Details</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Destination</p>

            <p className="mt-1 font-semibold text-slate-800">
              {outpass.destination}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Reason</p>

            <p className="mt-1 font-semibold text-slate-800">
              {outpass.reason}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-green-600" />

              <p className="text-sm text-slate-500">Out Date</p>
            </div>

            <p className="mt-1 font-semibold text-slate-800">
              {new Date(outpass.outDate).toLocaleDateString("en-IN")}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Clock3 size={18} className="text-green-600" />

              <p className="text-sm text-slate-500">Out Time</p>
            </div>

            <p className="mt-1 font-semibold text-slate-800">
              {outpass.outTime}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-600" />

              <p className="text-sm text-slate-500">Expected Return</p>
            </div>

            <p className="mt-1 font-semibold text-slate-800">
              {new Date(outpass.expectedReturn).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* QR Code */}
      {/* ========================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-green-100 p-3">
            <ShieldCheck className="text-green-700" size={22} />
          </div>

          <h3 className="text-xl font-bold text-slate-800">
            Gate Exit Verification
          </h3>
        </div>

        {outpass.status === "APPROVED" ? (
          <div className="flex flex-col items-center">
            <div className="mb-6 rounded-full bg-green-100 p-5">
              <ShieldCheck size={70} className="text-green-700" />
            </div>

            <h4 className="text-xl font-bold text-slate-800">
              Outpass Approved
            </h4>

            <p className="mt-3 max-w-md text-center text-sm leading-6 text-slate-600">
              Your outpass has been approved by the mentor. Before leaving the
              campus, this outpass must be verified at the main gate.
            </p>

            <button className="mt-8 rounded-xl bg-green-600 px-10 py-3 font-semibold text-white transition hover:bg-green-700">
              ✅ OK
            </button>

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-semibold text-red-700">
                ⚠ Student is NOT allowed to click this button.
              </p>

              <p className="mt-2 text-sm text-red-600">
                This button is strictly for verification by the Security Guard
                at the Main Gate. Unauthorized use is prohibited. Students must
                never leave the campus without security verification.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-100 p-8 text-center">
            <ShieldCheck size={60} className="mx-auto mb-4 text-slate-400" />

            <p className="font-medium text-slate-600">
              Gate verification will be available after your outpass is approved
              by the mentor.
            </p>
          </div>
        )}
      </div>

      {/* Part 4 Starts Here */}
      {/* ========================================================== */}
      {/* Timeline */}
      {/* ========================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold text-slate-800">Timeline</h3>

        {outpass.timeline?.length ? (
          <div className="space-y-4">
            {outpass.timeline.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">{item.title}</h4>

                  <span className="text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="mt-2 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-8 text-center">
            <p className="text-slate-500">No timeline available.</p>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* Action Buttons */}
      {/* ========================================================== */}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {outpass.status === "PENDING" && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            <XCircle size={18} />
            Cancel Outpass
          </button>
        )}
      </div>
    </div>
  );
};

export default OutpassDetails;
