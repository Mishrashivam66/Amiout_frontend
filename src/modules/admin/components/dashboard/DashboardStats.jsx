import {
  FaCheckCircle,
  FaClipboardList,
  FaDoorOpen,
  FaLayerGroup,
  FaTimesCircle,
  FaUserGraduate,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";

import StatCard from "./StatCard";

// ============================================================
// AMIOUT ENTERPRISE - LIVE ADMIN STATISTICS
//
// Source: GET /api/v1/admin/dashboard
//
// Does not display fabricated growth percentages.
// Does not silently convert missing API fields into zero.
// ============================================================

const DashboardStats = ({ dashboard }) => {
  const stats = [
    {
      title: "Total Students",
      value: dashboard?.students?.total,
      icon: FaUsers,
      color: "green",
      description: "Student records",
    },
    {
      title: "Total Mentors",
      value: dashboard?.mentors?.total,
      icon: FaUserGraduate,
      color: "blue",
      description: "Mentor records",
    },
    {
      title: "Groups",
      value: dashboard?.groups?.total,
      icon: FaLayerGroup,
      color: "purple",
      description: "Academic mentor groups",
    },
    {
      title: "Total Outpasses",
      value: dashboard?.outpasses?.total,
      icon: FaClipboardList,
      color: "cyan",
      description: "Outpass requests",
    },
    {
      title: "Pending",
      value: dashboard?.outpasses?.pending,
      icon: FaUserShield,
      color: "orange",
      description: "Awaiting approval",
    },
    {
      title: "Approved",
      value: dashboard?.outpasses?.approved,
      icon: FaCheckCircle,
      color: "green",
      description: "Approved outpasses",
    },
    {
      title: "Rejected",
      value: dashboard?.outpasses?.rejected,
      icon: FaTimesCircle,
      color: "red",
      description: "Rejected outpasses",
    },
    {
      title: "Returned",
      value: dashboard?.outpasses?.returned,
      icon: FaDoorOpen,
      color: "blue",
      description: "Completed return cycles",
    },
  ];

  return (
    <section className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Dashboard Overview</h2>

        <p className="mt-2 text-sm text-slate-400">
          Database-backed overview of AMIOUT activities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardStats;
