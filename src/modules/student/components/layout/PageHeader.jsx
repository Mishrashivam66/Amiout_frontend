// ==========================================
// Project : AMIOUT
// Module  : Student
// File    : PageHeader.jsx
// ==========================================

import { ArrowRight } from "lucide-react";

const PageHeader = ({ title, subtitle, actionText, onAction }) => {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-2xl
        bg-white
        p-6
        shadow-sm
        border
        border-slate-200
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* Left */}

      <div>
        <h1
          className="
            text-2xl
            font-bold
            text-slate-800
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          {subtitle}
        </p>
      </div>

      {/* Action Button */}

      {actionText && (
        <button
          onClick={onAction}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-600
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-green-700
          "
        >
          {actionText}

          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
};

export default PageHeader;
