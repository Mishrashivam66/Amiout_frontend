import {
  X,
  Printer,
  Download,
  User,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Phone,
  Mail,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const DetailItem = ({ icon, label, value }) => (
  <div
    className="
      flex
      items-start
      gap-3
      rounded-xl
      border
      border-[#223447]
      bg-[#081018]
      p-4
    "
  >
    <div className="text-cyan-400">{icon}</div>

    <div className="flex-1">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>

      <p className="mt-1 font-medium text-white">{value || "-"}</p>
    </div>
  </div>
);

const SectionTitle = ({ icon, title }) => (
  <div className="mb-5 flex items-center gap-3">
    <div
      className="
        rounded-xl
        bg-cyan-500/10
        p-2
        text-cyan-400
      "
    >
      {icon}
    </div>

    <h2 className="text-xl font-bold text-white">{title}</h2>
  </div>
);

const OutpassDetailsModal = ({ open, onClose, outpass }) => {
  if (!open || !outpass) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-black/70
        backdrop-blur-sm
        p-6
      "
    >
      <div
        className="
          max-h-[95vh]
          w-full
          max-w-7xl
          overflow-y-auto
          rounded-3xl
          border
          border-[#223447]
          bg-[#0F172A]
          shadow-2xl
        "
      >
        {/* =========================================== */}
        {/* Header */}
        {/* =========================================== */}

        <div
          className="
            sticky
            top-0
            z-20
            flex
            items-center
            justify-between
            border-b
            border-[#223447]
            bg-[#111827]
            px-8
            py-6
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-white
              "
            >
              Outpass Details
            </h1>

            <p className="mt-2 text-slate-400">
              Complete information about selected outpass.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={outpass.status} />

            <button
              className="
                rounded-xl
                bg-cyan-600
                p-3
                text-white
                transition
                hover:bg-cyan-500
              "
            >
              <Printer size={20} />
            </button>

            <button
              className="
                rounded-xl
                bg-green-600
                p-3
                text-white
                transition
                hover:bg-green-500
              "
            >
              <Download size={20} />
            </button>

            <button
              onClick={onClose}
              className="
                rounded-xl
                bg-red-600
                p-3
                text-white
                transition
                hover:bg-red-500
              "
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* =========================================== */}
        {/* Body */}
        {/* =========================================== */}

        <div className="space-y-8 p-8">
          {/* Student Information starts in Part 2 */}
          {/* ====================================================== */}
          {/* Student Information */}
          {/* ====================================================== */}

          <section>
            <SectionTitle
              icon={<User size={22} />}
              title="Student Information"
            />

            <div className="rounded-3xl border border-[#223447] bg-[#111827] p-8">
              <div className="flex flex-col gap-8 lg:flex-row">
                {/* Avatar */}

                <div className="flex flex-col items-center">
                  <div
                    className="
            flex
            h-28
            w-28
            items-center
            justify-center
            rounded-full
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            text-5xl
            font-bold
            text-white
            shadow-xl
          "
                  >
                    {outpass.student?.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-white">
                    {outpass.student?.name || "-"}
                  </h3>

                  <p className="mt-1 text-slate-400">
                    {outpass.student?.enrollmentNumber || "-"}
                  </p>

                  <div className="mt-4">
                    <StatusBadge status={outpass.status} />
                  </div>
                </div>

                {/* Details */}

                <div className="grid flex-1 gap-5 md:grid-cols-2">
                  <DetailItem
                    icon={<Mail size={18} />}
                    label="Email"
                    value={outpass.student?.email}
                  />

                  <DetailItem
                    icon={<Phone size={18} />}
                    label="Phone"
                    value={outpass.student?.phone}
                  />

                  <DetailItem
                    icon={<GraduationCap size={18} />}
                    label="Enrollment"
                    value={outpass.student?.enrollmentNumber}
                  />

                  <DetailItem
                    icon={<GraduationCap size={18} />}
                    label="Course"
                    value={outpass.student?.course}
                  />

                  <DetailItem
                    icon={<GraduationCap size={18} />}
                    label="Year"
                    value={outpass.student?.year}
                  />

                  <DetailItem
                    icon={<MapPin size={18} />}
                    label="Hostel"
                    value={outpass.student?.hostel}
                  />

                  <DetailItem
                    icon={<MapPin size={18} />}
                    label="Room Number"
                    value={outpass.student?.roomNumber}
                  />

                  <DetailItem
                    icon={<Calendar size={18} />}
                    label="Applied On"
                    value={formatDate(outpass.createdAt)}
                  />
                </div>
              </div>
            </div>
          </section>
          {/* ====================================================== */}
          {/* Mentor & Outpass Information */}
          {/* ====================================================== */}

          <section className="grid gap-8 lg:grid-cols-2">
            {/* ====================================================== */}
            {/* Mentor Information */}
            {/* ====================================================== */}

            <div>
              <SectionTitle
                icon={<GraduationCap size={22} />}
                title="Mentor Information"
              />

              <div className="rounded-3xl border border-[#223447] bg-[#111827] p-6">
                <div className="grid gap-5">
                  <DetailItem
                    icon={<User size={18} />}
                    label="Mentor Name"
                    value={outpass.mentor?.name}
                  />

                  <DetailItem
                    icon={<Mail size={18} />}
                    label="Mentor Email"
                    value={outpass.mentor?.email}
                  />

                  <DetailItem
                    icon={<Phone size={18} />}
                    label="Mentor Phone"
                    value={outpass.mentor?.phone}
                  />
                </div>
              </div>
            </div>

            {/* ====================================================== */}
            {/* Outpass Information */}
            {/* ====================================================== */}

            <div>
              <SectionTitle
                icon={<MapPin size={22} />}
                title="Outpass Information"
              />

              <div className="rounded-3xl border border-[#223447] bg-[#111827] p-6">
                <div className="grid gap-5">
                  <DetailItem
                    icon={<Shield size={18} />}
                    label="Outpass Type"
                    value={outpass.outpassType || outpass.type}
                  />

                  <DetailItem
                    icon={<Calendar size={18} />}
                    label="Exit Date"
                    value={formatDate(outpass.outDate || outpass.exitDate)}
                  />

                  <DetailItem
                    icon={<Clock size={18} />}
                    label="Expected Return"
                    value={formatDate(
                      outpass.expectedReturn || outpass.returnDate,
                    )}
                  />

                  <DetailItem
                    icon={<MapPin size={18} />}
                    label="Destination"
                    value={outpass.destination}
                  />
                </div>

                {/* Reason */}

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Reason
                  </h3>

                  <div
                    className="
            rounded-2xl
            border
            border-[#223447]
            bg-[#081018]
            p-5
            leading-7
            text-slate-300
          "
                  >
                    {outpass.reason || "No reason provided."}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* ====================================================== */}
          {/* Timeline & Remarks */}
          {/* ====================================================== */}

          <section className="grid gap-8 lg:grid-cols-2">
            {/* ============================================== */}
            {/* Approval Timeline */}
            {/* ============================================== */}

            <div>
              <SectionTitle
                icon={<Clock size={22} />}
                title="Approval Timeline"
              />

              <div className="rounded-3xl border border-[#223447] bg-[#111827] p-6">
                <div className="space-y-8">
                  {/* Applied */}

                  <div className="flex gap-4">
                    <div className="mt-1 h-4 w-4 rounded-full bg-blue-500" />

                    <div>
                      <h4 className="font-semibold text-white">
                        Student Applied
                      </h4>

                      <p className="text-sm text-slate-400">
                        {formatDate(outpass.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Mentor */}

                  <div className="flex gap-4">
                    <div
                      className={`mt-1 h-4 w-4 rounded-full ${
                        outpass.mentorApprovedAt
                          ? "bg-green-500"
                          : "bg-slate-600"
                      }`}
                    />

                    <div>
                      <h4 className="font-semibold text-white">
                        Mentor Approval
                      </h4>

                      <p className="text-sm text-slate-400">
                        {outpass.mentorApprovedAt
                          ? formatDate(outpass.mentorApprovedAt)
                          : "Pending"}
                      </p>
                    </div>
                  </div>

                  {/* Exit */}

                  <div className="flex gap-4">
                    <div
                      className={`mt-1 h-4 w-4 rounded-full ${
                        outpass.securityExitAt ? "bg-cyan-500" : "bg-slate-600"
                      }`}
                    />

                    <div>
                      <h4 className="font-semibold text-white">
                        Security Exit
                      </h4>

                      <p className="text-sm text-slate-400">
                        {outpass.securityExitAt
                          ? formatDate(outpass.securityExitAt)
                          : "Waiting"}
                      </p>
                    </div>
                  </div>

                  {/* Return */}

                  <div className="flex gap-4">
                    <div
                      className={`mt-1 h-4 w-4 rounded-full ${
                        outpass.securityReturnAt
                          ? "bg-purple-500"
                          : "bg-slate-600"
                      }`}
                    />

                    <div>
                      <h4 className="font-semibold text-white">
                        Security Return
                      </h4>

                      <p className="text-sm text-slate-400">
                        {outpass.securityReturnAt
                          ? formatDate(outpass.securityReturnAt)
                          : "Not Returned"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================== */}
            {/* Remarks */}
            {/* ============================================== */}

            <div>
              <SectionTitle icon={<Shield size={22} />} title="Remarks" />

              <div className="space-y-5">
                <div className="rounded-2xl border border-[#223447] bg-[#111827] p-5">
                  <h3 className="mb-3 font-semibold text-cyan-400">
                    Mentor Remark
                  </h3>

                  <p className="leading-7 text-slate-300">
                    {outpass.mentorRemark || "No remarks available."}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#223447] bg-[#111827] p-5">
                  <h3 className="mb-3 font-semibold text-green-400">
                    Security Remark
                  </h3>

                  <p className="leading-7 text-slate-300">
                    {outpass.securityRemark || "No remarks available."}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#223447] bg-[#111827] p-5">
                  <h3 className="mb-3 font-semibold text-orange-400">
                    Admin Remark
                  </h3>

                  <p className="leading-7 text-slate-300">
                    {outpass.adminRemark || "No remarks available."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================== */}
          {/* Footer */}
          {/* ============================================== */}

          <div className="mt-10 flex flex-col justify-end gap-4 border-t border-[#223447] pt-6 md:flex-row">
            <button
              onClick={() => window.print()}
              className="
      rounded-xl
      bg-cyan-600
      px-6
      py-3
      font-semibold
      text-white
      transition
      hover:bg-cyan-500
    "
            >
              Print
            </button>

            <button
              className="
      rounded-xl
      bg-green-600
      px-6
      py-3
      font-semibold
      text-white
      transition
      hover:bg-green-500
    "
            >
              Download PDF
            </button>

            <button
              onClick={onClose}
              className="
      rounded-xl
      bg-red-600
      px-6
      py-3
      font-semibold
      text-white
      transition
      hover:bg-red-500
    "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutpassDetailsModal;
