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
    <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4 md:px-6 md:py-5">
        <h2 className="text-lg md:text-xl font-bold text-slate-800">
          Today's Summary
        </h2>

        <p className="mt-1 text-xs md:text-sm text-slate-500">
          Quick overview of today's mentor activity.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4 md:p-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-4
                md:p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:shadow-lg
              "
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-2 text-2xl md:text-3xl font-bold text-slate-800">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    md:h-14
                    md:w-14
                    items-center
                    justify-center
                    rounded-xl
                    md:rounded-2xl
                    ${card.bg}
                  `}
                >
                  <Icon size={24} className={card.color} />
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
