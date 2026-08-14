
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

const DashboardStats = ({ dashboard }) => {
  const stats = [
    {
      title: "Total Students",
      value: dashboard?.totalStudents || 0,
      icon: FaUsers,
      color: "green",
      percentage: "+12%",
      description: "Registered Students",
    },

    {
      title: "Total Mentors",
      value: dashboard?.totalMentors || 0,
      icon: FaUserGraduate,
      color: "blue",
      percentage: "+4%",
      description: "Active Mentors",
    },

    {
      title: "Groups",
      value: dashboard?.totalGroups || 0,
      icon: FaLayerGroup,
      color: "purple",
      percentage: "+2%",
      description: "Mentor Groups",
    },

    {
      title: "Outpasses",
      value: dashboard?.totalOutpasses || 0,
      icon: FaClipboardList,
      color: "cyan",
      percentage: "+18%",
      description: "Total Requests",
    },

    {
      title: "Pending",
      value: dashboard?.pendingOutpasses || 0,
      icon: FaUserShield,
      color: "orange",
      percentage: "Live",
      description: "Awaiting Approval",
    },

    {
      title: "Approved",
      value: dashboard?.approvedOutpasses || 0,
      icon: FaCheckCircle,
      color: "green",
      percentage: "Today",
      description: "Approved Requests",
    },

    {
      title: "Rejected",
      value: dashboard?.rejectedOutpasses || 0,
      icon: FaTimesCircle,
      color: "red",
      percentage: "Latest",
      description: "Rejected Requests",
    },

    {
      title: "Outside Campus",
      value: dashboard?.outsideCampus || 0,
      icon: FaDoorOpen,
      color: "blue",
      percentage: "Live",
      description: "Students Outside",
    },
  ];

  return (
    <section className="w-full">
      {/* ====================================================== */}
      {/* Heading */}
      {/* ====================================================== */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>

        <p className="mt-2 text-sm text-slate-400">
          Real-time overview of AMIOUT activities.
        </p>
      </div>

      {/* ====================================================== */}
      {/* Grid */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            percentage={item.percentage}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardStats;
