import api from "../../../services/api";

export const getMentors = async (params = {}) => {
  const response = await api.get("/academic/mentors", {
    params,
  });

  return response.data;
};

export const getMentorById = async (id) => {
  const response = await api.get(`/academic/mentors/${id}`);

  return response.data;
};

export const createMentor = async (data) => {
  const response = await api.post("/academic/mentors", data);

  return response.data;
};

export const updateMentor = async (id, data) => {
  const response = await api.patch(`/academic/mentors/${id}`, data);

  return response.data;
};

export const deleteMentor = async (id) => {
  const response = await api.delete(`/academic/mentors/${id}`);

  return response.data;
};
