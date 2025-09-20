import React, { useState } from "react";

function StudentForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    program: "",
    year: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300">
        <h2 className="text-lg font-bold mb-4 text-blue-300">Add Student</h2>

        <div className="grid gap-2">
            <input type="text" name="id" placeholder="Student ID" className="input input-bordered w-full bg-white text-gray-400 border border-gray-400" onChange={handleChange} />
            <input type="text" name="first_name" placeholder="First Name" className="input input-bordered w-full bg-white text-gray-400 border border-gray-400" onChange={handleChange} />
            <input type="text" name="last_name" placeholder="Last Name" className="input input-bordered w-full bg-white text-gray-400 border border-gray-400" onChange={handleChange} />
            <input type="text" name="program" placeholder="Program" className="input input-bordered w-full bg-white text-gray-400 border border-gray-400" onChange={handleChange} />
            <select
                name="year"
                className="select select-bordered w-full bg-white text-gray-400 border border-gray-400"
                onChange={handleChange}
                defaultValue="">
                <option value="" disabled>
                Select Year
                </option>
                {[1, 2, 3, 4, 5, 6].map((year) => (
                <option key={year} value={year}>
                    {year}
                </option>
                ))}
            </select>
            <select
                name="gender"
                className="select select-bordered w-full bg-white text-gray-400 border border-gray-400"
                onChange={handleChange}
                defaultValue="">
                <option value="" disabled>
                Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button className="btn bg-gray-300 border-none text-white" onClick={onClose}>
            Cancel
          </button>
          <button className="btn bg-blue-300 text-white border-none" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;
