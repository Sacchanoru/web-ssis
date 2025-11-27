import apiClient from "./config";

export const registerUser = async (userData) => {
  try {
    const res = await apiClient.post("/users/register", userData);
    return res.data;
  } catch (err) {
    console.error("Error registering user:", err.response?.data || err);
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await apiClient.post("/users/login", credentials);
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    return { token, user };
  } catch (err) {
    console.error("Error logging in:", err.response?.data || err);
    throw err;
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await apiClient.get("/users/me");
    return res.data;
  } catch (err) {
    console.error("Error getting current user:", err.response?.data || err);
    throw err;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
