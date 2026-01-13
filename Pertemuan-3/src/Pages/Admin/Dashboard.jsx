import { Link } from "react-router-dom";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import Card from "@/Pages/Layouts/Components/Card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useMahasiswaList,
  useDosenList,
  useMataKuliahList,
  useKelasList,
} from "@/Pages/Layouts/Utils/Hooks";

// Data untuk Bar Chart - Statistik per Prodi
const prodiData = [
  { prodi: "Informatika", mahasiswa: 45, dosen: 8 },
  { prodi: "Sistem Informasi", mahasiswa: 38, dosen: 6 },
  { prodi: "Teknik Komputer", mahasiswa: 32, dosen: 5 },
  { prodi: "Data Science", mahasiswa: 28, dosen: 4 },
];

// Data untuk Line Chart - Trend Registrasi
const registrasiData = [
  { bulan: "Jan", mahasiswa: 12 },
  { bulan: "Feb", mahasiswa: 19 },
  { bulan: "Mar", mahasiswa: 15 },
  { bulan: "Apr", mahasiswa: 25 },
  { bulan: "Mei", mahasiswa: 22 },
  { bulan: "Jun", mahasiswa: 30 },
];

// Warna untuk Pie Chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const { data: mahasiswa = [] } = useMahasiswaList();
  const { data: dosen = [] } = useDosenList();
  const { data: mataKuliah = [] } = useMataKuliahList();
  const { data: kelas = [] } = useKelasList();

  // Data untuk Pie Chart - Distribusi Data
  const distributionData = [
    { name: "Mahasiswa", value: mahasiswa.length },
    { name: "Dosen", value: dosen.length },
    { name: "Mata Kuliah", value: mataKuliah.length },
    { name: "Kelas", value: kelas.length },
  ];

  return (
    <div>
      <Heading as="h2" align="left" color="text-gray-800" spacing="mb-4">
        Selamat Datang di Dashboard
      </Heading>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-3xl font-bold">{mahasiswa.length}</div>
          <div className="text-sm opacity-90">Total Mahasiswa</div>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-3xl font-bold">{dosen.length}</div>
          <div className="text-sm opacity-90">Total Dosen</div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-3xl font-bold">{mataKuliah.length}</div>
          <div className="text-sm opacity-90">Total Mata Kuliah</div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-3xl font-bold">{kelas.length}</div>
          <div className="text-sm opacity-90">Total Kelas</div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart - Statistik per Prodi */}
        <Card>
          <Heading as="h3" className="mb-4 text-left text-lg">
            📊 Statistik per Program Studi
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prodiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="prodi" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="mahasiswa" fill="#3B82F6" name="Mahasiswa" />
              <Bar dataKey="dosen" fill="#10B981" name="Dosen" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart - Trend Registrasi */}
        <Card>
          <Heading as="h3" className="mb-4 text-left text-lg">
            📈 Trend Registrasi Mahasiswa
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrasiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="mahasiswa"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="Mahasiswa Baru"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Pie Chart - Full Width */}
      <Card className="mb-6">
        <Heading as="h3" className="mb-4 text-left text-lg">
          🥧 Distribusi Data Akademik
        </Heading>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <div className="mt-4">
        <Link to="/admin/transfer">
          <Button variant="primary">Ke Halaman Transfer</Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;