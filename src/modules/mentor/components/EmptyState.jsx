import { Inbox, RefreshCw } from "lucide-react";

const EmptyState = ({
  title = "No Data Available",
  description = "There is nothing to display right now. Once students submit outpass requests, they will appear here.",
  buttonText = "Refresh",
  onRefresh,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 md:p-10 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-blue-50">
          <Inbox size={36} className="text-blue-600 md:h-11 md:w-11" />
        </div>

        <h2 className="mt-5 text-xl md:text-2xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-sm md:text-base text-slate-500 leading-relaxed">
          {description}
        </p>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="
              mt-6
              inline-flex
              w-full
              sm:w-auto
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-blue-600
              px-6
              py-3
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-blue-700
              hover:shadow-lg
            "
          >
            <RefreshCw size={18} />
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
