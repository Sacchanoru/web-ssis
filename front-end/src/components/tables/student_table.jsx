import React, { useEffect, useState } from "react";
import "primeicons/primeicons.css";
import { getStudents, deleteStudent } from "../../api/student_api";
import StudentForm_Add from "../forms/studentform_add";
import StudentForm_Edit from "../forms/studentform_edit";
import StudentForm_Filter from "../forms/studentform_filter";
import StudentDetailsModal from "../forms/studentdetails";
import Pagination from "../pagination";

function TableSkeleton({ rows = 1 }) {
  return (
    <tbody>
      {[...Array(rows)].map((_, idx) => (
        <tr key={idx} className="animate-pulse">
          <td className="h-12 w-32 bg-gray-200 rounded"></td>
          <td className="h-12 w-32 bg-gray-200 "></td>
          <td className="h-12 w-24 bg-gray-200 "></td>
          <td className="h-12 w-24 bg-gray-200 "></td>
          <td className="h-12 w-24 bg-gray-200 "></td>
          <td className="h-12 w-16 bg-gray-200 "></td>
          <td className="h-12 w-16 bg-gray-200 "></td>
          <td className="h-12 w-20 bg-gray-200 rounded"></td>
        </tr>
      ))}
    </tbody>
  );
}

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    filter_by: "none",
    order: "asc",
    sort_by: "firstname",
    filter_year: "none",
    filter_program: "none",
    filter_gender: "none",
  });
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (
    query = "",
    customFilters = filters,
    currentPage = page
  ) => {
    try {
      setLoading(true);
      const data = await getStudents(
        query,
        customFilters.filter_by,
        customFilters.order,
        customFilters.sort_by,
        currentPage,
        10,
        customFilters.filter_year,
        customFilters.filter_program,
        customFilters.filter_gender
      );
      const { data: rows, total_pages } = data;
      const rowsWithTimestamp = rows.map((row) => ({
        ...row,
        image_url: row.image_url ? `${row.image_url}?t=${Date.now()}` : null,
      }));
      setStudents(rowsWithTimestamp);
      setMaxPage(total_pages || 1);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchQuery, filters, page);
  }, [refreshKey, page, filters, searchQuery]);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await fetchData(searchQuery, filters, page);
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await deleteStudent(id);

      setPage(1);
      setSearchQuery("");
      setSearchInput("");
      await fetchData("", filters, 1);
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

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      setSearchQuery(searchInput);
    }
  };

  const hasActiveFilters =
    filters.filter_year !== "none" ||
    filters.filter_program !== "none" ||
    filters.filter_gender !== "none";

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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />

        <button
          className={`btn ${
            hasActiveFilters ? "btn-info" : "btn-outline btn-info"
          }`}
          onClick={() => setShowFilter(true)}
        >
          <i className="pi pi-filter mr-2"></i>
          {hasActiveFilters ? "Filtered" : "Filter"}
        </button>
      </div>

      {/* active filter */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <i className="pi pi-filter"></i>
            <span className="font-medium">Active Filters:</span>
            {filters.filter_year !== "none" && (
              <span className="badge badge-info">
                Year {filters.filter_year}
              </span>
            )}
            {filters.filter_program !== "none" && (
              <span className="badge badge-info">{filters.filter_program}</span>
            )}
            {filters.filter_gender !== "none" && (
              <span className="badge badge-info">{filters.filter_gender}</span>
            )}
          </div>
          <button
            className="btn btn-sm btn-ghost text-blue-700"
            onClick={() => {
              setFilters({
                ...filters,
                filter_year: "none",
                filter_program: "none",
                filter_gender: "none",
              });
              setPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {showFilter && (
        <StudentForm_Filter
          initialFilter={filters}
          onClose={() => setShowFilter(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
        />
      )}

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
        />
      )}

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white text-black">
        <table className="table min-w-auto">
          <thead className="bg-blue-300 text-white">
            <tr>
              <th>Image</th>
              <th>Student ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Course</th>
              <th>Year</th>
              <th>Gender</th>
              <th></th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton rows={5} />
          ) : (
            <tbody className="text-gray-700">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleRowClick(student.id)}
                >
                  <td>
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {student.image_url ? (
                        <img
                          src={student.image_url}
                          alt={`${student.firstname} ${student.lastname}`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <i className="pi pi-user text-gray-400 text-3xl"></i>
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
          )}
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
