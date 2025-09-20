import { useState } from "react";
import StudentTable from "./tables/student_table";
import Pagination from "../components/pagination";

function StudentPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <StudentTable page={page} />
      <Pagination currentPage={page} onPageChange={setPage} />
    </div>
  );
}

export default StudentPage;