// ============================================================
// AMIOUT Enterprise Edition
// Portal Data
// ============================================================

import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";

export const portals = [
  {
    id: 1,
    title: "Student",
    description:
      "Create your student account to apply, track and manage outpass requests.",
    icon: GraduationCap,
    to: "/student/register",
    color: "from-cyan-500 to-blue-600",
  },

  {
    id: 2,
    title: "Mentor",
    description:
      "Review, verify and approve student outpass requests with ease.",
    icon: UserCheck,
    to: "/mentor/register",
    color: "from-emerald-500 to-teal-600",
  },

  {
    id: 3,
    title: "Administrator",
    description:
      "Manage users, departments and complete enterprise operations.",
    icon: ShieldCheck,
    to: "/admin/register",
    color: "from-violet-500 to-fuchsia-600",
  },

  {
    id: 4,
    title: "Admin Login",
    description: "Already have administrator credentials? Sign in securely.",
    icon: LockKeyhole,
    to: "/admin/login",
    color: "from-orange-500 to-amber-600",
  },
];
