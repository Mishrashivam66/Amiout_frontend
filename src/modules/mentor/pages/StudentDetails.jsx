import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  Users,
  ShieldCheck,
} from "lucide-react";

import { getStudentDetails } from "../services/mentor.service";

const StudentDetails = () => {
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStudent = async () => {
    try {
      const response = await getStudentDetails(studentId);
      setStudent(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadStudent();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center">
        Loading student...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-xl bg-white p-8 text-center">
        Student not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/mentor/students"
          className="rounded-lg border px-4 py-2 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
        </Link>

        <h1 className="text-3xl font-bold">Student Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-8">
          <div className="flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
              {student.user?.name?.charAt(0)}
            </div>

            <h2 className="mt-5 text-2xl font-bold">{student.user?.name}</h2>

            <p className="text-slate-500">{student.user?.enrollmentNo}</p>

            <span className="mt-4 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              {student.profileStatus}
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border bg-white p-8">
          <h2 className="mb-6 text-xl font-semibold">Student Information</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <User className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="font-semibold">{student.user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-semibold">{student.user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Mobile</p>
                <p className="font-semibold">{student.user?.mobileNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Course</p>
                <p className="font-semibold">{student.user?.course}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Group</p>
                <p className="font-semibold">{student.group}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Account Status</p>
                <p className="font-semibold">{student.accountStatus}</p>
              </div>
            </div>
          </div>

          <hr className="my-8" />

          <h2 className="mb-5 text-xl font-semibold">Parent Details</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Parent Name</p>

              <p className="font-semibold">{student.parentName}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Parent Email</p>

              <p className="font-semibold">{student.parentEmail}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Parent Mobile</p>

              <p className="font-semibold">{student.parentMobileNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
