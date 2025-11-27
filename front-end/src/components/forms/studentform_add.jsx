import React, { useState, useEffect } from "react";
import { addStudent, uploadStudentImage } from "../../api/student_api";
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (PNG, JPG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

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
      setUploading(true);
      const newStudent = await addStudent({
        ...formData,
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
      });

      if (imageFile) {
        try {
          await uploadStudentImage(newStudent.id, imageFile);
        } catch (imgErr) {
          console.error("Error uploading image:", imgErr);
        }
      }

      if (onSave) onSave(newStudent);
      onClose();
    } catch (err) {
      console.error("Error adding student:", err);
      setError("Failed to add student. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300 shadow-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-blue-400">Add Student</h2>

        {error && (
          <div className="text-red-500 text-sm mb-2 border border-red-300 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="mb-4 flex flex-col items-center space-y-3">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-blue-300 flex items-center justify-center">
                <i className="pi pi-user text-4xl text-gray-400"></i>
              </div>
            )}
          </div>

          {imagePreview ? (
            <button
              onClick={removeImage}
              disabled={uploading}
              className="btn btn-sm bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300 disabled:text-white"
            >
              <i className="pi pi-times mr-1"></i>Remove Image
            </button>
          ) : (
            <label className="btn btn-sm bg-blue-400 text-white hover:bg-blue-500 cursor-pointer disabled:bg-gray-300 disabled:text-white">
              <i className="pi pi-upload mr-1"></i>Upload Image (Optional)
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>

        <div className="grid gap-2">
          <input
            type="text"
            name="id"
            placeholder="Student ID (e.g., 2023-1949)"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            value={formData.id}
            onChange={handleChange}
            maxLength={9}
            disabled={uploading}
          />
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            value={formData.firstname}
            onChange={handleChange}
            disabled={uploading}
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            value={formData.lastname}
            onChange={handleChange}
            disabled={uploading}
          />
          <select
            name="course"
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            value={formData.course}
            onChange={handleChange}
            disabled={uploading}
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
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            value={formData.year}
            onChange={handleChange}
            disabled={uploading}
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
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            value={formData.gender}
            onChange={handleChange}
            disabled={uploading}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            className="btn bg-gray-300 border-none text-white disabled:bg-gray-200 disabled:text-white"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            className="btn flex items-center justify-center bg-blue-400 text-white border-none hover:bg-blue-500 disabled:bg-blue-300 disabled:text-white"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Adding...
              </>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentForm_Add;
