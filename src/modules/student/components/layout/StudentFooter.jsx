// ==========================================
// Project : AMIOUT
// Module  : Student
// File    : StudentFooter.jsx
// ==========================================

const StudentFooter = () => {
  return (
    <footer
      className="
        border-t
        border-slate-200
        bg-white
        px-4
        py-4
        text-center
        text-sm
        text-slate-500
        sm:px-6
        lg:px-8
      "
    >
      <p>© {new Date().getFullYear()} AMIOUT. All rights reserved.</p>

      <p className="mt-1 text-xs text-slate-400">
        Smart Outpass Management System
      </p>
    </footer>
  );
};

export default StudentFooter;
