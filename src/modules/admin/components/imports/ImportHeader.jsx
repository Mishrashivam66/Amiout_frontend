
import { FaFileImport } from "react-icons/fa";

const ImportHeader = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[#223447]
        bg-gradient-to-r
        from-[#0F172A]
        via-[#122131]
        to-[#163525]
        p-8
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          -right-24
          -top-24
          h-80
          w-80
          rounded-full
          bg-green-500/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          flex
          flex-col
          gap-8
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Left */}

        <div className="flex items-center gap-5">
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-green-500/10
              text-4xl
              text-green-400
            "
          >
            <FaFileImport />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-white">
              Import Center
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Import Student and Mentor records using Excel spreadsheets.
              Automatically validate duplicates, missing data and invalid
              records before saving into the AMIOUT database.
            </p>
          </div>
        </div>

        {/* Right */}

        <div
          className="
            rounded-2xl
            border
            border-[#223447]
            bg-[#081018]/70
            px-6
            py-5
          "
        >
          <p className="text-sm uppercase tracking-widest text-green-400">
            Supported Files
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">XLSX / XLS</h2>

          <p className="mt-2 text-sm text-slate-400">
            Maximum File Size : 10 MB
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImportHeader;
