import React, { useState } from "react";
import { addCollege } from "../../api/college_api";

function CollegeForm_Add({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (/^[a-zA-Z\s]*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError("");
    } else {
      setError("Only alphabetical letters and spaces are allowed.");
    }
  };

  const handleSubmit = async () => {
    //validation
    const trimmedData = {
      code: formData.code.trim(),
      name: formData.name.trim(),
    };
    if (!trimmedData.code || !trimmedData.name) {
      setError("Please fill out all fields.");
      return;
    }
    if (error) return;

    try {
      const newCollege = await addCollege(trimmedData);
      console.log("API returned:", newCollege);

      if (onSave) onSave(newCollege);
      onClose();
    } catch (err) {
      console.error("Error adding college:", err);
      const status = err.response?.status;
      const message = err.response?.data?.message || "";

      if (
        status === 400 ||
        status === 500 ||
        message.includes("already exists")
      ) {
        setError("College with this code already exists!");
      } else {
        setError("Failed to add college. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300">
        <h2 className="text-lg font-bold mb-4 text-blue-300">Add College</h2>

        <div className="grid gap-2">
          <input
            type="text"
            name="code"
            placeholder="College Code"
            value={formData.code}
            onChange={handleChange}
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
          />
          <input
            type="text"
            name="name"
            placeholder="College Name"
            value={formData.name}
            onChange={handleChange}
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
          />
        </div>

        {/* error message */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <div className="flex justify-end mt-4 gap-2">
          <button
            className="btn bg-gray-300 border-none text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn bg-blue-300 text-white border-none"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollegeForm_Add;
