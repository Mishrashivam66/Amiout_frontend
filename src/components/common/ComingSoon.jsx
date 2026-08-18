import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-10 md:p-14 shadow-2xl">
        {/* Icon */}
        <div className="text-7xl md:text-8xl mb-6">🚀</div>

        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-500/10 border border-blue-400/30">
          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>

          <span className="text-blue-300 text-sm font-semibold tracking-wider uppercase">
            Under Development
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5">
          Coming{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Soon
          </span>
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
          We're currently working on this page.
          <br className="hidden md:block" />
          Something exciting is coming your way soon.
        </p>

        {/* Divider */}
        <div className="w-28 h-1 mx-auto my-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"></div>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          ← Back to Home
        </button>

        {/* Bottom text */}
        <p className="mt-8 text-sm text-slate-500">
          Stay tuned. We're almost there.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
