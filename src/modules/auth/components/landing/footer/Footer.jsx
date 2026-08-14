// ============================================================
// AMIOUT Enterprise Edition
// Footer.jsx
// ============================================================

import FooterCTA from "./FooterCTA";
import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterBottom from "./FooterBottom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950">
      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[140px]" />

      <div className="relative z-10">
        {/* CTA */}

        <FooterCTA />

        {/* Main Footer */}

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
            <FooterBrand />

            <FooterLinks />
          </div>
        </div>

        {/* Bottom */}

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
