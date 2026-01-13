import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Form from "@/Pages/Layouts/Components/Form";
import { toastSuccess, toastError } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import { register as registerApi } from "@/api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toastError("Konfirmasi password tidak sama");
      return;
    }

    setSubmitting(true);
    try {
      await registerApi({ name: form.name, email: form.email, password: form.password });
      toastSuccess("Registrasi berhasil, silakan login");
      navigate("/login");
    } catch (err) {
      toastError(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md">
      <Heading as="h2">Registrasi</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimal 6 karakter"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Ulangi password"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Daftar"}
        </Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Sudah punya akun? <RouterLink to="/login" className="text-blue-500 hover:underline">Masuk</RouterLink>
      </p>
    </Card>
  );
};

export default Register;
