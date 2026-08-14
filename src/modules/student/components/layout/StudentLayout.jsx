import { useState } from "react";
import { Outlet } from "react-router-dom";

import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import StudentFooter from "./StudentFooter";

const StudentLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}

      <StudentSidebar open={open} setOpen={setOpen} />

      {/* Main Area */}

      <div className="min-h-screen lg:ml-72 flex flex-col">
        {/* Navbar */}

        <StudentNavbar setOpen={setOpen} />

        {/* Page */}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Footer */}

        <StudentFooter />
      </div>
    </div>
  );
};

export default StudentLayout;
