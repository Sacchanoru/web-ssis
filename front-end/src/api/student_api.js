import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const getStudents = async (
  search = "",
  filter_by = "none",
  order = "asc",
  sort_by = "id",
  page = 1,
  page_size = 10
) => {
  try {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (filter_by) params.append("filter_by", filter_by);
    if (order) params.append("order", order);
    if (sort_by) params.append("sort_by", sort_by);
    if (page) params.append("page", page);
    if (page_size) params.append("page_size", page_size);

    const response = await axios.get(
      `${API_BASE}/students/?${params.toString()}`
    );
    return response.data;
  } catch (err) {
    console.error("Error getting students:", err);
    throw err;
  }
};

export const addStudent = async (student) => {
  try {
    const response = await axios.post(`${API_BASE}/students/`, student);
    return response.data;
  } catch (err) {
    console.error("Error adding student:", err);
    throw err;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/students/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting student:", err);
    throw err;
  }
};

export const editStudent = async (id, newData) => {
  try {
    const response = await axios.put(`${API_BASE}/students/${id}`, newData);
    return response.data;
  } catch (err) {
    console.error("Error editing student:", err);
    throw err;
  }
};

export const studentExists = async (id) => {
  try {
    const res = await axios.get(`${API_BASE}/students/exists/${id}`);
    return res.data.exists;
  } catch (err) {
    console.error("Error checking student existence:", err);
    throw err;
  }
};

// === NEW IMAGE FUNCTIONS ===

export const getStudentWithImage = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/students/${id}/details`);
    return response.data;
  } catch (err) {
    console.error("Error getting student details:", err);
    throw err;
  }
};

export const uploadStudentImage = async (id, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(
      `${API_BASE}/students/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error uploading student image:", err);
    throw err;
  }
};

export const getStudentImage = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/students/${id}/image`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null; // No image found
    }
    console.error("Error getting student image:", err);
    throw err;
  }
};

export const deleteStudentImage = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/students/${id}/image`);
    return response.data;
  } catch (err) {
    console.error("Error deleting student image:", err);
    throw err;
  }
};
