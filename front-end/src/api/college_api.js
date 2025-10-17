import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const getColleges = async (
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
      `${API_BASE}/colleges/?${params.toString()}`
    );
    return response.data;
  } catch (err) {
    console.error("Error getting colleges:", err);
    throw err;
  }
};

export const addCollege = async (college) => {
  try {
    const response = await axios.post(`${API_BASE}/colleges/`, college);
    return response.data;
  } catch (err) {
    console.error("Error adding college:", err);
    throw err;
  }
};

export const deleteCollege = async (code) => {
  try {
    const response = await axios.delete(`${API_BASE}/colleges/${code}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting college:", err);
    throw err;
  }
};

export const editCollege = async (code, newData) => {
  try {
    const response = await axios.put(`${API_BASE}/colleges/${code}`, newData);
    return response.data;
  } catch (err) {
    console.error("Error editing college:", err);
    throw err;
  }
};

export const collegeExists = async (code) => {
  const res = await axios.get(`${API_BASE}/colleges/exists/${code}`);
  return res.data.exists;
};
