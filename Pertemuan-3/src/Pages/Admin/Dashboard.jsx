import { Link } from "react-router-dom";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";

const Dashboard = () => {
  return (
    <div>
      <Heading as="h2" align="left" color="text-gray-800" spacing="mb-4">
        Selamat Datang di Dashboard
      </Heading>

      <div className="mt-4">
        <Link to="/admin/transfer">
          <Button variant="primary">Ke Halaman Transfer</Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;