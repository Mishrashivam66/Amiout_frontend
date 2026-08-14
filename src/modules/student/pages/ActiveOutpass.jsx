import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Clock, MapPin, FileText, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
const ActiveOutpass = () => {
  const [loading, setLoading] = useState(true);
  const [outpass, setOutpass] = useState(null);

  const fetchActiveOutpass = async () => {
    try {
      const { data } = await api.get("/outpass/active");

      setOutpass(data?.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load active outpass.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchActiveOutpass();
  }, []);
  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading Active Outpass...
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="rounded-2xl bg-white p-10 shadow">
        <h2 className="text-2xl font-bold text-slate-800">Active Outpass</h2>

        <div className="mt-10 text-center text-slate-500">
          No Active Outpass Found
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Outpass</h2>

        <span className="rounded-full bg-blue-100 px-4 py-1 text-blue-700 font-semibold">
          {outpass.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex gap-3">
          <FileText />
          <div>
            <p className="text-sm text-slate-500">Outpass ID</p>
            <p className="font-semibold">{outpass.outpassId}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <MapPin />
          <div>
            <p className="text-sm text-slate-500">Destination</p>
            <p className="font-semibold">{outpass.destination}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Calendar />
          <div>
            <p className="text-sm text-slate-500">Out Date</p>
            <p>{outpass.outDate}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Clock />
          <div>
            <p className="text-sm text-slate-500">Out Time</p>
            <p>{outpass.outTime}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Clock />
          <div>
            <p className="text-sm text-slate-500">Expected Return</p>
            <p>{outpass.expectedReturn}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-500 mb-2">Reason</p>

        <div className="rounded-lg bg-slate-100 p-4">{outpass.reason}</div>
      </div>

      {outpass.qrCode && (
        <div className="text-center">
          <img src={outpass.qrCode} alt="QR Code" className="mx-auto w-52" />
        </div>
      )}
    </div>
  );
};

export default ActiveOutpass;
