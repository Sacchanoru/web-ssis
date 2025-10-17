import { Outlet } from "react-router-dom";
import Card from "./components/card";
import SidebarLayout from "./components/sidebar";

function App() {
  return (
    <SidebarLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6"></div>
        <Card title="Web Student Information System" className="text-gray-600">
          <Outlet />
        </Card>
      </div>
    </SidebarLayout>
  );
}

export default App;
