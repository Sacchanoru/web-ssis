import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Table from './components/table'
import Card from "./components/card";
import NavBar from "./components/navbar";
import Pagination from "./components/pagination";

function App() {
  return (
    <div className="p-8">
      <Card title="Web Student Information System">
        <div className="mb-4">
          <NavBar />
        </div>
        <Table />
        <div>
          <Pagination />
        </div>
      </Card>
    </div>
  );
}

export default App
