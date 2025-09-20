import App from "./App";
import Home from "./components/home";
import StudentTable from "./components/tables/student_table";
import ProgramTable from "./components/tables/program_table";
import CollegeTable from "./components/tables/college_table";
import Statistics from "./components/statistics";
import About from "./components/about";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "student", element: <StudentTable /> },
      { path: "program", element: <ProgramTable /> },
      { path: "college", element: <CollegeTable /> },
      { path: "statistics", element: <Statistics /> },
      { path: "about", element: <About /> },
    ],
  },
];

export default routes;
