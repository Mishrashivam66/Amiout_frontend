import { ShieldCheck } from "lucide-react";

const AdminRegisterHeader = () => {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300">
        <ShieldCheck size={18} />
        Secure Admin Registration
      </div>

      <h1 className="mt-6 text-5xl font-black text-white">
        Create Admin Account
      </h1>

      <p className="mt-4 text-slate-400">
        Register using your official Amity email to access the Admin Portal.
      </p>

      <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
        Only authorized administrators can register.
        <br />
        Email must end with <b>@gwa.amity.edu</b>
      </div>
    </>
  );
};

export default AdminRegisterHeader;
