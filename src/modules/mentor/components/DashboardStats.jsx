import { Users, ClipboardList, CheckCircle2, XCircle } from "lucide-react";

const DashboardStats = ({ data }) => {
  const stats = [
    {
      title: "Students",
      value: data?.totalStudents || 0,
      subtitle: "Assigned Students",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending",
      value: data?.pendingOutpasses || 0,
      subtitle: "Waiting Approval",
      icon: ClipboardList,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Approved",
      value: data?.approvedToday || 0,
      subtitle: "Approved Today",
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Rejected",
      value: data?.rejectedToday || 0,
      subtitle: "Rejected Today",
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>

                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {item.value}
                </h3>

                <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg}`}
              >
                <Icon size={28} className={item.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
