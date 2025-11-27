import React, { useState, useEffect } from "react";
import {
  editStudent,
  studentExists,
  getStudentWithImage,
  uploadStudentImage,
  deleteStudentImage,
} from "../../api/student_api";
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
  const [currentImage, setCurrentImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

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
      fetchStudentImage();
    }
  }, [student]);

  const fetchStudentImage = async () => {
    try {
      const data = await getStudentWithImage(student.id);
      const imageUrl = data.image?.supabase_public_url
        ? `${data.image.supabase_public_url}?t=${Date.now()}`
        : null;
      setCurrentImage(imageUrl);
    } catch (err) {
      console.error("Error fetching student image:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const cancelImageChange = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteCurrentImage = async () => {
    if (!window.confirm("Are you sure you want to delete the current image?"))
      return;

    try {
      setUploading(true);
      await deleteStudentImage(student.id);
      setCurrentImage(null);
      setError("");
      await fetchStudentImage();
    } catch (err) {
      setError("Failed to delete image");
      console.error(err);
    } finally {
      setUploading(false);
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

    if (trimmedData.id !== originalId) {
      const exists = await studentExists(trimmedData.id);
      if (exists) {
        setError("That Student ID already exists! Please use another one.");
        return;
      }
    }

    try {
      setUploading(true);
      const editedStudent = await editStudent(originalId, trimmedData);

      if (imageFile) {
        try {
          await uploadStudentImage(trimmedData.id, imageFile);
        } catch (imgErr) {
          console.error("Error uploading image:", imgErr);
        }
      }

      if (onSave) onSave(editedStudent);
      onClose();
    } catch (err) {
      console.error("Error updating student:", err);
      setError("Something went wrong while saving changes.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-8 rounded-lg">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-blue-400">Edit Student</h2>

        <div className="mb-4 flex flex-col items-center space-y-3">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-300"
              />
            ) : currentImage ? (
              <img
                src={currentImage}
                alt="Current"
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
              onClick={cancelImageChange}
              disabled={uploading}
              className="btn btn-sm bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300 disabled:text-white"
            >
              <i className="pi pi-times mr-1"></i>Cancel Change
            </button>
          ) : (
            <div className="flex gap-2">
              <label className="btn btn-sm bg-blue-400 text-white hover:bg-blue-500 cursor-pointer disabled:bg-gray-300 disabled:text-white">
                <i className="pi pi-upload mr-1"></i>
                {currentImage ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {currentImage && (
                <button
                  onClick={handleDeleteCurrentImage}
                  disabled={uploading}
                  className="btn btn-sm bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 disabled:text-white flex items-center justify-center"
                >
                  {uploading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <i className="pi pi-trash mr-1"></i>Delete
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <input
            type="text"
            name="id"
            value={formData.id}
            placeholder="Student ID (e.g. 2023-1949)"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            onChange={handleChange}
            disabled={uploading}
          />

          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            placeholder="First Name"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            onChange={handleChange}
            disabled={uploading}
          />

          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            placeholder="Last Name"
            className="input input-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            onChange={handleChange}
            disabled={uploading}
          />

          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            disabled={uploading}
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
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
            value={formData.year}
            onChange={handleChange}
            disabled={uploading}
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
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
            value={formData.gender}
            onChange={handleChange}
            disabled={uploading}
            className="select select-bordered w-full bg-white text-gray-500 border border-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentForm_Edit;
