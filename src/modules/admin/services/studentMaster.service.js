import api from "../../../services/api";

// Fetch all students from StudentMaster
export const getStudentMasterRecords = async () => {
  return api.get("/academic/students");
};
