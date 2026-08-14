import { ShieldCheck } from "lucide-react";

const AdminLoginHeader = () => {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300">
        <ShieldCheck size={18} />
        Secure Admin Login
      </div>

      <h1 className="mt-6 text-5xl font-black text-white">Welcome Back</h1>

      <p className="mt-4 text-slate-400">
        Login with your official Amity administrator account.
      </p>
    </>
  );
};

export default AdminLoginHeader;
