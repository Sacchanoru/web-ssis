import { Outlet } from "react-router-dom";
import Card from "./components/card";
import Pagination from "./components/pagination";
import SidebarLayout from "./components/sidebar";

function App() {
  return (
    <SidebarLayout>
      <div className="p-8">
        <Card title="Web Student Information System">
          <Outlet />
        </Card>
      </div>
    </SidebarLayout>
  );
}

export default App;
