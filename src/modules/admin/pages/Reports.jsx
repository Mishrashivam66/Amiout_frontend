import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import { getOutpassSummary } from "../services/report.service";

const Reports = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const loadSummary = async () => {
    try {
      setLoading(true);

      const res = await getOutpassSummary();

      setSummary({
        total: res.data.total || 0,
        approved: res.data.approved || 0,
        pending: res.data.pending || 0,
        rejected: res.data.rejected || 0,
      });
    } catch (error) {
      toast.error("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const reportCards = [
    {
      title: "Total Outpasses",
      value: summary.total,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Approved",
      value: summary.approved,
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: summary.pending,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Rejected",
      value: summary.rejected,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Reports</h1>

          <p className="mt-2 text-slate-400">Outpass reporting dashboard.</p>
        </div>

        <button
          onClick={loadSummary}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.title}</p>

                  <h2 className="mt-2 text-4xl font-bold text-white">
                    {loading ? "--" : card.value}
                  </h2>
                </div>

                <div className={`${card.color} rounded-2xl p-4 text-white`}>
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reports */}

      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-blue-400" size={30} />

          <div>
            <h2 className="text-2xl font-bold text-white">Outpass Reports</h2>

            <p className="text-slate-400">
              Report APIs are ready. Export functionality will be connected
              later.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white">All Outpasses</h3>

            <p className="mt-2 text-sm text-slate-400">
              Total Records : {summary.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white">
              Status Wise Report
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Approved : {summary.approved}
            </p>

            <p className="text-sm text-slate-400">
              Pending : {summary.pending}
            </p>

            <p className="text-sm text-slate-400">
              Rejected : {summary.rejected}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white">Student Report</h3>

            <p className="mt-2 text-sm text-slate-400">
              Student-wise report API available.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
        <Users size={42} className="mx-auto text-slate-500" />

        <h2 className="mt-4 text-2xl font-bold text-white">Reports Module</h2>

        <p className="mt-2 text-slate-400">
          Summary statistics are now connected with backend. Export (PDF / Excel
          / CSV) can be added later.
        </p>
      </div>
    </div>
  );
};

export default Reports;
