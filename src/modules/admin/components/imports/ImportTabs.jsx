import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCheckCircle,
  FaUniversity,
} from "react-icons/fa";

// ============================================================
// IMPORT TAB CONFIGURATION
// ============================================================

const TABS = [
  {
    id: "students",
    title: "Student Import",
    subtitle: "Bulk Student Academic Registration",
    description: "Import student records from Excel or PDF.",
    icon: FaUserGraduate,
    roles: [],
    activeBorder: "border-green-500",
    activeIcon: "bg-green-500/20 text-green-400",
    activeBar: "from-green-400 via-green-500 to-emerald-400",
    activeBg: "from-[#173A28] to-[#112635]",
  },
  {
    // Keep mentors ID for existing backend compatibility.
    id: "mentors",
    title: "Faculty Import",
    subtitle: "Bulk Faculty Management",
    description: "Import faculty with role-based academic assignments.",
    icon: FaChalkboardTeacher,
    roles: ["MENTOR", "COORDINATOR", "HOD", "HOI"],
    activeBorder: "border-blue-500",
    activeIcon: "bg-blue-500/20 text-blue-400",
    activeBar: "from-blue-400 via-blue-500 to-cyan-400",
    activeBg: "from-[#152E48] to-[#112635]",
  },
];

// ============================================================
// COMPONENT
// ============================================================

const ImportTabs = ({ activeTab, setActiveTab }) => {
  return (
    <section className="mt-8">
      {/* ======================================================
          SECTION HEADING
      ====================================================== */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">
            Select Import Category
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Choose the type of academic records you want to import.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#223447] bg-[#0F172A] px-4 py-2">
          <FaUniversity className="text-blue-400" />

          <span className="text-xs font-medium text-slate-300">
            AMIOUT Enterprise
          </span>
        </div>
      </div>

      {/* ======================================================
          IMPORT TABS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group
                relative
                min-h-[230px]
                overflow-hidden
                rounded-2xl
                border
                p-6
                text-left
                transition-all
                duration-300
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blue-400

                ${
                  active
                    ? `
                      ${tab.activeBorder}
                      bg-gradient-to-r
                      ${tab.activeBg}
                      shadow-xl
                      shadow-black/10
                    `
                    : `
                      border-[#223447]
                      bg-[#0F172A]
                      hover:border-blue-500/50
                      hover:bg-[#122131]
                    `
                }
              `}
            >
              {/* ==================================================
                  BACKGROUND DECORATION
              ================================================== */}

              {active && (
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
              )}

              {/* ==================================================
                  ACTIVE STATUS
              ================================================== */}

              <div className="absolute right-5 top-5">
                {active ? (
                  <FaCheckCircle className="text-xl text-green-400" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-600" />
                )}
              </div>

              {/* ==================================================
                  ICON AND TITLE
              ================================================== */}

              <div className="relative flex items-start gap-4 pr-7">
                <div
                  className={`
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    text-3xl
                    transition-all

                    ${
                      active
                        ? tab.activeIcon
                        : "bg-[#122131] text-slate-400 group-hover:text-blue-400"
                    }
                  `}
                >
                  <Icon />
                </div>

                <div className="min-w-0">
                  <h3
                    className={`
                      text-xl
                      font-bold

                      ${active ? "text-white" : "text-slate-300"}
                    `}
                  >
                    {tab.title}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-400">
                    {tab.subtitle}
                  </p>
                </div>
              </div>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <p className="relative mt-5 text-sm leading-6 text-slate-400">
                {tab.description}
              </p>

              {/* ==================================================
                  FACULTY ROLE BADGES
              ================================================== */}

              {tab.roles.length > 0 && (
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {tab.roles.map((role) => (
                    <span
                      key={role}
                      className={`
                        rounded-lg
                        border
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        tracking-wide

                        ${
                          active
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                            : "border-[#223447] bg-[#122131] text-slate-400"
                        }
                      `}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}

              {/* ==================================================
                  ACTIVE BOTTOM INDICATOR
              ================================================== */}

              {active && (
                <div
                  className={`
                    absolute
                    bottom-0
                    left-0
                    h-1
                    w-full
                    bg-gradient-to-r
                    ${tab.activeBar}
                  `}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ImportTabs;
