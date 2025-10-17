import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginUser } from "../api/user_api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token, user } = await loginUser(form);
      console.log("Logged in:", user);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-2 border-gray-300">
        <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Log In
        </h1>

        <form onSubmit={handleLogin}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="input input-bordered w-full mb-3 bg-[#ffffff] text-black border-gray-300"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="input input-bordered w-full mb-4 bg-[#ffffff] text-black border-gray-300"
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <NavLink
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
