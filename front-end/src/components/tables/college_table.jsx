import React, { useEffect, useState } from "react";
import "primeicons/primeicons.css";
import { getColleges, deleteCollege } from "../../api/college_api";
import CollegeForm_Add from "../forms/collegeform_add";
import CollegeForm_Edit from "../forms/collegeform_edit";
import CollegeForm_Filter from "../forms/collegeform_filter";
import Pagination from "../pagination";

function CollegeTableSkeleton({ rows = 1 }) {
  return (
    <tbody>
      {[...Array(rows)].map((_, idx) => (
        <tr key={idx} className="animate-pulse">
          <td className="h-12 w-32 bg-gray-200 rounded"></td>
          <td className="h-12 w-64 bg-gray-200 rounded"></td>
          <td className="h-12 w-20 bg-gray-200 rounded"></td>
        </tr>
      ))}
    </tbody>
  );
}

function CollegeTable() {
  const [colleges, setColleges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    filter_by: "none",
    order: "asc",
    sort_by: "code",
  });
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async (
    query = "",
    customFilters = filters,
    currentPage = page
  ) => {
    try {
      setLoading(true);
      const data = await getColleges(
        query,
        customFilters.filter_by,
        customFilters.order,
        customFilters.sort_by,
        currentPage
      );
      const { data: rows, total_pages } = data;
      setColleges(rows);
      setMaxPage(total_pages || 1);
    } catch (err) {
      console.error("Error fetching colleges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchQuery, filters, page);
  }, [page, filters, searchQuery]);

  const handleSave = async () => {
    await fetchData(searchQuery, filters, page);
    setShowForm(false);
    setEditingCollege(null);
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this college?"))
      return;

    try {
      setLoading(true);
      await deleteCollege(code);

      const newPage = 1;
      setPage(newPage);
      setSearchInput("");
      setSearchQuery("");

      await new Promise((resolve) => setTimeout(resolve, 200));
      const data = await getColleges(
        "",
        filters.filter_by,
        filters.order,
        filters.sort_by,
        newPage
      );
      setColleges(data.data);
      setMaxPage(data.total_pages || 1);
    } catch (err) {
      console.error("Error deleting college:", err);
      alert("Something went wrong while deleting.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (college) => {
    setEditingCollege(college);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingCollege(null);
    setShowForm(true);
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      setSearchQuery(searchInput);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          className="btn bg-blue-300 text-white border-none"
          onClick={handleAdd}
        >
          <i className="pi pi-plus mr-2"></i>Add College
        </button>

        <input
          type="text"
          placeholder="Search colleges..."
          className="input input-bordered w-full max-w-xs bg-white border-gray-600 text-gray-600"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKey}
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
        <CollegeForm_Filter
          initialFilter={filters}
          onClose={() => setShowFilter(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
            fetchData(searchQuery, newFilters, 1);
            setShowFilter(false);
          }}
        />
      )}

      {/* add n edit modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          {editingCollege ? (
            <CollegeForm_Edit
              college={editingCollege}
              onClose={() => {
                setShowForm(false);
                setEditingCollege(null);
              }}
              onSave={handleSave}
            />
          ) : (
            <CollegeForm_Add
              onClose={() => {
                setShowForm(false);
                setEditingCollege(null);
              }}
              onSave={handleSave}
            />
          )}
        </div>
      )}

      {/* table */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white text-black">
        <table className="table min-w-auto">
          <thead className="bg-blue-300 text-white">
            <tr>
              <th>College Code</th>
              <th>College Name</th>
              <th></th>
            </tr>
          </thead>

          {loading ? (
            <CollegeTableSkeleton rows={1} />
          ) : (
            <tbody className="text-gray-700">
              {colleges.map((college) => (
                <tr key={college.code} className="hover:bg-blue-100">
                  <td>{college.code}</td>
                  <td>{college.name}</td>
                  <td className="flex gap-2 justify-center">
                    <button
                      className="btn btn-ghost btn-md text-gray-500 border hover:bg-blue-200 hover:border-gray-500"
                      onClick={() => handleEdit(college)}
                    >
                      <i className="pi pi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-ghost btn-md text-red-500 border hover:bg-blue-200 hover:border-gray-500"
                      onClick={() => handleDelete(college.code)}
                    >
                      <i className="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {colleges.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No colleges found.
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

export default CollegeTable;
