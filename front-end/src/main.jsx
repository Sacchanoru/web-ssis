import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "./routes";
import "./index.css";

function RouterWrapper() {
  return useRoutes(routes);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RouterWrapper />
    </BrowserRouter>
  </React.StrictMode>
);
