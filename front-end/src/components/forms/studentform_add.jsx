import React, { useState, useEffect } from "react";
import { addStudent } from "../../api/student_api";
import { getPrograms } from "../../api/program_api";

function StudentForm_Add({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    course: "",
    year: "",
    gender: "",
  });

  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllPrograms = async () => {
      try {
        const firstPage = await getPrograms("", "none", "asc", "code", 1);
        const { data: firstData, total_pages } = firstPage;
        let allPrograms = [...firstData];

        for (let p = 2; p <= total_pages; p++) {
          const nextPage = await getPrograms("", "none", "asc", "code", p);
          allPrograms = [...allPrograms, ...nextPage.data];
        }

        setPrograms(allPrograms);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    fetchAllPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //validation
  const validateForm = () => {
    const { id, firstname, lastname, course, year, gender } = formData;
    const idPattern = /^\d{4}-\d{4}$/;
    const namePattern = /^[A-Za-z\s]+$/;
    const trimmedFirst = firstname.trim();
    const trimmedLast = lastname.trim();

    if (!id || !idPattern.test(id))
      return "Student ID must follow the format XXXX-XXXX (e.g., 2023-1949).";
    if (!trimmedFirst)
      return "First name is required and cannot be only spaces.";
    if (!namePattern.test(trimmedFirst))
      return "First name can only contain letters and spaces.";
    if (!trimmedLast) return "Last name is required and cannot be only spaces.";
    if (!namePattern.test(trimmedLast))
      return "Last name can only contain letters and spaces.";
    if (!course) return "Please select a program.";
    if (!year) return "Please select a year level.";
    if (!gender) return "Please select gender.";

    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const newStudent = await addStudent({
        ...formData,
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
      });
      if (onSave) onSave(newStudent);
      onClose();
    } catch (err) {
      console.error("Error adding student:", err);
      setError("Failed to add student. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300 shadow-md">
        <h2 className="text-lg font-bold mb-4 text-blue-400">Add Student</h2>

        {error && (
          <div className="text-red-500 text-sm mb-2 border border-red-300 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-2">
          <input
            type="text"
            name="id"
            placeholder="Student ID (e.g., 2023-1949)"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400"
            value={formData.id}
            onChange={handleChange}
            maxLength={9}
          />
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400"
            value={formData.firstname}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400"
            value={formData.lastname}
            onChange={handleChange}
          />
          <select
            name="course"
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400"
            value={formData.course}
            onChange={handleChange}
          >
            <option value="">Select Program Code</option>
            {programs.map((program) => (
              <option key={program.code} value={program.code}>
                {program.code}
              </option>
            ))}
          </select>
          <select
            name="year"
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400"
            value={formData.year}
            onChange={handleChange}
          >
            <option value="">Select Year Level</option>
            {[1, 2, 3, 4, 5, 6].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            name="gender"
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            className="btn bg-gray-300 border-none text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn bg-blue-400 text-white border-none hover:bg-blue-500"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentForm_Add;
