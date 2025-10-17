import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const getPrograms = async (
  search = "",
  filter_by = "none",
  order = "asc",
  sort_by = "code",
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
      `${API_BASE}/programs/?${params.toString()}`
    );
    return response.data;
  } catch (err) {
    console.error("Error getting programs:", err);
    throw err;
  }
};

// add program
export const addProgram = async (program) => {
  try {
    const response = await axios.post(`${API_BASE}/programs/`, program);
    return response.data;
  } catch (err) {
    console.error("Error adding program:", err);
    throw err;
  }
};

// delete program
export const deleteProgram = async (code) => {
  try {
    const response = await axios.delete(`${API_BASE}/programs/${code}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting program:", err);
    throw err;
  }
};

// edit program
export const editProgram = async (code, newData) => {
  try {
    const response = await axios.put(`${API_BASE}/programs/${code}`, newData);
    return response.data;
  } catch (err) {
    console.error("Error editing program:", err);
    throw err;
  }
};

// check if prog alrdy exists
export const programExists = async (code) => {
  try {
    const res = await axios.get(`${API_BASE}/programs/exists/${code}`);
    return res.data.exists;
  } catch (err) {
    console.error("Error checking program existence:", err);
    throw err;
  }
};
