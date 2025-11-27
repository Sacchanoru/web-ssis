import React, { useState, useEffect } from "react";
import { getStudentWithImage } from "../../api/student_api";

function StudentDetailsModal({ studentId, onClose }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const data = await getStudentWithImage(studentId);
      if (data.image?.supabase_public_url) {
        data.image.supabase_public_url = `${
          data.image.supabase_public_url
        }?t=${Date.now()}`;
      }
      setStudent(data);
      setError("");
    } catch (err) {
      setError("Failed to load student details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-white p-8 rounded-lg">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
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
              {student.image?.supabase_public_url ? (
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
