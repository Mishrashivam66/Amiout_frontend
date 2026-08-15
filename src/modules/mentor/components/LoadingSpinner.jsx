import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  title = "Loading...",
  description = "Please wait while we fetch your data.",
}) => {
  return (
    <div className="flex min-h-[350px] md:min-h-[500px] items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        {/* Spinner */}

        <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-blue-50">
          <Loader2
            size={36}
            className="animate-spin text-blue-600 md:h-11 md:w-11"
          />
        </div>

        {/* Title */}

        <h2 className="mt-5 text-xl md:text-2xl font-bold text-slate-800">
          {title}
        </h2>

        {/* Description */}

        <p className="mt-2 max-w-xs md:max-w-sm text-sm md:text-base leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
