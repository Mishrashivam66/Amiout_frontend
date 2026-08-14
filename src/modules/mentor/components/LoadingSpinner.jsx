
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  title = "Loading...",
  description = "Please wait while we fetch your data.",
}) => {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Spinner */}

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <Loader2 size={44} className="animate-spin text-blue-600" />
        </div>

        {/* Title */}

        <h2 className="mt-6 text-2xl font-bold text-slate-800">{title}</h2>

        {/* Description */}

        <p className="mt-2 max-w-sm text-center text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
