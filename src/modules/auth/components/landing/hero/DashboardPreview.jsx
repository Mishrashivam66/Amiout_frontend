import campusJourney from "../../../../../assets/campus-journey.webp";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  HeartHandshake,
  GraduationCap,
  QrCode,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    name: "Student Request",
    detail: "Submit an outpass",
  },
  {
    icon: HeartHandshake,
    name: "Parent Approval",
    detail: "Parent reviews request",
  },
  {
    icon: GraduationCap,
    name: "Faculty Approval",
    detail: "Authorized faculty approves",
  },
  { icon: QrCode, name: "QR Pass", detail: "Valid digital pass" },
  {
    icon: ShieldCheck,
    name: "Security Verification",
    detail: "Gate scan & entry/exit",
  },
];

// Desktop illustration is supplied by campus-journey.webp; this accessible
// mobile workflow is real JSX, not text baked into the illustration.
const DashboardPreview = () => (
  <div className="relative w-full lg:hidden">
    <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#091832]">
      <img
        src={campusJourney}
        alt="AMIOUT University Campus"
        className="h-[400px] w-full object-cover object-center opacity-90 sm:h-[420px]"
      />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {steps.map(({ icon: Icon, name, detail }, index) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
          className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-[#0a1833] p-3"
        >
          <span className="rounded-lg bg-cyan-500/15 p-2 text-cyan-300">
            <Icon size={19} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-slate-400">{detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
export default DashboardPreview;
