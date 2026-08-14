
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

const ImportTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "students",
      title: "Student Import",
      subtitle: "Bulk Student Registration",
      icon: FaUserGraduate,
      color: "green",
    },

    {
      id: "mentors",
      title: "Mentor Import",
      subtitle: "Bulk Mentor Registration",
      icon: FaChalkboardTeacher,
      color: "blue",
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`
                relative
                overflow-hidden
                rounded-2xl
                border
                p-6
                text-left
                transition-all
                duration-300

                ${
                  active
                    ? "border-green-500 bg-gradient-to-r from-[#173A28] to-[#112635] shadow-xl shadow-green-500/10"
                    : "border-[#223447] bg-[#0F172A] hover:border-green-500"
                }
              `}
            >
              {active && (
                <div
                  className="
                    absolute
                    -right-10
                    -top-10
                    h-40
                    w-40
                    rounded-full
                    bg-green-500/10
                    blur-3xl
                  "
                />
              )}

              <div className="relative flex items-center gap-5">
                <div
                  className={`
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    text-3xl

                    ${
                      active
                        ? "bg-green-500/20 text-green-400"
                        : "bg-[#122131] text-slate-400"
                    }
                  `}
                >
                  <Icon />
                </div>

                <div>
                  <h3
                    className={`
                      text-xl
                      font-bold
                      ${active ? "text-white" : "text-slate-300"}
                    `}
                  >
                    {tab.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">{tab.subtitle}</p>
                </div>
              </div>

              {active && (
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-1
                    w-full
                    rounded-full
                    bg-gradient-to-r
                    from-green-400
                    via-green-500
                    to-emerald-400
                  "
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
