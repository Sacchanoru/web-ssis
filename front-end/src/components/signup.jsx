import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { registerUser } from "../api/user_api";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    //validation
    const trimmedEmail = form.email.trim().toLowerCase();
    if (!trimmedEmail.endsWith("@gmail.com")) {
      setError("Only Gmail addresses (@gmail.com) are allowed.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await registerUser({
        username: form.username.trim(),
        email: trimmedEmail,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to register. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Create Account
        </h1>

        <form onSubmit={handleSignup}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="input input-bordered w-full mb-3 bg-[#ffffff] text-black border-gray-300"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email (must be @gmail.com)"
            className="input input-bordered w-full mb-3 bg-[#ffffff] text-black border-gray-300"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password (min 6 characters)"
            className="input input-bordered w-full mb-3 bg-[#ffffff] text-black border-gray-300"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input input-bordered w-full mb-4 bg-[#ffffff] text-black border-gray-300"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-2 border border-red-300 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Signup;
