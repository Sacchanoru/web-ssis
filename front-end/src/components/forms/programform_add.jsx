import React, { useState, useEffect } from "react";
import { addProgram } from "../../api/program_api";
import { getColleges } from "../../api/college_api";

function ProgramForm_Add({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    college_code: "",
  });

  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllColleges = async () => {
      try {
        const firstPage = await getColleges("", "none", "asc", "code", 1);
        const { data: firstData, total_pages } = firstPage;

        let allColleges = [...firstData];
        for (let p = 2; p <= total_pages; p++) {
          const nextPage = await getColleges("", "none", "asc", "code", p);
          allColleges = [...allColleges, ...nextPage.data];
        }

        setColleges(allColleges);
      } catch (err) {
        console.error("Error fetching colleges:", err);
      }
    };

    fetchAllColleges();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "code" || name === "name") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
      } else {
        setError("Only letters and spaces are allowed.");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    //val;idation
    const trimmedCode = formData.code.trim();
    const trimmedName = formData.name.trim();
    if (!trimmedCode || !trimmedName || !formData.college_code) {
      setError("Please fill out all fields properly.");
      return;
    }

    if (error) return;

    try {
      // convert only Program Code to uppercase
      const newProgram = await addProgram({
        ...formData,
        code: trimmedCode.toUpperCase(),
        name: trimmedName,
      });

      if (onSave) onSave(newProgram);
      onClose();
    } catch (err) {
      console.error("Error adding program:", err);
      setError("Failed to add program. It may already exist.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300">
        <h2 className="text-lg font-bold mb-4 text-blue-300">Add Program</h2>

        <div className="grid gap-2">
          <input
            type="text"
            name="code"
            placeholder="Program Code"
            value={formData.code}
            onChange={handleChange}
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
          />
          <input
            type="text"
            name="name"
            placeholder="Program Name"
            value={formData.name}
            onChange={handleChange}
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
          />

          <select
            name="college_code"
            className="select select-bordered w-full bg-white text-gray-700 border border-gray-400"
            value={formData.college_code}
            onChange={handleChange}
          >
            <option value="">Select College Code</option>
            {colleges.map((college) => (
              <option key={college.code} value={college.code}>
                {college.code}
              </option>
            ))}
          </select>
        </div>

        {/* error msg */}
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

export default ProgramForm_Add;
