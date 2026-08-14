
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

const DashboardChart = ({ data }) => {

  const weeklyData = [
    { day: "Mon", value: 8 },
    { day: "Tue", value: 14 },
    { day: "Wed", value: 11 },
    { day: "Thu", value: 18 },
    { day: "Fri", value: 10 },
    { day: "Sat", value: 6 },
    { day: "Sun", value: 4 },
  ];

  const pieData = [
    {
      name: "Approved",
      value: data?.approvedToday || 0,
    },
    {
      name: "Pending",
      value: data?.pendingOutpasses || 0,
    },
    {
      name: "Rejected",
      value: data?.rejectedToday || 0,
    },
  ];

  const COLORS = [
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-2">

      {/* ================= Bar Chart ================= */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">
            <BarChart3
              size={24}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Weekly Outpasses
            </h2>

            <p className="text-sm text-slate-500">
              Outpass trend this week
            </p>
          </div>

        </div>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <BarChart
            data={weeklyData}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[10, 10, 0, 0]}
              fill="#2563eb"
            />
          </BarChart>
        </ResponsiveContainer>

      </div>
            {/* ================= Pie Chart ================= */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-emerald-100 p-3">
            <PieChartIcon
              size={24}
              className="text-emerald-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Outpass Status
            </h2>

            <p className="text-sm text-slate-500">
              Current approval distribution
            </p>
          </div>

        </div>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default DashboardChart;