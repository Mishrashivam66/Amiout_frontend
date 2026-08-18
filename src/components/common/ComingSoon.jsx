import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gradient-to-br
        from-slate-950
        via-blue-950
        to-emerald-950
        px-4
      "
    >
      <div
        className="
          max-w-xl w-full
          text-center
          bg-slate-900/80
          border border-blue-500/30
          rounded-3xl
          p-10
          shadow-2xl
        "
      >
        {/* Icon */}
        <div className="text-7xl mb-6">
          🚀
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-white mb-4">
          Coming Soon
        </h1>

        {/* Blue + Green line */}
        <div
          className="
            w-32 h-1
            mx-auto mb-6
            rounded-full
            bg-gradient-to-r
            from-blue-500
            to-emerald-400
          "
        />

        {/* Text */}
        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          This page is currently under development.
          <br />
          We're working on something amazing for you.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="
            px-8 py-3
            bg-gradient-to-r
            from-blue-600
            to-emerald-600
            text-white
            font-semibold
            rounded-xl
            hover:from-blue-500
            hover:to-emerald-500
            transition-all
            duration-300
            shadow-lg
          "
        >
          Back to Home
        </button>

        <p className="text-slate-500 text-sm mt-8">
          Stay tuned — we'll be launching soon.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;