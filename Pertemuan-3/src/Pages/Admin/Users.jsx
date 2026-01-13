import { useEffect, useState } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import Pagination from "@/Pages/Layouts/Components/Pagination";
import Form from "@/Pages/Layouts/Components/Form";
import { toastSuccess, toastError } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import { confirmUpdate } from "@/Pages/Layouts/Utils/Helpers/SwalHelpers";
import { getUsers, updateUserRole } from "@/api/userApi";

const roles = ["admin", "staff", "user"];
const permissions = ["manage_users", "manage_dosen", "manage_mk", "read", "write"];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ role: "user", permissions: [] });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      toastError("Gagal memuat user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openModal = (user) => {
    setSelected(user);
    setForm({ role: user.role || "user", permissions: user.permissions || [] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value });
  };

  const togglePermission = (perm) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(perm);
      const next = exists ? prev.permissions.filter((p) => p !== perm) : [...prev.permissions, perm];
      return { ...prev, permissions: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    confirmUpdate(async () => {
      try {
        const { data } = await updateUserRole(selected.id, form);
        setUsers((prev) => prev.map((u) => (u.id === selected.id ? data : u)));
        toastSuccess("Role & permission diperbarui");
        closeModal();
      } catch (err) {
        toastError(err.response?.data?.message || "Gagal memperbarui user");
      }
    });
  };

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">Manajemen User</Heading>
          <Button variant="info" onClick={loadUsers} disabled={loading}>
            {loading ? "Memuat..." : "Reload"}
          </Button>
        </div>

        {loading ? (
          <div className="text-sm text-gray-600">Memuat data...</div>
        ) : users.length === 0 ? (
          <div className="text-sm text-gray-600">Belum ada user.</div>
        ) : (
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Nama</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Permissions</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u, idx) => (
                <tr key={u.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4 capitalize">{u.role || "-"}</td>
                  <td className="py-2 px-4">{(u.permissions || []).join(", ") || "-"}</td>
                  <td className="py-2 px-4 text-center">
                    <Button size="sm" variant="warning" onClick={() => openModal(u)}>
                      Edit Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={users.length}
          />
        )}
      </Card>

      {isModalOpen && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Ubah Role & Permission</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-red-500 text-xl">&times;</button>
            </div>

            <Form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  value={form.role}
                  onChange={handleRoleChange}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Permissions</div>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map((perm) => {
                    const checked = form.permissions.includes(perm);
                    return (
                      <label key={perm} className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(perm)}
                          className="h-4 w-4"
                        />
                        <span>{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-2">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
