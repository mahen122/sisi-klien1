import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">Admin</span>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🏠</span>
          <span className="menu-text hidden lg:inline">Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/mahasiswa"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🎓</span>
          <span className="menu-text hidden lg:inline">Mahasiswa</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🧑‍💼</span>
          <span className="menu-text hidden lg:inline">User</span>
        </NavLink>
        <NavLink
          to="/admin/dosen"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>👩‍🏫</span>
          <span className="menu-text hidden lg:inline">Dosen</span>
        </NavLink>
        <NavLink
          to="/admin/mata-kuliah"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>📚</span>
          <span className="menu-text hidden lg:inline">Mata Kuliah</span>
        </NavLink>
        <NavLink
          to="/admin/kelas"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🏫</span>
          <span className="menu-text hidden lg:inline">Kelas</span>
        </NavLink>
        <NavLink
          to="/admin/mahasiswa-sks"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>📊</span>
          <span className="menu-text hidden lg:inline">SKS Mahasiswa</span>
        </NavLink>
        <NavLink
          to="/admin/transfer"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>💸</span>
          <span className="menu-text hidden lg:inline">Transfer</span>
        </NavLink>
        <NavLink
          to="/admin/transfer/daftartransaksi"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>📜</span>
          <span className="menu-text hidden lg:inline">Daftar Transaksi</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;