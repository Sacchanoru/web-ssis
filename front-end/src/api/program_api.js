import apiClient from "./config";

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

    const response = await apiClient.get(`/programs/?${params.toString()}`);
    return response.data;
  } catch (err) {
    console.error("Error getting programs:", err);
    throw err;
  }
};

export const addProgram = async (program) => {
  const response = await apiClient.post("/programs/", program);
  return response.data;
};

export const deleteProgram = async (code) => {
  const response = await apiClient.delete(`/programs/${code}`);
  return response.data;
};

export const editProgram = async (code, newData) => {
  const response = await apiClient.put(`/programs/${code}`, newData);
  return response.data;
};

export const programExists = async (code) => {
  const res = await apiClient.get(`/programs/exists/${code}`);
  return res.data.exists;
};
