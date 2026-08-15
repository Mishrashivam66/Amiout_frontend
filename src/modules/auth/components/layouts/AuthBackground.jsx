// ============================================================
// AMIOUT Enterprise Edition
// Auth Background Layout
// ============================================================

const AuthBackground = ({ children }) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* ====================================================== */}
      {/* Background Gradient */}
      {/* ====================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* ====================================================== */}
      {/* Grid Pattern */}
      {/* ====================================================== */}

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ====================================================== */}
      {/* Background Watermark */}
      {/* ====================================================== */}

      <h1 className="pointer-events-none absolute inset-0 flex items-center justify-center select-none text-[26vw] font-black uppercase tracking-[0.18em] text-white/[0.025] sm:text-[22vw] lg:text-[18vw]">
        AMIOUT
      </h1>

      {/* ====================================================== */}
      {/* Glow Effects */}
      {/* ====================================================== */}

      <div className="absolute -left-52 top-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[170px]" />

      <div className="absolute -right-52 bottom-0 h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[170px]" />

      {/* ====================================================== */}
      {/* Page Content */}
      {/* ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
};

export default AuthBackground;
