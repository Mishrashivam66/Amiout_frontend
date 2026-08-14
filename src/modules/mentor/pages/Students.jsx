import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { getStudents, unlockStudent } from "../services/mentor.service";

import StudentTable from "../components/students/StudentTable";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const response = await getStudents();

        setStudents(response.data || []);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // ==========================================
  // Unlock Student Profile
  // ==========================================

  const handleUnlock = async (studentId) => {
    try {
      await unlockStudent(studentId);

      toast.success("Profile unlocked successfully");

      const response = await getStudents();

      setStudents(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Unable to unlock profile");
    }
  };

  return (
    <StudentTable
      students={students}
      loading={loading}
      onUnlock={handleUnlock}
    />
  );
}
