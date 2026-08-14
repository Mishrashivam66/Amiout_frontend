import React from "react";

const colors = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",

  APPROVED: "bg-green-100 text-green-700 border-green-300",

  REJECTED: "bg-red-100 text-red-700 border-red-300",

  CANCELLED: "bg-gray-100 text-gray-700 border-gray-300",

  EXITED: "bg-blue-100 text-blue-700 border-blue-300",

  RETURNED: "bg-purple-100 text-purple-700 border-purple-300",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        colors[status] || "bg-slate-100 text-slate-700 border-slate-300"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
