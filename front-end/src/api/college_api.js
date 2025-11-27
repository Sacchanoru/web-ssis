import apiClient from "./config";

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

    const response = await apiClient.get(`/colleges/?${params.toString()}`);
    return response.data;
  } catch (err) {
    console.error("Error getting colleges:", err);
    throw err;
  }
};

export const addCollege = async (college) => {
  const response = await apiClient.post("/colleges/", college);
  return response.data;
};

export const deleteCollege = async (code) => {
  const response = await apiClient.delete(`/colleges/${code}`);
  return response.data;
};

export const editCollege = async (code, newData) => {
  const response = await apiClient.put(`/colleges/${code}`, newData);
  return response.data;
};

export const collegeExists = async (code) => {
  const res = await apiClient.get(`/colleges/exists/${code}`);
  return res.data.exists;
};
