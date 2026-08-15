// ============================================================
// HeroSection.jsx
// Modern Hero Section
// ============================================================

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import DashboardPreview from "./DashboardPreview";

const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950">
      {/* Background */}
      <HeroBackground />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-28 lg:px-8">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <HeroContent />

          {/* Right */}
          <div className="flex justify-center lg:justify-end">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
