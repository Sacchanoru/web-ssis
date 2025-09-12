import React from "react";
import "primeicons/primeicons.css";

function CollegeTable() {
  // Change to Axios fetch later
  const colleges = [
    {
      code: "CCS",
      name: "College of Computer Studies",
    },
    {
      code: "CBA",
      name: "College of Business Administration",
    },
    {
      code: "COE",
      name: "College of Education",
    },
    {
      code: "CON",
      name: "College of Nursing",
    },
    {
      code: "CEA",
      name: "College of Engineering and Architecture",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white text-black">
      <table className="table min-w-auto">
        {/* Table Head */}
        <thead className="bg-blue-300 text-white">
          <tr>
            <th>College Code <i className="pi pi-sort-down-fill"></i></th>
            <th>College Name <i className="pi pi-sort-down"></i></th>
            <th></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-gray-700">
          {colleges.map((college) => (
            <tr key={college.code} className="hover:bg-blue-100">
              <td>{college.code}</td>
              <td>{college.name}</td>
              <td className="flex gap-2 justify-center">
                <button className="btn btn-ghost btn-md text-gray-500 border hover:bg-blue-200 hover:border-gray-500">
                  <i className="pi pi-pencil"></i>
                </button>
                <button className="btn btn-ghost btn-md text-red-500 border hover:bg-blue-200 hover:border-gray-500">
                  <i className="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollegeTable;