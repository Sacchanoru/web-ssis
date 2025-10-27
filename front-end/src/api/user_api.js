import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// attach token to headers automatically
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

//  register new user
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/users/register`, userData);
    return res.data;
  } catch (err) {
    console.error("Error registering user:", err.response?.data || err);
    throw err;
  }
};

// logs in a user (returns JWT token)
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE}/users/login`, credentials);
    const { token, user } = res.data;

    // stores token in local storage for future request
    localStorage.setItem("token", token);

    return { token, user };
  } catch (err) {
    console.error("Error logging in:", err.response?.data || err);
    throw err;
  }
};

// fetch the current user using token
export const getCurrentUser = async () => {
  try {
    const headers = getAuthHeaders();
    const res = await axios.get(`${API_BASE}/users/me`, { headers });
    return res.data;
  } catch (err) {
    console.error("Error getting current user:", err.response?.data || err);
    throw err;
  }
};

// for front-end logout logic
export const logoutUser = () => {
  localStorage.removeItem("token");
};
