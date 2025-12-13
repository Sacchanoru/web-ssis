import apiClient from "./config";

export const getStudents = async (
  search = "",
  filter_by = "none",
  order = "asc",
  sort_by = "id",
  page = 1,
  page_size = 10,
  filter_year = null,
  filter_program = null,
  filter_gender = null
) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filter_by) params.append("filter_by", filter_by);
    if (order) params.append("order", order);
    if (sort_by) params.append("sort_by", sort_by);
    if (page) params.append("page", page);
    if (page_size) params.append("page_size", page_size);

    if (filter_year && filter_year !== "none")
      params.append("filter_year", filter_year);
    if (filter_program && filter_program !== "none")
      params.append("filter_program", filter_program);
    if (filter_gender && filter_gender !== "none")
      params.append("filter_gender", filter_gender);

    const response = await apiClient.get(`/students/?${params.toString()}`);
    return response.data;
  } catch (err) {
    console.error("Error getting students:", err);
    throw err;
  }
};

export const addStudent = async (student) => {
  const response = await apiClient.post("/students/", student);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await apiClient.delete(`/students/${id}`);
  return response.data;
};

export const editStudent = async (id, newData) => {
  const response = await apiClient.put(`/students/${id}`, newData);
  return response.data;
};

export const studentExists = async (id) => {
  const res = await apiClient.get(`/students/exists/${id}`);
  return res.data.exists;
};

export const getStudentWithImage = async (id) => {
  const response = await apiClient.get(`/students/${id}/details`);
  return response.data;
};

export const uploadStudentImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await apiClient.post(`/students/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getStudentImage = async (id) => {
  try {
    const response = await apiClient.get(`/students/${id}/image`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};

export const deleteStudentImage = async (id) => {
  const response = await apiClient.delete(`/students/${id}/image`);
  return response.data;
};

export const getStudentCountByYear = async (year) => {
  try {
    const response = await apiClient.get(`/students/count/year/${year}`);
    return response.data;
  } catch (err) {
    console.error("Error getting student count by year:", err);
    throw err;
  }
};

export const getStudentCountByProgram = async (programCode) => {
  try {
    const response = await apiClient.get(
      `/students/count/program/${programCode}`
    );
    return response.data;
  } catch (err) {
    console.error("Error getting student count by program:", err);
    throw err;
  }
};

export const getStudentCountByGender = async (gender) => {
  try {
    const response = await apiClient.get(`/students/count/gender/${gender}`);
    return response.data;
  } catch (err) {
    console.error("Error getting student count by gender:", err);
    throw err;
  }
};
