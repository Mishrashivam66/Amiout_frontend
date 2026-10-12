import { Building2, ShieldCheck, Zap, Users } from "lucide-react";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import DashboardPreview from "./DashboardPreview";
import RoleCards from "./RoleCards";

const facts = [
  {
    icon: Users,
    main: "For Day Scholars",
    sub: "Student-focused platform",
  },
  {
    icon: Building2,
    main: "Multi-Institute",
    sub: "Departments & academic groups",
  },
  {
    icon: Zap,
    main: "Status Tracking",
    sub: "Request updates",
  },
  {
    icon: ShieldCheck,
    main: "Secure QR",
    sub: "Controlled gate verification",
  },
];

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-[#030b1e] text-white"
    >
      <div className="relative min-h-[620px] lg:min-h-[650px]">
        <HeroBackground />

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1600px] items-center px-5 pb-12 pt-28 sm:px-8 lg:min-h-[650px] lg:px-8 xl:px-10">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[38%_62%]">
            <HeroContent />

            <DashboardPreview />
          </div>
        </div>
      </div>

      {/* Statistics strip */}
      <div className="relative z-20 mx-auto mb-7 grid max-w-[1150px] grid-cols-2 overflow-hidden rounded-3xl border border-blue-500/35 bg-[#07142b]/85 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(({ icon: Icon, main, sub }) => (
          <div
            key={main}
            className="flex items-center gap-3 border-b border-white/10 px-4 py-5 lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <div className="rounded-full bg-cyan-500/10 p-3 text-cyan-300">
              <Icon size={22} />
            </div>

            <div>
              <p className="text-sm font-bold text-white">{main}</p>
              <p className="text-xs text-slate-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <RoleCards />
    </section>
  );
};

export default HeroSection;
