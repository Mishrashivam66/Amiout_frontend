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
        <FooterCTA />

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
            <FooterBrand />
            <FooterLinks />
          </div>

          {/* ------------------------------------------------ */}
          {/* Project Credits */}
          {/* ------------------------------------------------ */}

          <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
            <h3 className="mb-6 text-2xl font-bold text-white">
              Project Credits
            </h3>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan-400">
                  Project Mentor
                </p>

                <h4 className="mt-2 text-xl font-semibold text-white">
                  Dr. Dinesh Sharma
                </h4>

                <p className="mt-2 text-slate-400">
                  Associate Professor
                  <br />
                  Amity University Madhya Pradesh
                </p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-widest text-cyan-400">
                  Lead Developers
                </p>

                <h4 className="mt-2 text-xl font-semibold text-white">
                  Shivam Kumar
                </h4>

                <p className="text-slate-400">
                  Full Stack Developer & Project Lead
                </p>

                <h4 className="mt-5 text-xl font-semibold text-white">Ayush</h4>

                <p className="text-slate-400">Full Stack Developer</p>
              </div>
            </div>
          </div>
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
