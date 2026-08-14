import { Outlet } from "react-router-dom";
import { useState } from "react";

import MentorNavbar from "./MentorNavbar";
import MentorSidebar from "./MentorSidebar";

const MentorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <MentorSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="lg:ml-72 transition-all duration-300">
        <MentorNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-80px)] p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MentorLayout;
