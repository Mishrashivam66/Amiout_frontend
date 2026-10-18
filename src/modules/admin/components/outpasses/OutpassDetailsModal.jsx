import {
  X,
  GraduationCap,
  ClipboardList,
  Users,
  BadgeCheck,
  QrCode,
  ShieldCheck,
  History,
  CalendarClock,
} from "lucide-react";

// ============================================================
// HELPERS
// ============================================================

const valueOf = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-[#223447] bg-[#081018] p-4">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>

    <p className="mt-2 break-words text-sm font-medium text-white">
      {valueOf(value)}
    </p>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <section className="rounded-2xl border border-[#223447] bg-[#111827] p-5 sm:p-6">
    <h3 className="mb-5 flex items-center gap-3 text-lg font-bold text-white">
      <Icon size={23} className="text-cyan-400" />
      {title}
    </h3>

    {children}
  </section>
);

const Fields = ({ children }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
);

// ============================================================
// MODAL
// ============================================================

const OutpassDetailsModal = ({ open, outpass, onClose }) => {
  if (!open || !outpass) return null;

  const {
    student = {},
    request = {},
    parent = {},
    faculty = {},
    qr = {},
    security = {},
    timeline = [],
    assignmentHistory = [],
  } = outpass;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Complete Outpass Details"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#223447] bg-[#0F172A] shadow-2xl">
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#223447] bg-[#111827] p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Complete Outpass Details
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Outpass: {outpass.outpassId}
            </p>

            <p className="mt-1 text-xs text-green-400">
              Read-only administrative monitoring
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
              {outpass.status || "UNKNOWN"}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="rounded-xl bg-red-600 p-2.5 text-white hover:bg-red-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
          {/* STUDENT */}
          <Section title="Student Information" icon={GraduationCap}>
            <Fields>
              <Field label="Name" value={student.name} />
              <Field
                label="Enrollment Number"
                value={student.enrollmentNumber}
              />
              <Field label="Email" value={student.email} />
              <Field label="Institute" value={student.institute} />
              <Field
                label="Program"
                value={student.program || student.course}
              />
              <Field label="Department" value={student.department} />
              <Field label="Branch" value={student.branch} />
              <Field label="Batch" value={student.batch} />
              <Field label="Semester" value={student.semester} />
              <Field label="Section" value={student.section} />
              <Field label="Group" value={student.group} />
            </Fields>
          </Section>

          {/* OUTPASS */}
          <Section title="Outpass Information" icon={ClipboardList}>
            <Fields>
              <Field label="Outpass Number" value={outpass.outpassId} />
              <Field label="Status" value={outpass.status} />
              <Field label="Destination" value={request.destination} />
              <Field label="Outpass Date" value={formatDate(request.outDate)} />
              <Field label="Requested Exit Time" value={request.outTime} />
              <Field label="Requested Return Time" value={request.inTime} />
              <Field
                label="Daily Trip Number"
                value={request.dailyTripNumber}
              />
              <Field label="Applied At" value={formatDate(request.createdAt)} />
            </Fields>

            <div className="mt-4 rounded-xl border border-[#223447] bg-[#081018] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Reason
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white">
                {request.reason || "—"}
              </p>
            </div>
          </Section>

          {/* PARENT */}
          <Section title="Parent Consent & Verification" icon={Users}>
            <Fields>
              <Field label="Parent Name" value={parent.name} />
              <Field label="Parent Mobile" value={parent.mobileMasked} />
              <Field label="Consent Status" value={parent.status} />
              <Field label="Consent Method" value={parent.method} />
              <Field
                label="Decision Time"
                value={formatDate(parent.decidedAt)}
              />
              <Field label="SMS Status" value={parent.smsStatus} />
              <Field label="Verified By" value={parent.verifiedBy?.name} />
              <Field label="Verifier Role" value={parent.verifiedByRole} />
              <Field label="Phone Outcome" value={parent.callOutcome} />
              <Field
                label="Call Verified At"
                value={formatDate(parent.callVerifiedAt)}
              />
              <Field label="Call Remarks" value={parent.callRemarks} />
            </Fields>
          </Section>

          {/* FACULTY */}
          <Section title="Faculty Approval & Escalation" icon={BadgeCheck}>
            <Fields>
              <Field label="Primary Mentor" value={faculty.mentor?.name} />
              <Field
                label="Assigned Authority"
                value={faculty.assigned?.name}
              />
              <Field label="Assigned Role" value={faculty.assignedRole} />
              <Field label="Approved By" value={faculty.approvedBy?.name} />
              <Field label="Approver Role" value={faculty.approvedRole} />
              <Field
                label="Approved At"
                value={formatDate(faculty.approvedAt)}
              />
              <Field label="Rejected By" value={faculty.rejectedBy?.name} />
              <Field label="Rejected Role" value={faculty.rejectedRole} />
              <Field
                label="Rejected At"
                value={formatDate(faculty.rejectedAt)}
              />
              <Field label="Approval Remark" value={faculty.approvalRemark} />
              <Field label="Rejection Remark" value={faculty.rejectionRemark} />
              <Field
                label="Escalation/Bypass Used"
                value={faculty.approvalBypass?.used}
              />
              <Field
                label="Escalation Reason"
                value={faculty.approvalBypass?.reason}
              />
              <Field
                label="Parent Status Acknowledged"
                value={
                  faculty.parentConsentAcknowledgement?.parentStatusAtApproval
                }
              />
            </Fields>

            <div className="mt-5">
              <h4 className="mb-3 font-semibold text-white">
                Assignment History
              </h4>

              {assignmentHistory.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No reassignment recorded.
                </p>
              ) : (
                <div className="space-y-3">
                  {assignmentHistory.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#223447] bg-[#081018] p-4"
                    >
                      <p className="font-medium text-white">
                        {item.fromRole || "Initial"}
                        {" → "}
                        {item.toRole || "Assigned"}
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        {item.fromFaculty?.name || "—"}
                        {" → "}
                        {item.toFaculty?.name || "—"}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {item.reason || "—"}
                        {" · "}
                        {formatDate(item.transferredAt)}
                      </p>

                      {item.remarks && (
                        <p className="mt-2 text-sm text-slate-300">
                          {item.remarks}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* QR */}
          <Section title="QR Pass" icon={QrCode}>
            <Fields>
              <Field label="QR Generated" value={qr.generated} />
              <Field label="Generated At" value={formatDate(qr.generatedAt)} />
              <Field label="Valid From" value={formatDate(qr.validFrom)} />
              <Field label="Expires At" value={formatDate(qr.expiresAt)} />
              <Field label="Revoked At" value={formatDate(qr.revokedAt)} />
            </Fields>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              QR metadata is shown here without exposing the private
              verification token. The actual QR image is not included in this
              monitoring endpoint.
            </p>
          </Section>

          {/* SECURITY */}
          <Section title="Gate Security Verification" icon={ShieldCheck}>
            <Fields>
              <Field label="Exit Verified" value={security.exitVerified} />
              <Field
                label="Exit Time"
                value={formatDate(security.exitVerifiedAt)}
              />
              <Field label="Exit Guard" value={security.exitVerifiedBy?.name} />
              <Field label="Return Verified" value={security.entryVerified} />
              <Field
                label="Return Time"
                value={formatDate(security.entryVerifiedAt)}
              />
              <Field
                label="Return Guard"
                value={security.entryVerifiedBy?.name}
              />
            </Fields>
          </Section>

          {/* TIMELINE */}
          <Section title="Complete Outpass Timeline" icon={History}>
            {timeline.length === 0 ? (
              <p className="text-sm text-slate-400">
                No timeline events available.
              </p>
            ) : (
              <div className="space-y-3">
                {[...timeline]
                  .sort(
                    (a, b) => new Date(a.performedAt) - new Date(b.performedAt),
                  )
                  .map((event, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-xl border border-[#223447] bg-[#081018] p-4"
                    >
                      <CalendarClock
                        size={20}
                        className="mt-0.5 shrink-0 text-cyan-400"
                      />

                      <div>
                        <h4 className="font-semibold text-white">
                          {event.title || event.event}
                        </h4>

                        <p className="mt-1 text-sm text-slate-300">
                          {event.description || "—"}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatDate(event.performedAt)}

                          {event.performedBy?.name
                            ? ` · ${event.performedBy.name}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Section>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 justify-end border-t border-[#223447] bg-[#111827] p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutpassDetailsModal;
