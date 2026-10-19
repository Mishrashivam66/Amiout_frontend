import { TrendingUp } from "lucide-react";

const themes = {
  green: {
    background: "bg-emerald-400/10",
    text: "text-emerald-400",
    border: "border-emerald-400/20",
  },
  blue: {
    background: "bg-blue-400/10",
    text: "text-blue-400",
    border: "border-blue-400/20",
  },
  red: {
    background: "bg-rose-400/10",
    text: "text-rose-400",
    border: "border-rose-400/20",
  },
  orange: {
    background: "bg-amber-400/10",
    text: "text-amber-400",
    border: "border-amber-400/20",
  },
  purple: {
    background: "bg-violet-400/10",
    text: "text-violet-400",
    border: "border-violet-400/20",
  },
  cyan: {
    background: "bg-cyan-400/10",
    text: "text-cyan-400",
    border: "border-cyan-400/20",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "green",
  percentage,
  description,
}) {
  const theme = themes[color] || themes.green;

  const number =
    value === null || value === undefined || value === ""
      ? null
      : Number(value);

  const display =
    number !== null && Number.isFinite(number)
      ? number.toLocaleString("en-IN")
      : "—";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border
        ${theme.border} bg-[#122131] p-6
        transition-all duration-300 hover:-translate-y-1
        hover:shadow-xl`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8
          h-28 w-28 rounded-full blur-3xl
          ${theme.background}`}
      />

      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-400">{title}</p>

          <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            {display}
          </h3>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center
            justify-center rounded-2xl
            ${theme.background} ${theme.text}
            transition-transform group-hover:scale-110`}
        >
          {Icon && <Icon size={27} />}
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-2">
        {percentage !== undefined &&
          percentage !== null &&
          percentage !== "" && (
            <span
              className={`inline-flex items-center gap-1 rounded-full
              px-3 py-1 text-xs font-bold
              ${theme.background} ${theme.text}`}
            >
              <TrendingUp size={13} />
              {percentage}
            </span>
          )}

        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
    </article>
  );
}
