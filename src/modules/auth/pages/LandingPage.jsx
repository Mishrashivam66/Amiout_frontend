import Navbar from "../components/landing/navbar/Navbar";
import HeroSection from "../components/landing/hero/HeroSection";
import TrustedSection from "../components/landing/trusted/TrustedSection";
import ModulesSection from "../components/landing/modules/ModulesSection";
import TechnologySection from "../components/landing/technology/TechnologySection";
import SecuritySection from "../components/landing/security/SecuritySection";
import SystemStatusSection from "../components/landing/systemStatus/SystemStatusSection";
import FAQSection from "../components/landing/faq/FAQSection";
import TestimonialsSection from "../components/landing/testimonials/TestimonialsSection";
import RoadmapSection from "../components/landing/roadmap/RoadmapSection";
import DeveloperSection from "../components/landing/developer/DeveloperSection";
import ContactSection from "../components/landing/contact/ContactSection";
import Footer from "../components/landing/footer/Footer";
const LandingPage = () => {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-slate-950 text-white">
        {/* Hero */}
        <HeroSection />

        {/* Trusted Universities */}
        <TrustedSection />

        {/* Platform Modules */}
        <ModulesSection />

        {/* Technology Stack */}
        <TechnologySection />

        {/* Security */}
        <SecuritySection />

        {/* Live System Status */}
        <SystemStatusSection />

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Development Roadmap */}

        <RoadmapSection />

        {/* Developer Contributions */}
        <DeveloperSection />

        {/* Contact */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
};

export default LandingPage;
