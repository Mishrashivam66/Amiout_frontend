import { Users, ClipboardList, CheckCircle2, XCircle } from "lucide-react";

import StatsCards from "./StatsCards";

const DashboardStats = ({ data }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCards
        title="Students"
        value={data?.totalStudents || 0}
        subtitle="Assigned Students"
        icon={Users}
        color="blue"
      />

      <StatsCards
        title="Pending"
        value={data?.pendingOutpasses || 0}
        subtitle="Waiting Approval"
        icon={ClipboardList}
        color="yellow"
      />

      <StatsCards
        title="Approved"
        value={data?.approvedToday || 0}
        subtitle="Approved Today"
        icon={CheckCircle2}
        color="green"
      />

      <StatsCards
        title="Rejected"
        value={data?.rejectedToday || 0}
        subtitle="Rejected Today"
        icon={XCircle}
        color="red"
      />
    </div>
  );
};

export default DashboardStats;
