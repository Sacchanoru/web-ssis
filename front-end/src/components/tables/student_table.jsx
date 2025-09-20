import React, { useState } from "react";
import "primeicons/primeicons.css";
import Pagination from "../pagination";
import StudentForm from "../forms/studentform";
import AddButton from "../buttons/addbutton";

function StudentTable() {
  const [students, setStudents] = useState([
    { id: "2023-1949", first_name: "Zjann Henry", last_name: "Cuajotor", program: "BSCS", year: "1", gender: "Male" },
    { id: "2023-1950", first_name: "Maria", last_name: "Santos", program: "BSIT", year: "2", gender: "Female" },
    { id: "2023-1951", first_name: "Juan", last_name: "Dela Cruz", program: "BSBA", year: "3", gender: "Male" },
    { id: "2023-1952", first_name: "Ana", last_name: "Lopez", program: "BSED", year: "4", gender: "Female" },
    { id: "2023-1953", first_name: "Carlo", last_name: "Reyes", program: "BSCS", year: "2", gender: "Male" },
    { id: "2023-1954", first_name: "Sofia", last_name: "Garcia", program: "BSN", year: "1", gender: "Female" },
    { id: "2023-1955", first_name: "Mark", last_name: "Torres", program: "BSCE", year: "3", gender: "Male" },
    { id: "2023-1956", first_name: "Ella", last_name: "Cruz", program: "BSHRM", year: "2", gender: "Female" },
    { id: "2023-1957", first_name: "James", last_name: "Lim", program: "BSArch", year: "5", gender: "Male" },
    { id: "2023-1958", first_name: "Grace", last_name: "Villanueva", program: "BSA", year: "4", gender: "Female" },
    { id: "2023-1938", first_name: "Gra5ce", last_name: "Villa4nueva", program: "BSA", year: "4", gender: "Female" },
    { id: "2023-1558", first_name: "Gr3ace", last_name: "Vi2llanueva", program: "BSA", year: "4", gender: "Female" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const pageSize = 10;
  const totalPages = Math.ceil(students.length / pageSize);

  const displayedStudents = students.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [...prev, newStudent]);
    setIsFormOpen(false);
  };


  //<AddButton label="Student" onClick={() => setIsFormOpen(true)} />
  return (
    <div>
      <div className="flex justify-end mb-2">
        <AddButton label="Student" onClick={() => setIsFormOpen(true)} />
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white text-black">
        <table className="table min-w-auto">
          <thead className="bg-blue-300 text-white">
            <tr>
              <th>Student ID</th>
              <th className="w-[150px]">First Name</th>
              <th>Last Name</th>
              <th className="w-[250px]">Program</th>
              <th>Year</th>
              <th>Gender</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {displayedStudents.map((student, index) => (
              <tr key={student.id + index} className="hover:bg-blue-100">
                <td>{student.id}</td>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.program}</td>
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
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)}/>
      {isFormOpen && (
      <StudentForm onClose={() => setIsFormOpen(false)} onSave={handleAddStudent}/>
      )}
    </div>
  );
}

export default StudentTable;