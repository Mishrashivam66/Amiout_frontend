import {
  CalendarDays,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const TodaySummary = ({
  summary = {
    todayRequests: 0,
    approvedToday: 0,
    rejectedToday: 0,
  },
}) => {
  const cards = [
    {
      title: "Today's Requests",
      value: summary.todayRequests || 0,
      icon: CalendarDays,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Approved Today",
      value: summary.approvedToday || 0,
      icon: CheckCircle2,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Rejected Today",
      value: summary.rejectedToday || 0,
      icon: XCircle,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Pending Review",
      value:
        (summary.todayRequests || 0) -
        (summary.approvedToday || 0) -
        (summary.rejectedToday || 0),
      icon: ClipboardCheck,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800">Today's Summary</h2>

        <p className="mt-1 text-sm text-slate-500">
          Quick overview of today's mentor activity.
        </p>
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>

                  <h3 className="mt-3 text-3xl font-bold text-slate-800">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
                >
                  <Icon size={28} className={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaySummary;
