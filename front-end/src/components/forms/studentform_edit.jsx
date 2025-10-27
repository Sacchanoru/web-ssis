import React, { useState, useEffect } from "react";
import { editStudent, studentExists } from "../../api/student_api";
import { getPrograms } from "../../api/program_api";

function StudentForm_Edit({ student, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    course: "",
    year: "",
    gender: "",
  });

  const [originalId, setOriginalId] = useState("");
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id,
        firstname: student.firstname,
        lastname: student.lastname,
        course: student.course,
        year: student.year,
        gender: student.gender,
      });
      setOriginalId(student.id);
    }
  }, [student]);

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

    if (name === "firstname" || name === "lastname") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
      } else {
        setError("Names can only contain letters and spaces.");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const trimmedData = {
      id: formData.id.trim(),
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      course: formData.course.trim(),
      year: formData.year,
      gender: formData.gender.trim(),
    };

    if (
      !trimmedData.id ||
      !trimmedData.firstname ||
      !trimmedData.lastname ||
      !trimmedData.course ||
      !trimmedData.year ||
      !trimmedData.gender
    ) {
      setError("Please fill out all fields properly.");
      return;
    }

    const idPattern = /^\d{4}-\d{4}$/;
    if (!idPattern.test(trimmedData.id)) {
      setError(
        "Student ID must follow the XXXX-XXXX format (e.g., 2023-1949)."
      );
      return;
    }

    if (trimmedData.year < 1 || trimmedData.year > 6) {
      setError("Year level must be between 1 and 6.");
      return;
    }

    // check duplicate id if changed
    if (trimmedData.id !== originalId) {
      const exists = await studentExists(trimmedData.id);
      if (exists) {
        setError("That Student ID already exists! Please use another one.");
        return;
      }
    }

    try {
      const editedStudent = await editStudent(originalId, trimmedData);
      if (onSave) onSave(editedStudent);
      onClose();
    } catch (err) {
      console.error("Error updating student:", err);
      setError("Something went wrong while saving changes.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300">
        <h2 className="text-lg font-bold mb-4 text-blue-300">Edit Student</h2>

        <div className="grid gap-2">
          <input
            type="text"
            name="id"
            value={formData.id}
            placeholder="Student ID (e.g. 2023-1949)"
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
          />

          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            placeholder="First Name"
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            placeholder="Last Name"
            className={`input input-bordered w-full bg-white text-gray-700 border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
          />

          <select
            name="course"
            className="select select-bordered w-full bg-white text-gray-700 border border-gray-400"
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
            className="select select-bordered w-full bg-white text-gray-700 border border-gray-400"
            value={formData.year}
            onChange={handleChange}
          >
            <option value="">Select Year Level</option>
            {[1, 2, 3, 4, 5, 6].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            name="gender"
            className="select select-bordered w-full bg-white text-gray-700 border border-gray-400"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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

export default StudentForm_Edit;
