// ============================================================
// AMIOUT Enterprise Edition
// HeroSection.jsx
// Laptop Optimized Hero Container
// ============================================================

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import DashboardPreview from "./DashboardPreview";
import FloatingCards from "./FloatingCards";
import ScrollIndicator from "./ScrollIndicator";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-slate-950"
    >
      {/* Background */}
      <HeroBackground />

      {/* Main Hero */}

      <div className="relative z-20 mx-auto flex min-h-screen max-w-[1700px] items-center px-6 pt-28 pb-20 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid w-full items-center gap-8 xl:grid-cols-[42%_58%] xl:gap-12">
          {/* ====================================== */}
          {/* Left Content */}
          {/* ====================================== */}

          <div className="relative z-20">
            <HeroContent />
          </div>

          {/* ====================================== */}
          {/* Right Dashboard */}
          {/* ====================================== */}

          <div className="relative flex items-center justify-center">
            <DashboardPreview />

            <FloatingCards />
          </div>
        </div>
      </div>

      {/* Scroll */}

      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
