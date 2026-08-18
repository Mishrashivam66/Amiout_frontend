import { motion } from "framer-motion";
import MentorForgotPasswordCard from "../components/mentor-forgot-password/MentorForgotPasswordCard";

const MentorForgotPassword = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10"
      >
        <div className="w-full max-w-xl">
          <MentorForgotPasswordCard />
        </div>
      </motion.div>
    </div>
  );
};

export default MentorForgotPassword;
