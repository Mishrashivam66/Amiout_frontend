
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const monthlyData = [
  {
    month: "Jan",
    approved: 80,
    pending: 22,
    rejected: 8,
  },
  {
    month: "Feb",
    approved: 92,
    pending: 18,
    rejected: 6,
  },
  {
    month: "Mar",
    approved: 105,
    pending: 15,
    rejected: 9,
  },
  {
    month: "Apr",
    approved: 118,
    pending: 20,
    rejected: 7,
  },
  {
    month: "May",
    approved: 134,
    pending: 16,
    rejected: 5,
  },
  {
    month: "Jun",
    approved: 152,
    pending: 13,
    rejected: 6,
  },
  {
    month: "Jul",
    approved: 170,
    pending: 11,
    rejected: 4,
  },
];

const statusData = [
  {
    name: "Approved",
    value: 170,
    color: "#16A34A",
  },
  {
    name: "Pending",
    value: 28,
    color: "#F59E0B",
  },
  {
    name: "Rejected",
    value: 11,
    color: "#EF4444",
  },
];

// ============================================================================
// Tooltip
// ============================================================================

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className="
        rounded-xl
        border
        border-[#223447]
        bg-[#081018]
        p-4
        shadow-xl
      "
    >
      <p className="mb-2 font-semibold text-white">{label}</p>

      {payload.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-6"
        >
          <span
            className="text-sm"
            style={{
              color: item.color,
            }}
          >
            {item.name}
          </span>

          <span className="font-semibold text-white">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// Component
// ============================================================================

const DashboardChart = () => {
  return (
    <section
      className="
        mt-8
        grid
        grid-cols-1
        gap-6
        xl:grid-cols-3
      "
    >
      {/* ===================================================== */}
      {/* Monthly Analytics */}
      {/* ===================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-[#223447]
          bg-[#122131]
          p-6
          xl:col-span-2
        "
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            Monthly Outpass Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Outpass activity throughout the year
          </p>
        </div>

        <div className="h-90">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid stroke="#223447" strokeDasharray="3 3" />

              <XAxis dataKey="month" stroke="#94A3B8" />

              <YAxis stroke="#94A3B8" />

              <Tooltip content={<CustomTooltip />} />

              <Legend />

              <Line
                type="monotone"
                dataKey="approved"
                stroke="#16A34A"
                strokeWidth={3}
                dot={{
                  r: 5,
                }}
                activeDot={{
                  r: 8,
                }}
              />

              <Line
                type="monotone"
                dataKey="pending"
                stroke="#F59E0B"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="rejected"
                stroke="#EF4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* ===================================================== */}
      {/* Status Distribution */}
      {/* ===================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-[#223447]
          bg-[#122131]
          p-6
        "
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Status Distribution</h2>

          <p className="mt-1 text-sm text-slate-400">
            Current outpass statistics
          </p>
        </div>

        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ============================================== */}
        {/* Legend */}
        {/* ============================================== */}

        <div className="mt-6 space-y-4">
          {statusData.map((item) => (
            <div
              key={item.name}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-[#223447]
                bg-[#081018]
                px-4
                py-3
              "
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="text-sm text-slate-300">{item.name}</span>
              </div>

              <span className="font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardChart;
