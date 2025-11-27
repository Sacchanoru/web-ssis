import React, { useEffect, useState } from "react";
import "primeicons/primeicons.css";
import {
  getStudents,
  deleteStudent,
  getStudentImage,
} from "../../api/student_api";
import StudentForm_Add from "../forms/studentform_add";
import StudentForm_Edit from "../forms/studentform_edit";
import StudentForm_Filter from "../forms/studentform_filter";
import StudentDetailsModal from "../forms/studentdetails";
import Pagination from "../pagination";

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [studentImages, setStudentImages] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    filter_by: "none",
    order: "asc",
    sort_by: "firstname",
  });
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const fetchData = async (
    query = "",
    customFilters = filters,
    currentPage = page
  ) => {
    try {
      const data = await getStudents(
        query,
        customFilters.filter_by,
        customFilters.order,
        customFilters.sort_by,
        currentPage
      );
      const { data: rows, total_pages } = data;
      setStudents(rows);
      setMaxPage(total_pages || 1);

      const imagePromises = rows.map(async (student) => {
        try {
          const imgData = await getStudentImage(student.id);
          return { id: student.id, url: imgData?.supabase_public_url || null };
        } catch {
          return { id: student.id, url: null };
        }
      });
      const images = await Promise.all(imagePromises);
      const imageMap = {};
      images.forEach((img) => {
        imageMap[img.id] = img.url;
      });
      setStudentImages(imageMap);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchData(searchQuery, filters);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchData(searchQuery, filters, 1);
  }, [searchQuery]);

  useEffect(() => {
    fetchData(searchQuery, filters, page);
  }, [filters]);

  const handleSave = () => {
    fetchData();
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await deleteStudent(id);
      const updatedPage = Math.max(1, Math.min(page, maxPage));
      await fetchData(searchQuery, filters, updatedPage);
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Something went wrong while deleting.");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleRowClick = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const handleCloseDetails = () => {
    setSelectedStudentId(null);
  };

  const handleImageUpdate = () => {
    fetchData(searchQuery, filters, page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          className="btn bg-blue-300 text-white border-none"
          onClick={handleAdd}
        >
          <i className="pi pi-plus mr-2"></i>Add Student
        </button>

        <input
          type="text"
          placeholder="Search students..."
          className="input input-bordered w-full max-w-xs bg-white border-gray-600 text-gray-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button
          className="btn btn-outline btn-info"
          onClick={() => setShowFilter(true)}
        >
          <i className="pi pi-filter mr-2"></i>Filter
        </button>
      </div>

      {/* filter Modal */}
      {showFilter && (
        <StudentForm_Filter
          initialFilter={filters}
          onClose={() => setShowFilter(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            fetchData(searchQuery, newFilters);
            setShowFilter(false);
          }}
        />
      )}

      {/* add or edit modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          {editingStudent ? (
            <StudentForm_Edit
              student={editingStudent}
              onClose={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
              onSave={handleSave}
            />
          ) : (
            <StudentForm_Add
              onClose={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
              onSave={handleSave}
            />
          )}
        </div>
      )}

      {selectedStudentId && (
        <StudentDetailsModal
          studentId={selectedStudentId}
          onClose={handleCloseDetails}
          onImageUpdate={handleImageUpdate}
        />
      )}

      {/* table */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white text-black">
        <table className="table min-w-auto">
          <thead className="bg-blue-300 text-white">
            <tr>
              <th></th>
              <th>Student ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Course</th>
              <th>Year</th>
              <th>Gender</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-blue-100 cursor-pointer"
                onClick={() => handleRowClick(student.id)}
              >
                <td>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300 flex items-center justify-center">
                    {studentImages[student.id] ? (
                      <img
                        src={studentImages[student.id]}
                        alt={`${student.firstname} ${student.lastname}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="pi pi-user text-xl text-gray-400"></i>
                    )}
                  </div>
                </td>
                <td>{student.id}</td>
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.course || "—"}</td>
                <td>{student.year}</td>
                <td>{student.gender}</td>
                <td className="flex gap-2 justify-center">
                  <button
                    className="btn btn-ghost btn-md text-gray-500 border hover:bg-blue-200 hover:border-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(student);
                    }}
                  >
                    <i className="pi pi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-ghost btn-md text-red-500 border hover:bg-blue-200 hover:border-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(student.id);
                    }}
                  >
                    <i className="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        maxPage={maxPage}
        onPageChange={(newPage, fetchNow = false) => {
          if (typeof newPage !== "number" || isNaN(newPage)) return;
          const validPage = Math.min(Math.max(1, newPage), maxPage);
          setPage(validPage);
          if (fetchNow) fetchData(searchQuery, filters, validPage);
        }}
      />
    </div>
  );
}

export default StudentTable;
