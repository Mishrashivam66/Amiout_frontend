import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import mentorService from "../services/mentor.service";
import { toast } from "react-toastify";
const OutpassDetails = () => {
  const { outpassId } = useParams();

  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOutpass = useCallback(async () => {
    try {
      setLoading(true);

      const response = await mentorService.getOutpassDetails(outpassId);

      setOutpass(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load outpass details.",
      );
    } finally {
      setLoading(false);
    }
  }, [outpassId]);

  useEffect(() => {
    loadOutpass();
  }, [loadOutpass]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Loading outpass details...
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="py-20 text-center text-red-500 font-medium">
        Outpass not found.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outpass Details</h1>

          <p className="text-slate-500 mt-2">
            Complete information of the selected outpass.
          </p>
        </div>

        <Link
          to="/mentor/pending-outpasses"
          className="flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-white"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border p-6">
          <h2 className="font-bold text-lg mb-4">Student Information</h2>

          <div className="space-y-3">
            <p>
              <strong>Name :</strong> {outpass.student?.name}
            </p>

            <p>
              <strong>Enrollment :</strong> {outpass.student?.enrollmentNo}
            </p>

            <p>
              <strong>Email :</strong> {outpass.student?.email}
            </p>

            <p>
              <strong>Mobile :</strong> {outpass.student?.mobileNumber}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border p-6">
          <h2 className="font-bold text-lg mb-4">Outpass Information</h2>

          <div className="space-y-3">
            <p>
              <strong>Outpass ID :</strong> {outpass.outpassId}
            </p>

            <p>
              <strong>Destination :</strong> {outpass.destination}
            </p>

            <p>
              <strong>Reason :</strong> {outpass.reason}
            </p>

            <p>
              <strong>Status :</strong> {outpass.status}
            </p>

            <p>
              <strong>From :</strong>{" "}
              {new Date(outpass.fromDate).toLocaleString()}
            </p>

            <p>
              <strong>To :</strong> {new Date(outpass.toDate).toLocaleString()}
            </p>

            <p>
              <strong>Created :</strong>{" "}
              {new Date(outpass.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border p-6">
        <h2 className="font-bold text-lg mb-4">Mentor Remark</h2>

        <p className="text-slate-700">
          {outpass.mentorRemark || "No remark available."}
        </p>
      </div>
    </div>
  );
};

export default OutpassDetails;
