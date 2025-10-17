import React, { useState, useEffect } from "react";

function ProgramForm_Filter({ onClose, onApply, initialFilter }) {
  const [filterBy, setFilterBy] = useState(initialFilter.filter_by || "none");
  const [order, setOrder] = useState(initialFilter.order || "asc");
  const [sortBy, setSortBy] = useState(initialFilter.sort_by || "code");

  const handleApply = () => {
    onApply({ filter_by: filterBy, sort_by: sortBy, order });
    onClose();
  };

  useEffect(() => {
    setFilterBy(initialFilter.filter_by || "none");
    setOrder(initialFilter.order || "asc");
    setSortBy(initialFilter.sort_by || "code");
  }, [initialFilter]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-6">
        <h2 className="text-lg font-bold text-gray-700">Filter Programs</h2>

        {/* filter by */}
        <div>
          <p className="font-medium mb-2 text-gray-600">Filter By</p>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="code"
                checked={filterBy === "code"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500">Program Code</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="name"
                checked={filterBy === "name"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500">Program Name</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="filterBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="college_code"
                checked={filterBy === "college_code"}
                onChange={(e) => setFilterBy(e.target.value)}
              />
              <span className="text-gray-500">College Code</span>
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
              <span className="text-gray-500">Ascending</span>
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
              <span className="text-gray-500">Descending</span>
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
                value="code"
                checked={sortBy === "code"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500">Program Code</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="name"
                checked={sortBy === "name"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500">Program Name</span>
            </label>
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                className="radio checked:bg-blue-300 border-gray-300"
                value="college_code"
                checked={sortBy === "college_code"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <span className="text-gray-500">College Code</span>
            </label>
          </div>
        </div>

        {/* buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button className="btn bg-white text-gray-500" onClick={onClose}>
            Cancel
          </button>
          <button className="btn bg-blue-300 text-white" onClick={handleApply}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramForm_Filter;
