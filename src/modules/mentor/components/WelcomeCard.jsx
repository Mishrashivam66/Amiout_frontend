import { CalendarDays, Sparkles } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const WelcomeCard = () => {
  const { user } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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
        to-violet-700
        p-8
        text-white
        shadow-2xl
      "
    >
      {/* Background Blur */}
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        {/* Left */}
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-md">
            <Sparkles size={16} />
            Mentor Dashboard
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">
            {greeting()}, {user?.name || "Mentor"} 👋
          </h1>

          <p className="mt-4 max-w-2xl text-blue-100 leading-7">
            Welcome back to the <strong>AMIOUT Smart Outpass System</strong>.
            Review pending outpass requests, manage your students, and keep
            hostel approvals organized from one place.
          </p>
        </div>

        {/* Right */}
        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-xl border border-white/20">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-yellow-300" size={26} />

            <div>
              <p className="text-sm text-blue-100">Today's Date</p>

              <h3 className="text-lg font-semibold">{today}</h3>
            </div>
          </div>

          <div className="mt-6 h-px bg-white/20" />

          <div className="mt-5 grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">24×7</p>

              <span className="text-sm text-blue-100">Portal Available</span>
            </div>

            <div>
              <p className="text-3xl font-bold">100%</p>

              <span className="text-sm text-blue-100">Secure Workflow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
