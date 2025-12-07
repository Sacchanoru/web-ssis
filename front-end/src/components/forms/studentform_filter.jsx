import React, { useState, useEffect, useRef } from "react";
import { getAllProgramsUnpaginated } from "../../api/program_api";

function StudentForm_Filter({ onClose, onApply, initialFilter }) {
  const [filterBy, setFilterBy] = useState(initialFilter.filter_by || "none");
  const [order, setOrder] = useState(initialFilter.order || "asc");
  const [sortBy, setSortBy] = useState(initialFilter.sort_by || "id");

  const [filterYear, setFilterYear] = useState(
    initialFilter.filter_year || "none"
  );
  const [filterProgram, setFilterProgram] = useState(
    initialFilter.filter_program || "none"
  );
  const [filterGender, setFilterGender] = useState(
    initialFilter.filter_gender || "none"
  );

  const [programs, setPrograms] = useState([]);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const programDropdownRef = useRef(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getAllProgramsUnpaginated("asc", "code");
        setPrograms(data || []);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        programDropdownRef.current &&
        !programDropdownRef.current.contains(event.target)
      ) {
        setShowProgramDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    onApply({
      filter_by: filterBy,
      sort_by: sortBy,
      order,
      filter_year: filterYear,
      filter_program: filterProgram,
      filter_gender: filterGender,
    });
    onClose();
  };

  const handleReset = () => {
    setFilterYear("none");
    setFilterProgram("none");
    setFilterGender("none");
    setFilterBy("none");
    setOrder("asc");
    setSortBy("id");
  };

  useEffect(() => {
    setFilterBy(initialFilter.filter_by || "none");
    setOrder(initialFilter.order || "asc");
    setSortBy(initialFilter.sort_by || "id");
    setFilterYear(initialFilter.filter_year || "none");
    setFilterProgram(initialFilter.filter_program || "none");
    setFilterGender(initialFilter.filter_gender || "none");
  }, [initialFilter]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto space-y-6">
        <h2 className="text-lg font-bold text-gray-700">Filter Students</h2>
        <div className="border-2 border-blue-200 rounded-lg p-4 space-y-4 bg-blue-50">
          <div>
            <label className="block font-medium mb-2 text-gray-600">
              Year Level
            </label>
            <select
              className="select select-bordered w-full bg-white text-gray-600"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="none">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
              <option value="6">6th Year</option>
            </select>
          </div>

          {/* program filter */}
          <div className="relative" ref={programDropdownRef}>
            <label className="block font-medium mb-2 text-gray-600">
              Program
            </label>
            <button
              type="button"
              className="select select-bordered w-full bg-white text-gray-800 text-left flex justify-between items-center"
              onClick={() => setShowProgramDropdown(!showProgramDropdown)}
            >
              <span className={filterProgram === "none" ? "text-black" : ""}>
                {filterProgram === "none"
                  ? "All Programs"
                  : programs.find((p) => p.code === filterProgram)?.code +
                      " - " +
                      programs.find((p) => p.code === filterProgram)?.name ||
                    filterProgram}
              </span>
            </button>

            {showProgramDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div
                  className="px-4 py-2 hover:bg-blue-200 cursor-pointer"
                  onClick={() => {
                    setFilterProgram("none");
                    setShowProgramDropdown(false);
                  }}
                >
                  All Programs
                </div>
                {programs.map((prog) => (
                  <div
                    key={prog.code}
                    className={`px-4 py-2 hover:bg-blue-200 cursor-pointer ${
                      filterProgram === prog.code
                        ? "bg-blue-100 font-bold text-blue-700"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setFilterProgram(prog.code);
                      setShowProgramDropdown(false);
                    }}
                  >
                    {prog.code} - {prog.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* gender filter */}
          <div>
            <label className="block font-medium mb-2 text-gray-600">
              Gender
            </label>
            <select
              className="select select-bordered w-full bg-white text-gray-600"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="none">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* filter by */}
        <div>
          <p className="font-medium mb-2 text-gray-600 ">Search Filter By</p>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="id"
                checked={filterBy === "id"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500 ">Student ID</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="firstname"
                checked={filterBy === "firstname"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500 ">First Name</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="lastname"
                checked={filterBy === "lastname"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500 ">Last Name</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="course"
                checked={filterBy === "course"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500 ">Course</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="year"
                checked={filterBy === "year"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500 ">Year Level</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="gender"
                checked={filterBy === "gender"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500 ">Gender</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="none"
                checked={filterBy === "none"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500 ">None</span>
            </label>
          </div>
        </div>

        {/* order */}
        <div>
          <p className="font-medium mb-2 text-gray-600">Order</p>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="order"
                className="radio checked:bg-blue-300 border-gray-300"
                value="asc"
                checked={order === "asc"}
                onChange={(e) => setOrder(e.target.value)}
              />
              <span className="text-gray-500 ">Ascending</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="order"
                className="radio checked:bg-blue-300 border-gray-300"
                value="desc"
                checked={order === "desc"}
                onChange={(e) => setOrder(e.target.value)}
              />
              <span className="text-gray-500 ">Descending</span>
            </label>
          </div>
        </div>

        {/* sort by */}
        <div>
          <p className="font-medium mb-2 text-gray-600">Sort By</p>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="id"
                checked={sortBy === "id"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500 ">Student ID</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="firstname"
                checked={sortBy === "firstname"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500 ">First Name</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="lastname"
                checked={sortBy === "lastname"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500 ">Last Name</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="course"
                checked={sortBy === "course"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500 ">Course</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="year"
                checked={sortBy === "year"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500 ">Year Level</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="gender"
                checked={sortBy === "gender"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500 ">Gender</span>
            </label>
          </div>
        </div>

        {/* el butones */}
        <div className="flex justify-between gap-2 pt-4">
          <button
            className="btn bg-gray-300 text-gray-700"
            onClick={handleReset}
          >
            Reset All
          </button>
          <div className="flex gap-2">
            <button className="btn bg-white text-gray-500" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn bg-blue-300 text-white"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentForm_Filter;
