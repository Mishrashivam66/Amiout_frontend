import { CalendarDays, RefreshCw, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const DashboardHeader = ({ onRefresh }) => {
  const [time, setTime] = useState(new Date());
  const { user } = useAuth();
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentDate = time.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-r
        from-blue-700
        via-indigo-700
        to-purple-700
        p-8
        text-white
        shadow-xl
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <h1 className="text-4xl font-bold">Mentor Dashboard</h1>

          <p className="mt-2 text-blue-100 text-lg">
            Welcome back to the AMIOUT Smart Outpass System
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} />
              <span>{currentDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={18} />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              bg-white/20
              px-5
              py-3
              font-semibold
              backdrop-blur-md
              transition
              hover:bg-white/30
            "
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome, {user?.name || "Mentor"} 👋
            </h1>

            <p className="mt-2 text-blue-100 text-base md:text-lg">
              Manage student outpasses, approve requests and monitor activities
              from one place.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                <span>{currentDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={18} />
                <span>{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <button
            onClick={onRefresh}
            className="
      flex
      items-center
      gap-2
      rounded-2xl
      bg-white/20
      px-5
      py-3
      font-semibold
      backdrop-blur-md
      transition
      hover:bg-white/30
    "
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
