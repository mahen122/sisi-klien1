import AxiosMockAdapter from "axios-mock-adapter";
import api from "./client";

const storageKey = "mock-api-db";

const seedDb = {
  users: [
    {
      id: "USR-001",
      name: "Admin Demo",
      email: "admin@gmail.com",
      password: "123456",
      role: "admin",
      permissions: ["manage_users", "manage_dosen", "manage_mk"],
    },
  ],
  dosen: [
    {
      id: "DSN-001",
      nidn: "0111222333",
      nama: "Dr. Ratna Prabowo",
      email: "ratna.prabowo@kampus.ac.id",
      prodi: "Informatika",
      maxSks: 12,
      sksAmbil: 6,
    },
    {
      id: "DSN-002",
      nidn: "0111222444",
      nama: "Prof. Bima Kurnia",
      email: "bima.kurnia@kampus.ac.id",
      prodi: "Sistem Informasi",
      maxSks: 12,
      sksAmbil: 3,
    },
    {
      id: "DSN-003",
      nidn: "0111222555",
      nama: "Dr. Citra Wulandari",
      email: "citra.wulandari@kampus.ac.id",
      prodi: "Informatika",
      maxSks: 12,
      sksAmbil: 0,
    },
  ],
  mataKuliah: [
    {
      id: "MK-001",
      kode: "IF101",
      nama: "Algoritma dan Pemrograman",
      sks: 3,
      dosenPengampu: "Dr. Ratna Prabowo",
    },
    {
      id: "MK-002",
      kode: "IF202",
      nama: "Basis Data",
      sks: 3,
      dosenPengampu: "Prof. Bima Kurnia",
    },
    {
      id: "MK-003",
      kode: "IF303",
      nama: "Pemrograman Web",
      sks: 4,
      dosenPengampu: "",
    },
  ],
  mahasiswa: [
    {
      id: "MHS-001",
      nim: "A11.2022.14638",
      nama: "Mahendra Setiawan",
      prodi: "Informatika",
      maxSks: 24,
      sksAmbil: 6,
    },
    {
      id: "MHS-002",
      nim: "A11.2022.11111",
      nama: "Abi Zalud",
      prodi: "Informatika",
      maxSks: 24,
      sksAmbil: 3,
    },
    {
      id: "MHS-003",
      nim: "A11.2022.22222",
      nama: "Siti Nurhaliza",
      prodi: "Sistem Informasi",
      maxSks: 24,
      sksAmbil: 0,
    },
  ],
  kelas: [
    {
      id: "KLS-001",
      kode: "IF101-A",
      nama: "Algoritma A",
      mataKuliahId: "MK-001",
      dosenId: "DSN-001",
      mahasiswaIds: ["MHS-001", "MHS-002"],
      kapasitas: 30,
    },
    {
      id: "KLS-002",
      kode: "IF202-B",
      nama: "Basis Data B",
      mataKuliahId: "MK-002",
      dosenId: "DSN-002",
      mahasiswaIds: ["MHS-002"],
      kapasitas: 35,
    },
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const persistDb = (db) => {
  localStorage.setItem(storageKey, JSON.stringify(db));
};

const readDb = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      persistDb(seedDb);
      return clone(seedDb);
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Gagal membaca mock DB", err);
    persistDb(seedDb);
    return clone(seedDb);
  }
};

const getDb = () => {
  const db = readDb();
  if (!db.users) db.users = [];
  if (!db.dosen) db.dosen = [];
  if (!db.mataKuliah) db.mataKuliah = [];
  if (!db.mahasiswa) db.mahasiswa = [];
  if (!db.kelas) db.kelas = [];
  return db;
};

const saveDb = (db) => persistDb(db);

const mock = new AxiosMockAdapter(api, { delayResponse: 400 });

// Auth endpoints
mock.onPost("/auth/register").reply((config) => {
  const payload = JSON.parse(config.data || "{}");
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    return [400, { message: "Nama, email, dan password wajib diisi" }];
  }

  const db = getDb();
  const exists = db.users.some((user) => user.email === email);
  if (exists) {
    return [409, { message: "Email sudah terdaftar" }];
  }

  const newUser = {
    id: `USR-${Date.now()}`,
    name,
    email,
    password,
    role: "user",
    permissions: ["read"],
  };

  db.users.push(newUser);
  saveDb(db);

  return [201, { user: { id: newUser.id, name, email, role: newUser.role, permissions: newUser.permissions }, token: `mock-token-${newUser.id}` }];
});

mock.onPost("/auth/login").reply((config) => {
  const payload = JSON.parse(config.data || "{}");
  const { email, password } = payload;

  if (!email || !password) {
    return [400, { message: "Email dan password wajib diisi" }];
  }

  const db = getDb();
  const user = db.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return [401, { message: "Email atau password salah" }];
  }

  return [200, { user: { id: user.id, name: user.name, email: user.email, role: user.role, permissions: user.permissions }, token: `mock-token-${user.id}` }];
});

// Users endpoints (role & permission management)
mock.onGet("/users").reply(() => {
  const db = getDb();
  const safeUsers = db.users.map(({ password, ...rest }) => rest);
  return [200, safeUsers];
});

mock.onPut(/\/users\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/users\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const payload = JSON.parse(config.data || "{}");
  const { role, permissions } = payload;

  const db = getDb();
  const index = db.users.findIndex((u) => u.id === id || u.email === id);
  if (index === -1) {
    return [404, { message: "User tidak ditemukan" }];
  }

  const updated = {
    ...db.users[index],
    role: role || db.users[index].role || "user",
    permissions: Array.isArray(permissions) ? permissions : db.users[index].permissions || [],
  };

  db.users[index] = updated;
  saveDb(db);

  const { password, ...safeUser } = updated;
  return [200, safeUser];
});

// Dosen endpoints
mock.onGet("/dosen").reply(() => {
  const db = getDb();
  return [200, db.dosen];
});

mock.onGet(/\/dosen\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/dosen\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const db = getDb();
  const item = db.dosen.find((d) => d.id === id || d.nidn === id);
  if (!item) {
    return [404, { message: "Dosen tidak ditemukan" }];
  }
  return [200, item];
});

mock.onPost("/dosen").reply((config) => {
  const payload = JSON.parse(config.data || "{}");
  const { nidn, nama, email, prodi } = payload;

  if (!nidn || !nama || !email || !prodi) {
    return [400, { message: "Semua field dosen wajib diisi" }];
  }

  const db = getDb();
  const exists = db.dosen.some((d) => d.nidn === nidn);
  if (exists) {
    return [409, { message: "NIDN sudah terdaftar" }];
  }

  const newDosen = {
    id: `DSN-${Date.now()}`,
    nidn,
    nama,
    email,
    prodi,
  };

  db.dosen.push(newDosen);
  saveDb(db);
  return [201, newDosen];
});

mock.onPut(/\/dosen\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/dosen\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const payload = JSON.parse(config.data || "{}");
  const { nidn, nama, email, prodi } = payload;

  const db = getDb();
  const index = db.dosen.findIndex((d) => d.id === id || d.nidn === id);
  if (index === -1) {
    return [404, { message: "Dosen tidak ditemukan" }];
  }

  const duplicate = db.dosen.some((d, idx) => idx !== index && d.nidn === nidn);
  if (duplicate) {
    return [409, { message: "NIDN sudah dipakai dosen lain" }];
  }

  const updated = { ...db.dosen[index], nidn, nama, email, prodi };
  db.dosen[index] = updated;
  saveDb(db);
  return [200, updated];
});

mock.onDelete(/\/dosen\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/dosen\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const db = getDb();
  const exists = db.dosen.some((d) => d.id === id || d.nidn === id);
  if (!exists) {
    return [404, { message: "Dosen tidak ditemukan" }];
  }
  db.dosen = db.dosen.filter((d) => d.id !== id && d.nidn !== id);
  saveDb(db);
  return [200];
});

// Mata kuliah endpoints
mock.onGet("/mata-kuliah").reply(() => {
  const db = getDb();
  return [200, db.mataKuliah];
});

mock.onGet(/\/mata-kuliah\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/mata-kuliah\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const db = getDb();
  const item = db.mataKuliah.find((mk) => mk.id === id || mk.kode === id);
  if (!item) {
    return [404, { message: "Mata kuliah tidak ditemukan" }];
  }
  return [200, item];
});

mock.onPost("/mata-kuliah").reply((config) => {
  const payload = JSON.parse(config.data || "{}");
  const { kode, nama, sks, dosenPengampu } = payload;

  if (!kode || !nama || !sks || !dosenPengampu) {
    return [400, { message: "Semua field mata kuliah wajib diisi" }];
  }

  const db = getDb();
  const exists = db.mataKuliah.some((mk) => mk.kode === kode);
  if (exists) {
    return [409, { message: "Kode mata kuliah sudah terdaftar" }];
  }

  const newMk = {
    id: `MK-${Date.now()}`,
    kode,
    nama,
    sks: Number(sks),
    dosenPengampu,
  };

  db.mataKuliah.push(newMk);
  saveDb(db);
  return [201, newMk];
});

mock.onPut(/\/mata-kuliah\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/mata-kuliah\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const payload = JSON.parse(config.data || "{}");
  const { kode, nama, sks, dosenPengampu } = payload;

  const db = getDb();
  const index = db.mataKuliah.findIndex((mk) => mk.id === id || mk.kode === id);
  if (index === -1) {
    return [404, { message: "Mata kuliah tidak ditemukan" }];
  }

  const duplicate = db.mataKuliah.some((mk, idx) => idx !== index && mk.kode === kode);
  if (duplicate) {
    return [409, { message: "Kode mata kuliah sudah dipakai" }];
  }

  const updated = { ...db.mataKuliah[index], kode, nama, sks: Number(sks), dosenPengampu };
  db.mataKuliah[index] = updated;
  saveDb(db);
  return [200, updated];
});

mock.onDelete(/\/mata-kuliah\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/mata-kuliah\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const db = getDb();
  const exists = db.mataKuliah.some((mk) => mk.id === id || mk.kode === id);
  if (!exists) {
    return [404, { message: "Mata kuliah tidak ditemukan" }];
  }
  db.mataKuliah = db.mataKuliah.filter((mk) => mk.id !== id && mk.kode !== id);
  saveDb(db);
  return [200];
});

// Mahasiswa endpoints
mock.onGet("/mahasiswa").reply(() => {
  const db = getDb();
  return [200, db.mahasiswa];
});

mock.onGet(/\/mahasiswa\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/mahasiswa\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const db = getDb();
  const item = db.mahasiswa.find((m) => m.id === id || m.nim === id);
  if (!item) {
    return [404, { message: "Mahasiswa tidak ditemukan" }];
  }
  return [200, item];
});

mock.onPost("/mahasiswa").reply((config) => {
  const payload = JSON.parse(config.data || "{}");
  const { nim, nama, prodi } = payload;

  if (!nim || !nama) {
    return [400, { message: "NIM dan Nama wajib diisi" }];
  }

  const db = getDb();
  const exists = db.mahasiswa.some((m) => m.nim === nim);
  if (exists) {
    return [409, { message: "NIM sudah terdaftar" }];
  }

  const newMhs = {
    id: `MHS-${Date.now()}`,
    nim,
    nama,
    prodi: prodi || "",
  };

  db.mahasiswa.push(newMhs);
  saveDb(db);
  return [201, newMhs];
});

mock.onPut(/\/mahasiswa\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/mahasiswa\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const payload = JSON.parse(config.data || "{}");
  const { nim, nama, prodi } = payload;

  const db = getDb();
  const index = db.mahasiswa.findIndex((m) => m.id === id || m.nim === id);
  if (index === -1) {
    return [404, { message: "Mahasiswa tidak ditemukan" }];
  }

  const duplicate = db.mahasiswa.some((m, idx) => idx !== index && m.nim === nim);
  if (duplicate) {
    return [409, { message: "NIM sudah dipakai mahasiswa lain" }];
  }

  const updated = { ...db.mahasiswa[index], nim, nama, prodi: prodi || "" };
  db.mahasiswa[index] = updated;
  saveDb(db);
  return [200, updated];
});

mock.onDelete(/\/mahasiswa\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/mahasiswa\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const db = getDb();
  const exists = db.mahasiswa.some((m) => m.id === id || m.nim === id);
  if (!exists) {
    return [404, { message: "Mahasiswa tidak ditemukan" }];
  }
  db.mahasiswa = db.mahasiswa.filter((m) => m.id !== id && m.nim !== id);
  saveDb(db);
  return [200];
});

// Kelas endpoints
mock.onGet("/kelas").reply(() => {
  const db = getDb();
  return [200, db.kelas];
});

mock.onGet(/\/kelas\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/kelas\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const db = getDb();
  const item = db.kelas.find((k) => k.id === id || k.kode === id);
  if (!item) {
    return [404, { message: "Kelas tidak ditemukan" }];
  }
  return [200, item];
});

mock.onPost("/kelas").reply((config) => {
  const payload = JSON.parse(config.data || "{}");
  const { kode, nama, mataKuliahId, dosenId, mahasiswaIds, kapasitas } = payload;

  if (!kode || !nama) {
    return [400, { message: "Kode dan Nama kelas wajib diisi" }];
  }

  if (!mataKuliahId) {
    return [400, { message: "Mata Kuliah wajib dipilih" }];
  }

  const db = getDb();
  
  // Check if kode already exists
  const exists = db.kelas.some((k) => k.kode === kode);
  if (exists) {
    return [409, { message: "Kode kelas sudah terdaftar" }];
  }

  // Validate Mata Kuliah exists
  const mataKuliah = db.mataKuliah.find((mk) => mk.id === mataKuliahId);
  if (!mataKuliah) {
    return [404, { message: "Mata Kuliah tidak ditemukan" }];
  }

  // Validate 1 Mata Kuliah = 1 Dosen rule
  if (dosenId) {
    const existingKelas = db.kelas.find((k) => k.mataKuliahId === mataKuliahId && k.dosenId && k.dosenId !== dosenId);
    if (existingKelas) {
      const otherDosen = db.dosen.find((d) => d.id === existingKelas.dosenId);
      return [409, { message: `Mata Kuliah "${mataKuliah.nama}" sudah diampu oleh ${otherDosen?.nama || 'dosen lain'}` }];
    }

    // Validate Dosen exists
    const dosen = db.dosen.find((d) => d.id === dosenId);
    if (!dosen) {
      return [404, { message: "Dosen tidak ditemukan" }];
    }

    // Check Dosen max SKS
    const dosenSksUsed = dosen.sksAmbil || 0;
    if (dosenSksUsed + mataKuliah.sks > dosen.maxSks) {
      return [400, { message: `Dosen ${dosen.nama} sudah mengambil ${dosenSksUsed} SKS dari maksimal ${dosen.maxSks} SKS. Tidak cukup untuk mengampu mata kuliah ini (${mataKuliah.sks} SKS)` }];
    }
  }

  // Validate Mahasiswa and check max SKS
  const validMahasiswaIds = [];
  if (Array.isArray(mahasiswaIds) && mahasiswaIds.length > 0) {
    for (const mhsId of mahasiswaIds) {
      const mhs = db.mahasiswa.find((m) => m.id === mhsId);
      if (!mhs) {
        return [404, { message: `Mahasiswa dengan ID ${mhsId} tidak ditemukan` }];
      }

      // Check if mahasiswa already enrolled in this mata kuliah
      const alreadyEnrolled = db.kelas.some((k) => k.mataKuliahId === mataKuliahId && k.mahasiswaIds?.includes(mhsId));
      if (alreadyEnrolled) {
        return [409, { message: `Mahasiswa ${mhs.nama} sudah terdaftar di mata kuliah "${mataKuliah.nama}"` }];
      }

      const mhsSksUsed = mhs.sksAmbil || 0;
      if (mhsSksUsed + mataKuliah.sks > mhs.maxSks) {
        return [400, { message: `Mahasiswa ${mhs.nama} sudah mengambil ${mhsSksUsed} SKS dari maksimal ${mhs.maxSks} SKS. Tidak dapat menambah mata kuliah ini (${mataKuliah.sks} SKS)` }];
      }
      validMahasiswaIds.push(mhsId);
    }
  }

  const newKelas = {
    id: `KLS-${Date.now()}`,
    kode,
    nama,
    mataKuliahId,
    dosenId: dosenId || null,
    mahasiswaIds: validMahasiswaIds,
    kapasitas: kapasitas ? Number(kapasitas) : 0,
  };

  db.kelas.push(newKelas);

  // Update SKS for Dosen
  if (dosenId) {
    const dosenIndex = db.dosen.findIndex((d) => d.id === dosenId);
    if (dosenIndex !== -1) {
      db.dosen[dosenIndex].sksAmbil = (db.dosen[dosenIndex].sksAmbil || 0) + mataKuliah.sks;
    }
  }

  // Update SKS for Mahasiswa
  validMahasiswaIds.forEach((mhsId) => {
    const mhsIndex = db.mahasiswa.findIndex((m) => m.id === mhsId);
    if (mhsIndex !== -1) {
      db.mahasiswa[mhsIndex].sksAmbil = (db.mahasiswa[mhsIndex].sksAmbil || 0) + mataKuliah.sks;
    }
  });

  saveDb(db);
  return [201, newKelas];
});

mock.onPut(/\/kelas\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/kelas\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const payload = JSON.parse(config.data || "{}");
  const { kode, nama, mataKuliahId, dosenId, mahasiswaIds, kapasitas } = payload;

  const db = getDb();
  const index = db.kelas.findIndex((k) => k.id === id || k.kode === id);
  if (index === -1) {
    return [404, { message: "Kelas tidak ditemukan" }];
  }

  const oldKelas = db.kelas[index];
  const oldMataKuliah = db.mataKuliah.find((mk) => mk.id === oldKelas.mataKuliahId);

  const duplicate = db.kelas.some((k, idx) => idx !== index && k.kode === kode);
  if (duplicate) {
    return [409, { message: "Kode kelas sudah dipakai" }];
  }

  // Validate Mata Kuliah
  const mataKuliah = db.mataKuliah.find((mk) => mk.id === mataKuliahId);
  if (!mataKuliah) {
    return [404, { message: "Mata Kuliah tidak ditemukan" }];
  }

  // Validate 1 Mata Kuliah = 1 Dosen rule
  if (dosenId) {
    const existingKelas = db.kelas.find((k, idx) => idx !== index && k.mataKuliahId === mataKuliahId && k.dosenId && k.dosenId !== dosenId);
    if (existingKelas) {
      const otherDosen = db.dosen.find((d) => d.id === existingKelas.dosenId);
      return [409, { message: `Mata Kuliah "${mataKuliah.nama}" sudah diampu oleh ${otherDosen?.nama || 'dosen lain'}` }];
    }

    const dosen = db.dosen.find((d) => d.id === dosenId);
    if (!dosen) {
      return [404, { message: "Dosen tidak ditemukan" }];
    }

    // Check Dosen max SKS (adjust for changes)
    let dosenSksUsed = dosen.sksAmbil || 0;
    if (oldKelas.dosenId === dosenId && oldMataKuliah) {
      dosenSksUsed -= oldMataKuliah.sks;
    }
    if (dosenSksUsed + mataKuliah.sks > dosen.maxSks) {
      return [400, { message: `Dosen ${dosen.nama} sudah mengambil ${dosen.sksAmbil || 0} SKS dari maksimal ${dosen.maxSks} SKS. Tidak cukup untuk mengampu mata kuliah ini (${mataKuliah.sks} SKS)` }];
    }
  }

  // Validate Mahasiswa and check max SKS
  const validMahasiswaIds = [];
  if (Array.isArray(mahasiswaIds) && mahasiswaIds.length > 0) {
    for (const mhsId of mahasiswaIds) {
      const mhs = db.mahasiswa.find((m) => m.id === mhsId);
      if (!mhs) {
        return [404, { message: `Mahasiswa dengan ID ${mhsId} tidak ditemukan` }];
      }

      // Check if mahasiswa already enrolled in this mata kuliah (excluding current kelas)
      const alreadyEnrolled = db.kelas.some((k, idx) => idx !== index && k.mataKuliahId === mataKuliahId && k.mahasiswaIds?.includes(mhsId));
      if (alreadyEnrolled) {
        return [409, { message: `Mahasiswa ${mhs.nama} sudah terdaftar di mata kuliah "${mataKuliah.nama}"` }];
      }

      let mhsSksUsed = mhs.sksAmbil || 0;
      // If mahasiswa was already in this class, subtract old SKS
      if (oldKelas.mahasiswaIds?.includes(mhsId) && oldMataKuliah) {
        mhsSksUsed -= oldMataKuliah.sks;
      }
      if (mhsSksUsed + mataKuliah.sks > mhs.maxSks) {
        return [400, { message: `Mahasiswa ${mhs.nama} sudah mengambil ${mhs.sksAmbil || 0} SKS dari maksimal ${mhs.maxSks} SKS. Tidak dapat menambah mata kuliah ini (${mataKuliah.sks} SKS)` }];
      }
      validMahasiswaIds.push(mhsId);
    }
  }

  // Revert SKS for old Dosen
  if (oldKelas.dosenId && oldMataKuliah) {
    const oldDosenIndex = db.dosen.findIndex((d) => d.id === oldKelas.dosenId);
    if (oldDosenIndex !== -1) {
      db.dosen[oldDosenIndex].sksAmbil = Math.max(0, (db.dosen[oldDosenIndex].sksAmbil || 0) - oldMataKuliah.sks);
    }
  }

  // Revert SKS for old Mahasiswa
  if (oldKelas.mahasiswaIds && oldMataKuliah) {
    oldKelas.mahasiswaIds.forEach((mhsId) => {
      const mhsIndex = db.mahasiswa.findIndex((m) => m.id === mhsId);
      if (mhsIndex !== -1) {
        db.mahasiswa[mhsIndex].sksAmbil = Math.max(0, (db.mahasiswa[mhsIndex].sksAmbil || 0) - oldMataKuliah.sks);
      }
    });
  }

  const updated = {
    ...oldKelas,
    kode,
    nama,
    mataKuliahId,
    dosenId: dosenId || null,
    mahasiswaIds: validMahasiswaIds,
    kapasitas: kapasitas ? Number(kapasitas) : 0,
  };
  db.kelas[index] = updated;

  // Add SKS for new Dosen
  if (dosenId) {
    const dosenIndex = db.dosen.findIndex((d) => d.id === dosenId);
    if (dosenIndex !== -1) {
      db.dosen[dosenIndex].sksAmbil = (db.dosen[dosenIndex].sksAmbil || 0) + mataKuliah.sks;
    }
  }

  // Add SKS for new Mahasiswa
  validMahasiswaIds.forEach((mhsId) => {
    const mhsIndex = db.mahasiswa.findIndex((m) => m.id === mhsId);
    if (mhsIndex !== -1) {
      db.mahasiswa[mhsIndex].sksAmbil = (db.mahasiswa[mhsIndex].sksAmbil || 0) + mataKuliah.sks;
    }
  });

  saveDb(db);
  return [200, updated];
});

mock.onDelete(/\/kelas\/([^/?#]+)/).reply((config) => {
  const match = config.url.match(/\/kelas\/([^/?#]+)/);
  const id = match ? match[1] : null;
  const db = getDb();
  const kelas = db.kelas.find((k) => k.id === id || k.kode === id);
  if (!kelas) {
    return [404, { message: "Kelas tidak ditemukan" }];
  }

  // Revert SKS for Dosen and Mahasiswa
  const mataKuliah = db.mataKuliah.find((mk) => mk.id === kelas.mataKuliahId);
  if (mataKuliah) {
    if (kelas.dosenId) {
      const dosenIndex = db.dosen.findIndex((d) => d.id === kelas.dosenId);
      if (dosenIndex !== -1) {
        db.dosen[dosenIndex].sksAmbil = Math.max(0, (db.dosen[dosenIndex].sksAmbil || 0) - mataKuliah.sks);
      }
    }

    if (kelas.mahasiswaIds) {
      kelas.mahasiswaIds.forEach((mhsId) => {
        const mhsIndex = db.mahasiswa.findIndex((m) => m.id === mhsId);
        if (mhsIndex !== -1) {
          db.mahasiswa[mhsIndex].sksAmbil = Math.max(0, (db.mahasiswa[mhsIndex].sksAmbil || 0) - mataKuliah.sks);
        }
      });
    }
  }

  db.kelas = db.kelas.filter((k) => k.id !== id && k.kode !== id);
  saveDb(db);
  return [200];
});

export default mock;
