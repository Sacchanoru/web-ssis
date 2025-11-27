import React, { useState, useEffect } from "react";
import {
  getStudentWithImage,
  uploadStudentImage,
  deleteStudentImage,
  getStudentImage,
} from "../../api/student_api";

// Skeleton Loader Component
function StudentDetailsSkeleton({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-pulse">
        {/* Header */}
        <div className="sticky top-0 bg-blue-300 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="h-6 w-48 bg-blue-400 rounded"></div>
          <div className="h-6 w-6 bg-blue-400 rounded-full"></div>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 rounded-full bg-gray-200 border-4 border-blue-300"></div>

            {/* Buttons */}
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-gray-300 rounded"></div>
              <div className="h-10 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Student Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-6 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-lg border-t">
          <div className="h-10 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function StudentDetailsModal({ studentId, onClose, onImageUpdate }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const data = await getStudentWithImage(studentId);
      setStudent(data);
      setError("");
    } catch (err) {
      setError("Failed to load student details");
      console.error(err);
    } finally {
      setLoading(false);
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
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    try {
      setUploading(true);
      setError("");
      await uploadStudentImage(studentId, imageFile);
      await fetchStudentDetails();
      setImageFile(null);
      setImagePreview(null);

      if (onImageUpdate) onImageUpdate();
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      setUploading(true);
      await deleteStudentImage(studentId);
      await fetchStudentDetails();

      if (onImageUpdate) onImageUpdate();
    } catch (err) {
      setError("Failed to delete image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const cancelPreview = () => {
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  // Show skeleton while loading
  if (loading) {
    return <StudentDetailsSkeleton onClose={onClose} />;
  }

  if (!student) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-white p-8 rounded-lg">
          <p className="text-red-500">Student not found</p>
          <button className="btn mt-4" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-300 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Student Details</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-white hover:bg-blue-400"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-48 h-48 rounded-full object-cover border-4 border-blue-300"
                />
              ) : student.image?.supabase_public_url ? (
                <img
                  src={student.image.supabase_public_url}
                  alt={`${student.firstname} ${student.lastname}`}
                  className="w-48 h-48 rounded-full object-cover border-4 border-blue-300"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-200 border-4 border-blue-300 flex items-center justify-center">
                  <i className="pi pi-user text-6xl text-gray-400"></i>
                </div>
              )}
            </div>

            {imagePreview ? (
              <div className="flex gap-2">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn bg-green-500 text-white hover:bg-green-600"
                >
                  {uploading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <i className="pi pi-check mr-2"></i>Confirm Upload
                    </>
                  )}
                </button>
                <button
                  onClick={cancelPreview}
                  disabled={uploading}
                  className="btn bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <label className="btn bg-blue-400 text-white hover:bg-blue-500 cursor-pointer">
                  <i className="pi pi-upload mr-2"></i>
                  {student.image ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {student.image && (
                  <button
                    onClick={handleDeleteImage}
                    disabled={uploading}
                    className="btn bg-red-500 text-white hover:bg-red-600"
                  >
                    {uploading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <i className="pi pi-trash mr-2"></i>Delete
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <i className="pi pi-exclamation-triangle"></i>
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="divider"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-semibold text-gray-600">Student ID:</label>
              <p className="text-lg text-gray-800">{student.id}</p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-600">Gender:</label>
              <p className="text-lg text-gray-800">{student.gender}</p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-600">First Name:</label>
              <p className="text-lg text-gray-800">{student.firstname}</p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-600">Last Name:</label>
              <p className="text-lg text-gray-800">{student.lastname}</p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-600">Program:</label>
              <p className="text-lg text-gray-800">
                {student.program_name || student.course || "—"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-600">Year Level:</label>
              <p className="text-lg text-gray-800">{student.year}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-lg border-t">
          <button
            onClick={onClose}
            className="btn bg-blue-400 text-white w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsModal;
