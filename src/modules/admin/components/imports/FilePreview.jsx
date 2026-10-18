import {
  FaTable,
  FaEye,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
  FaInfoCircle,
} from "react-icons/fa";

// ============================================================
// HELPERS
// ============================================================

const normalizeKey = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getField = (row, ...fieldNames) => {
  if (!row || typeof row !== "object") {
    return "";
  }

  const normalized = {};

  Object.entries(row).forEach(([key, value]) => {
    normalized[normalizeKey(key)] = value;
  });

  for (const name of fieldNames) {
    const value = normalized[normalizeKey(name)];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return "";
};

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  if (Array.isArray(value)) {
    return value.length ? value.map(formatValue).join(", ") : "—";
  }

  if (typeof value === "object") {
    return "—";
  }

  const text = String(value).trim();

  return text || "—";
};

const formatSemester = (value) => {
  const text = formatValue(value);

  if (text === "—") {
    return text;
  }

  const number = Number(text);

  if (Number.isInteger(number) && number > 0) {
    return `Semester ${number}`;
  }

  return text;
};

const parseRoles = (value) => {
  const values = Array.isArray(value)
    ? value
    : String(value ?? "")
        .replace(/[\]"]/g, "")
        .split(/[,;+]/);

  return [
    ...new Set(
      values
        .map((item) =>
          String(item ?? "")
            .trim()
            .toUpperCase(),
        )
        .filter(Boolean),
    ),
  ];
};

// ============================================================
// ROLE STYLES
// ============================================================

const ROLE_STYLES = {
  MENTOR: "border-blue-500/20 bg-blue-500/10 text-blue-300",

  COORDINATOR: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",

  HOD: "border-purple-500/20 bg-purple-500/10 text-purple-300",

  HOI: "border-amber-500/20 bg-amber-500/10 text-amber-300",
};

const RoleBadges = ({ roles }) => {
  const parsedRoles = parseRoles(roles);

  if (parsedRoles.length === 0) {
    return <span className="text-slate-500">—</span>;
  }

  return (
    <div className="flex min-w-[130px] flex-wrap gap-1.5">
      {parsedRoles.map((role) => (
        <span
          key={role}
          className={`
            inline-flex
            rounded-lg
            border
            px-2.5
            py-1
            text-xs
            font-semibold
            ${
              ROLE_STYLES[role] ||
              "border-slate-500/20 bg-slate-500/10 text-slate-300"
            }
          `}
        >
          {role}
        </span>
      ))}
    </div>
  );
};

// ============================================================
// TABLE CONFIGURATION
// ============================================================

const STUDENT_COLUMNS = [
  {
    key: "enrollment",
    label: "Enrollment No.",
    get: (row) =>
      getField(row, "enrollmentNumber", "enrollment number", "enrollmentNo"),
  },
  {
    key: "roll",
    label: "Roll No.",
    get: (row) => getField(row, "rollNo", "rollNumber", "roll number"),
  },
  {
    key: "name",
    label: "Student Name",
    get: (row) => getField(row, "name", "studentName", "student name"),
  },
  {
    key: "email",
    label: "Email",
    get: (row) => getField(row, "email", "student email"),
  },
  {
    key: "program",
    label: "Program",
    get: (row) => getField(row, "program", "program name", "course"),
  },
  {
    key: "semester",
    label: "Semester",
    get: (row) => formatSemester(getField(row, "semester")),
  },
  {
    key: "section",
    label: "Section",
    get: (row) => getField(row, "section"),
  },
  {
    key: "mentor",
    label: "Mentor",
    get: (row) => getField(row, "mentor", "mentorName", "mentor name"),
  },
];

const FACULTY_COLUMNS = [
  {
    key: "facultyId",
    label: "Faculty ID",
    get: (row) =>
      getField(row, "facultyId", "employeeId", "faculty id", "employee id"),
  },
  {
    key: "name",
    label: "Faculty Name",
    get: (row) =>
      getField(row, "mentorName", "name", "faculty name", "name of mentor"),
  },
  {
    key: "email",
    label: "Official Email",
    get: (row) =>
      getField(
        row,
        "mentorEmail",
        "email",
        "faculty official email",
        "faculty email",
        "mentor email",
      ),
  },
  {
    key: "roles",
    label: "Assigned Roles",
    type: "roles",
    get: (row) => getField(row, "roles", "role", "role(s)"),
  },
  {
    key: "institute",
    label: "Institute",
    get: (row) => getField(row, "institute", "institute code"),
  },
  {
    key: "department",
    label: "Department",
    get: (row) => getField(row, "department", "department code"),
  },
  {
    key: "program",
    label: "Program",
    get: (row) => getField(row, "program", "program code"),
  },
  {
    key: "semester",
    label: "Semester",
    get: (row) => formatSemester(getField(row, "semester")),
  },
  {
    key: "section",
    label: "Section",
    get: (row) => getField(row, "section"),
  },
  {
    key: "group",
    label: "Mentor Group",
    get: (row) =>
      getField(row, "group", "mentor group", "group (as per amizone)"),
  },
  {
    key: "coordinatorGroups",
    label: "Coordinator Groups",
    get: (row) =>
      getField(
        row,
        "coordinatorGroups",
        "coordinator groups",
        "coordinator groups (comma separated)",
      ),
  },
];

const GROUP_COLUMNS = [
  {
    key: "id",
    label: "Group ID",
    get: (row) => getField(row, "groupId", "group id"),
  },
  {
    key: "name",
    label: "Group Name",
    get: (row) => getField(row, "name"),
  },
  {
    key: "description",
    label: "Description",
    get: (row) => getField(row, "description"),
  },
];

// ============================================================
// FILE PREVIEW COMPONENT
// ============================================================

const FilePreview = ({ activeTab, previewData = [] }) => {
  if (!Array.isArray(previewData) || previewData.length === 0) {
    return null;
  }

  const isFaculty = activeTab === "mentors";
  const isStudent = activeTab === "students";

  const columns = isStudent
    ? STUDENT_COLUMNS
    : isFaculty
      ? FACULTY_COLUMNS
      : GROUP_COLUMNS;

  const visibleRows = previewData.slice(0, 10);

  const Icon = isFaculty
    ? FaChalkboardTeacher
    : isStudent
      ? FaUserGraduate
      : FaBuilding;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <section className="rounded-3xl border border-[#223447] bg-[#122131] p-5 sm:p-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
            <FaTable className="text-2xl text-green-400" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-white">
                {isFaculty
                  ? "Faculty Excel Preview"
                  : isStudent
                    ? "Student Data Preview"
                    : "Group Data Preview"}
              </h2>

              <FaEye className="text-blue-400" />
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Preview of records returned by the import API.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-400">
          <Icon />
          {visibleRows.length} Preview Rows
        </div>
      </div>

      {/* FACULTY INFORMATION */}

      {isFaculty && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <FaInfoCircle className="mt-1 shrink-0 text-blue-400" />

          <p className="text-sm leading-6 text-slate-300">
            HOD and HOI records may legitimately have blank Semester, Section or
            Group fields. A dash means that the value was not supplied.
          </p>
        </div>
      )}

      {/* DATA TABLE */}

      <div className="overflow-x-auto rounded-2xl border border-[#223447]">
        <table className="min-w-max w-full text-left">
          <thead className="bg-[#0F172A]">
            <tr>
              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                #
              </th>

              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row, index) => (
              <tr
                key={`${index}-${formatValue(
                  getField(
                    row,
                    "facultyId",
                    "enrollmentNumber",
                    "rollNo",
                    "groupId",
                  ),
                )}`}
                className="border-t border-[#223447] transition-colors hover:bg-[#1A2A3D]"
              >
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                  {getField(row, "rowNumber") || index + 1}
                </td>

                {columns.map((column) => {
                  const rawValue = column.get(row);

                  return (
                    <td
                      key={column.key}
                      className="max-w-[300px] px-5 py-4 align-middle text-sm text-slate-300"
                    >
                      {column.type === "roles" ? (
                        <RoleBadges roles={rawValue} />
                      ) : (
                        <span
                          className={
                            formatValue(rawValue) === "—"
                              ? "text-slate-500"
                              : column.key === "name"
                                ? "font-semibold text-white"
                                : ""
                          }
                        >
                          {formatValue(rawValue)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <FaEye className="text-blue-400" />
          Showing {visibleRows.length} preview records.
        </div>

        {previewData.length > 10 && (
          <span className="text-xs text-slate-500">
            Additional records are not shown here.
          </span>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-[#223447] bg-[#0F172A] p-4">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="mt-0.5 shrink-0 text-blue-400" />

          <p className="text-xs leading-5 text-slate-400">
            A preview is not proof of successful database insertion. Refer to
            Import Summary and Validation Errors for the actual processing
            results.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FilePreview;
