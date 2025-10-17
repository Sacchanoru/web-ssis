import React, { useState, useEffect } from "react";
import { editCollege, collegeExists } from "../../api/college_api";

function CollegeForm_Edit({ college, onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });
  const [originalCode, setOriginalCode] = useState("");
  const [error, setError] = useState("");

  // 🧩 Pre-fill form when college is passed in
  useEffect(() => {
    if (college) {
      setFormData({
        code: college.code,
        name: college.name,
      });
      setOriginalCode(college.code);
    }
  }, [college]);

  // 🧠 Handle input + validate letters + spaces only
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
    //validattion
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
      // checks if code, verify uniqueness
      if (trimmedData.code !== originalCode) {
        const exists = await collegeExists(trimmedData.code);
        if (exists) {
          setError("That College Code already exists! Please use another one.");
          return;
        }
      }

      // updates college
      const editedCollege = await editCollege(originalCode, trimmedData);
      console.log("Updated college:", editedCollege);

      if (onSave) onSave(editedCollege);
      onClose();
    } catch (err) {
      console.error("Error updating college:", err);
      setError("Something went wrong while saving changes.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300">
        <h2 className="text-lg font-bold mb-4 text-blue-300">Edit College</h2>

        <div className="grid gap-2">
          <input
            type="text"
            name="code"
            value={formData.code}
            placeholder="College Code"
            onChange={handleChange}
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="College Name"
            onChange={handleChange}
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
          />
        </div>

        {/* error msg */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollegeForm_Edit;
