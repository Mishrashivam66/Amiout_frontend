import Navbar from "../components/landing/navbar/Navbar";
import HeroSection from "../components/landing/hero/HeroSection";
import FeaturesSection from "../components/landing/features/FeaturesSection";
import ScreenshotSection from "../components/landing/screenshots/ScreenshotSection";
import WhySection from "../components/landing/why/WhySection";
import ContactSection from "../components/landing/contact/ContactSection";
import Footer from "../components/landing/footer/Footer";

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-slate-950 text-white">
        <HeroSection />

        <FeaturesSection />

        <ScreenshotSection />

        <WhySection />

        <ContactSection />

        <Footer />
      </main>
    </>
  );
};

export default LandingPage;
