import React, { useState, useEffect } from "react";
import { editProgram, programExists } from "../../api/program_api";
import { getColleges } from "../../api/college_api";

function ProgramForm_Edit({ program, onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    college_code: "",
  });

  const [originalCode, setOriginalCode] = useState("");
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (program) {
      setFormData({
        code: program.code,
        name: program.name,
        college_code: program.college_code,
      });
      setOriginalCode(program.code);
    }
  }, [program]);

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
    const trimmedCode = formData.code.trim();
    const trimmedName = formData.name.trim();
    if (!trimmedCode || !trimmedName || !formData.college_code) {
      setError("Please fill out all fields properly.");
      return;
    }

    if (error) return;

    try {
      //check if program code alrdy exist
      if (trimmedCode !== originalCode) {
        const exists = await programExists(trimmedCode);
        if (exists) {
          setError("That Program Code already exists! Please use another one.");
          return;
        }
      }

      const editedProgram = await editProgram(originalCode, {
        ...formData,
        code: trimmedCode,
        name: trimmedName,
      });

      if (onSave) onSave(editedProgram);
      onClose();
    } catch (err) {
      console.error("Error updating program:", err);
      setError("Something went wrong while saving changes.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300">
        <h2 className="text-lg font-bold mb-4 text-blue-300">Edit Program</h2>

        <div className="grid gap-2">
          <input
            type="text"
            name="code"
            value={formData.code}
            placeholder="Program Code"
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
          />

          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Program Name"
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramForm_Edit;
