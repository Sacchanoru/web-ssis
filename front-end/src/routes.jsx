import App from "./App";
import Home from "./components/home";
import StudentTable from "./components/tables/student_table";
import ProgramTable from "./components/tables/program_table";
import CollegeTable from "./components/tables/college_table";
import Login from "./components/login";
import Signup from "./components/signup";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "student", element: <StudentTable /> },
      { path: "program", element: <ProgramTable /> },
      { path: "college", element: <CollegeTable /> },
    ],
  },
];

export default routes;
