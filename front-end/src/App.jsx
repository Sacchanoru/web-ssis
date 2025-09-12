import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StudentTable from './components/tables/student_table'
import ProgramTable from './components/tables/program_table'
import CollegeTable from './components/tables/college_table'
import Card from "./components/card";
import NavBar from "./components/navbar";
import Pagination from "./components/pagination";

function App() {
  const [activeTab, setActiveTab] = useState("Student");
  return (
    <div className="p-8">
      <Card title="Web Student Information System">
        <div className="mb-4">
          <NavBar activeTab = {activeTab} onTabChange = {setActiveTab}/>
        </div>
        {activeTab === "Student" && <StudentTable />}
        {activeTab === "Program" && <ProgramTable />}
        {activeTab === "College" && <CollegeTable />}
        <div>
          <Pagination />
        </div>
      </Card>
    </div>
  );
}

export default App
