import React from "react";
import 'primeicons/primeicons.css';


function Table() {
  const students = [
    {
      id: "2023-1949",
      first_name: "Zjann Henry",
      last_name: "Cuajotor",
      course: "BSCS - Bachelor of Science in Computer Science",
      year: "1",
      gender: "Male",
    },
    {
      id: "2023-1950",
      first_name: "Maria",
      last_name: "Santos",
      course: "BSIT - Bachelor of Science in Information Technology",
      year: "2",
      gender: "Female",
    },
    {
      id: "2023-1951",
      first_name: "Juan",
      last_name: "Dela Cruz",
      course: "BSBA - Bachelor of Science in Business Administration",
      year: "3",
      gender: "Male",
    },
    {
      id: "2023-1952",
      first_name: "Ana",
      last_name: "Lopez",
      course: "BSED - Bachelor of Secondary Education",
      year: "4",
      gender: "Female",
    },
    {
      id: "2023-1953",
      first_name: "Carlo",
      last_name: "Reyes",
      course: "BSCS - Bachelor of Science in Computer Science",
      year: "2",
      gender: "Male",
    },
    {
      id: "2023-1954",
      first_name: "Sofia",
      last_name: "Garcia",
      course: "BSN - Bachelor of Science in Nursing",
      year: "1",
      gender: "Female",
    },
    {
      id: "2023-1955",
      first_name: "Mark",
      last_name: "Torres",
      course: "BSCE - Bachelor of Science in Civil Engineering",
      year: "3",
      gender: "Male",
    },
    {
      id: "2023-1956",
      first_name: "Ella",
      last_name: "Cruz",
      course: "BSHRM - Bachelor of Science in Hotel and Restaurant Management",
      year: "2",
      gender: "Female",
    },
    {
      id: "2023-1957",
      first_name: "James",
      last_name: "Lim",
      course: "BSArch - Bachelor of Science in Architecture",
      year: "5",
      gender: "Male",
    },
    {
      id: "2023-1958",
      first_name: "Grace",
      last_name: "Villanueva",
      course: "BSA - Bachelor of Science in Accountancy",
      year: "4",
      gender: "Female",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white text-black">
      <table className="table min-w-auto">
        {/* Table Head */}
        <thead className="bg-blue-300 text-white">
          <tr>
            <th>Student ID</th>
            <th className="w-[150px]">First Name</th>
            <th>Last Name</th>
            <th className="w-[250px]">Course</th>
            <th>Year</th>
            <th>Gender</th>
            <th></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-gray-700 ">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-blue-100">
              <td>{student.id}</td>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.course}</td>
              <td>{student.year}</td>
              <td>{student.gender}</td>
              <td className="flex gap-2 justify-center">
                <button className="btn btn-ghost btn-md text-gray-500 border hover:bg-blue-200 hover:border-gray-500"><i className="pi pi-pencil"></i></button>
                <button className="btn btn-ghost btn-md text-red-500 border hover:bg-blue-200 hover:border-gray-500"><i className="pi pi-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;