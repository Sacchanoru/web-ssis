import React from "react";
import "primeicons/primeicons.css";

function ProgramTable() {
  // Change to Axios fetch later
  const programs = [
    {
      code: "BSCS",
      name: "Bachelor of Science in Computer Science",
      college: "CCS",
    },
    {
      code: "BSIT",
      name: "Bachelor of Science in Information Technology",
      college: "CCS",
    },
    {
      code: "BSBA",
      name: "Bachelor of Science in Business Administration",
      college: "CBA",
    },
    {
      code: "BSED",
      name: "Bachelor of Secondary Education",
      college: "COE",
    },
    {
      code: "BSN",
      name: "Bachelor of Science in Nursing",
      college: "CON",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white text-black">
      <table className="table min-w-auto">
        {/* Table Head */}
        <thead className="bg-blue-300 text-white">
          <tr>
            <th>Program Code <i className="pi pi-sort-down-fill"></i></th>
            <th>Program Name <i className="pi pi-sort-down"></i></th>
            <th>College <i className="pi pi-sort-down"></i></th>
            <th></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-gray-700">
          {programs.map((program) => (
            <tr key={program.code} className="hover:bg-blue-100">
              <td>{program.code}</td>
              <td>{program.name}</td>
              <td>{program.college}</td>
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

export default ProgramTable;