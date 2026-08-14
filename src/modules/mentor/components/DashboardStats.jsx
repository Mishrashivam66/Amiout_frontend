
import { ClipboardList, Clock3, CheckCircle2, XCircle } from "lucide-react";

import StatsCards from "./StatsCards";

const DashboardStats = ({ data }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCards
        title="Total Requests"
        value={data?.total || 0}
        subtitle="All Outpass Requests"
        icon={ClipboardList}
        color="blue"
      />

      <StatsCards
        title="Pending"
        value={data?.pending || 0}
        subtitle="Awaiting Approval"
        icon={Clock3}
        color="yellow"
      />

      <StatsCards
        title="Approved"
        value={data?.approved || 0}
        subtitle="Successfully Approved"
        icon={CheckCircle2}
        color="green"
      />

      <StatsCards
        title="Rejected"
        value={data?.rejected || 0}
        subtitle="Rejected Requests"
        icon={XCircle}
        color="red"
      />
    </div>
  );
};

export default DashboardStats;
