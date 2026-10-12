"use client";

import { useEffect, useMemo, useState } from "react";
import { FaEye, FaTimes } from "react-icons/fa";

// ==========================================
// HELPERS
// ==========================================

const isEmpty = (value) =>
  value === undefined || value === null || value === "";

const getField = (object, ...keys) => {
  for (const key of keys) {
    const value = object?.[key];

    if (!isEmpty(value)) return value;
  }

  return "";
};

const formatValue = (value) => {
  if (isEmpty(value)) return "-";

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.length ? value.map(formatValue).join(", ") : "-";
  }

  if (typeof value === "object") {
    return (
      value.name ||
      value.studentName ||
      value.mentorName ||
      value.facultyName ||
      value.programName ||
      value.instituteName ||
      value.groupName ||
      value.code ||
      value.programCode ||
      value.instituteCode ||
      value.groupCode ||
      value.facultyId ||
      value._id ||
      "-"
    );
  }

  return String(value);
};

const getInstitute = (student) =>
  formatValue(getField(student, "institute", "instituteCode"));

const getProgram = (student) =>
  formatValue(getField(student, "program", "programCode", "course"));

const getMentor = (mentor) => formatValue(mentor);

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (character) => character.toUpperCase());

// ==========================================
// DETAIL FIELD
// ==========================================

const DetailField = ({ label, value }) => (
  <div className="rounded-xl border border-[#223447] bg-[#132232] p-3">
    <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>

    <p className="break-words text-sm font-medium text-white">
      {formatValue(value)}
    </p>
  </div>
);

// ==========================================
// DETAIL SECTION
// ==========================================

const DetailSection = ({ title, children }) => (
  <section className="space-y-3">
    <h3 className="border-b border-[#223447] pb-2 text-base font-semibold text-white">
      {title}
    </h3>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
  </section>
);

// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({ active, yes, no }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
      active
        ? "bg-green-500/15 text-green-400"
        : "bg-yellow-500/15 text-yellow-400"
    }`}
  >
    {active ? yes : no}
  </span>
);

// ==========================================
// STUDENT DETAILS MODAL
// ==========================================

const StudentDetailsModal = ({ student, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!student) return null;

  const name = getField(student, "name", "studentName", "fullName");

  const enrollment = getField(
    student,
    "enrollmentNumber",
    "enrollmentNo",
    "enrollment",
  );

  const knownFields = new Set([
    "_id",
    "id",
    "name",
    "studentName",
    "fullName",
    "enrollmentNumber",
    "enrollmentNo",
    "enrollment",
    "rollNumber",
    "rollNo",
    "email",
    "studentEmail",
    "officialEmail",
    "mobileNumber",
    "parentName",
    "parentMobileNumber",
    "institute",
    "instituteCode",
    "program",
    "programCode",
    "course",
    "batch",
    "admissionYear",
    "passingYear",
    "semester",
    "section",
    "group",
    "mentorGroup",
    "primaryMentor",
    "backupMentor",
    "isRegistered",
    "isActive",
    "isDeleted",
    "createdAt",
    "updatedAt",
    "__v",
  ]);

  const additionalFields = Object.entries(student).filter(
    ([key]) => !knownFields.has(key),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Student Master Details"
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#223447] bg-[#0d1825] shadow-2xl"
      >
        {/* MODAL HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#223447] bg-[#132232] px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Student Master Details
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {formatValue(name)} • {formatValue(enrollment)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#223447] p-3 text-white transition hover:bg-[#30475e]"
            title="Close Details"
          >
            <FaTimes />
          </button>
        </div>

        {/* MODAL CONTENT */}

        <div className="space-y-7 p-5">
          <DetailSection title="Student Identity">
            <DetailField label="Student Name" value={name} />

            <DetailField label="Enrollment Number" value={enrollment} />

            <DetailField
              label="Roll Number"
              value={getField(student, "rollNumber", "rollNo")}
            />

            <DetailField label="Student Record ID" value={student._id} />
          </DetailSection>

          <DetailSection title="Student Contact Information">
            <DetailField
              label="Official Email"
              value={getField(
                student,
                "email",
                "studentEmail",
                "officialEmail",
              )}
            />

            <DetailField
              label="Student Mobile Number"
              value={student.mobileNumber}
            />
          </DetailSection>

          <DetailSection title="Parent / Guardian Information">
            <DetailField label="Parent Name" value={student.parentName} />

            <DetailField
              label="Parent Mobile Number"
              value={student.parentMobileNumber}
            />
          </DetailSection>

          <DetailSection title="Academic Information">
            <DetailField label="Institute" value={getInstitute(student)} />

            <DetailField label="Program" value={getProgram(student)} />

            <DetailField label="Batch" value={student.batch} />

            <DetailField label="Admission Year" value={student.admissionYear} />

            <DetailField label="Passing Year" value={student.passingYear} />

            <DetailField label="Semester" value={student.semester} />

            <DetailField label="Section" value={student.section} />

            <DetailField label="Group" value={student.group} />
          </DetailSection>

          <DetailSection title="Mentor Mapping">
            <DetailField label="Mentor Group" value={student.mentorGroup} />

            <DetailField
              label="Primary Mentor"
              value={getMentor(student.primaryMentor)}
            />

            <DetailField
              label="Backup Mentor"
              value={getMentor(student.backupMentor)}
            />
          </DetailSection>

          <DetailSection title="Account & Registration Status">
            <DetailField
              label="Registration Status"
              value={
                student.isRegistered === true
                  ? "Registered"
                  : student.isRegistered === false
                    ? "Not Registered"
                    : "Unknown"
              }
            />

            <DetailField
              label="Active Status"
              value={
                student.isActive === true
                  ? "Active"
                  : student.isActive === false
                    ? "Inactive"
                    : "Unknown"
              }
            />
          </DetailSection>

          <DetailSection title="Record Information">
            <DetailField
              label="Created At"
              value={formatDate(student.createdAt)}
            />

            <DetailField
              label="Updated At"
              value={formatDate(student.updatedAt)}
            />
          </DetailSection>

          {additionalFields.length > 0 && (
            <DetailSection title="Additional Information">
              {additionalFields.map(([key, value]) => (
                <DetailField key={key} label={formatLabel(key)} value={value} />
              ))}
            </DetailSection>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end border-t border-[#223447] bg-[#132232] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// USER TABLE
// ==========================================

const UserTable = ({ users = [], loading = false }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const uniqueStudents = useMemo(() => {
    const seen = new Set();

    return users.filter((student) => {
      const key = String(
        student.enrollmentNumber || student.enrollmentNo || student._id || "",
      )
        .trim()
        .toUpperCase();

      if (!key) return true;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [users]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-[#132232] p-8 text-center text-slate-300">
        Loading students...
      </div>
    );
  }

  if (!uniqueStudents.length) {
    return (
      <div className="rounded-2xl bg-[#132232] p-8 text-center text-slate-300">
        No student records found.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#223447] bg-[#132232]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-[#1b2b3d]">
              <tr>
                {[
                  "#",
                  "Student",
                  "Enrollment Number",
                  "Program",
                  "Semester",
                  "Section",
                  "Group",
                  "Registration",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-white"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {uniqueStudents.map((student, index) => (
                <tr
                  key={student._id || student.enrollmentNumber || index}
                  className="border-t border-[#223447] transition hover:bg-[#0d1825]"
                >
                  <td className="px-5 py-4 text-slate-300">{index + 1}</td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">
                      {formatValue(
                        getField(student, "name", "studentName", "fullName"),
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatValue(
                        getField(
                          student,
                          "email",
                          "studentEmail",
                          "officialEmail",
                        ),
                      )}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {formatValue(
                      getField(
                        student,
                        "enrollmentNumber",
                        "enrollmentNo",
                        "enrollment",
                      ),
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {getProgram(student)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {formatValue(student.semester)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {formatValue(student.section)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {formatValue(student.group)}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      active={student.isRegistered === true}
                      yes="Registered"
                      no="Pending"
                    />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      active={student.isActive === true}
                      yes="Active"
                      no="Inactive"
                    />
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(student)}
                      className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                      title="View Complete Student Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
};

export default UserTable;
