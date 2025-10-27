import App from "./App";
import Home from "./components/home";
import StudentTable from "./components/tables/student_table";
import ProgramTable from "./components/tables/program_table";
import CollegeTable from "./components/tables/college_table";
import Login from "./components/login";
import Signup from "./components/signup";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { Navigate } from "react-router-dom";

const routes = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "student", element: <StudentTable /> },
      { path: "program", element: <ProgramTable /> },
      { path: "college", element: <CollegeTable /> },
    ],
  },
];

export default routes;
