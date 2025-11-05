// JSON = isinya object atau array atau keduanya
// Buat object data diri mahasiswa

const mahasiswa = {
    nama: "Nauval Sutisna",
    nim: "A11.2022.14655",
    umur: 21,
    status: true,
    hobby: ["Game", "Modif Motor", "Ngoding"],
    matkul: [
        {
            matkulid: 4301,
            matkulNama: 'pemsik',
            sks: 3,
            nilai: 80
        },
        {
            matkulid: 4504,
            matkulNama: 'Daspro',
            sks: 3,
            nilai: 85
        }
    ],
    organisasi: "IMPHNEN"
};

// 1. ctrl + shift + p 
// 2. ketik quokka, pilih start on current file

console.log(mahasiswa);

// ES6 - Destructuring Object
const { nama, nim, status, hobby, matkul, organisasi } = mahasiswa;
console.log("Nama saya: " + nama + ' - ' + nim);

// Destructuring Array
const [hobi1, hobi2] = hobby;
console.log("Hobby sumber cuanku: - " + hobi1 + " - dan - " + hobi2);

// Template Literal
console.log(`Hobby sumber cuanku: - ${hobi1} dan ${hobi2}`);

// Spread Operator
const menuHobby = "buzzer";
const updateHobby = [...hobby, menuHobby, "Game", "Modif Motor"]; // add to array
console.log(`Menginfo hobby 2025 : ${updateHobby.join(", ")}`);

// Function
// Cara lama
function sumbe(a, b) {
    return a + b;
}

// Cara baru (arrow function)
const jumlah = (a, b) => a + b;
console.log(`Berhitung yuk 1 + 2 = ${jumlah(1, 2)}`);

// Logika dengan OR (||)
const statusMhs = mahasiswa.organisasi || "Tidak ikut organisasi";
console.log(`Status organisasi: ${statusMhs}`);

// Tambahan: Hitung total SKS dan rata-rata nilai
let totalSKS = 0;
let totalNilai = 0;

matkul.forEach(mk => {
    totalSKS += mk.sks;
    totalNilai += mk.nilai;
});

const rataNilai = totalNilai / matkul.length;
console.log(`Total SKS: ${totalSKS}, Rata-rata nilai: ${rataNilai}`);

// ES6 - Array Method (map, filter, reduce)
const namaMatkul = matkul.map((m) => m.matkulNama);
console.log(namaMatkul); // Output: ['pemsik', 'Daspro']

// Array of Object: List Mahasiswa
const listMhs = [
    { nim: '2012', nama: 'NauvalS', status: true },
    { nim: '2014', nama: 'budi', status: true },
    { nim: '2013', nama: 'rudi', status: false }
];

// Tambahan contoh: filter yang statusnya true
const aktifMhs = listMhs.filter(mhs => mhs.status === true);
console.log("Mahasiswa aktif:", aktifMhs.map(m => m.nama));

const totalSks = mahasiswa.matkul.reduce((total, m) => total + m.sks, 0);
console.log(`Total SKS mahasiswa: ${totalSks}`);


// Studi Kasus Mahasiswa & Mata Kuliah
const mataKuliahList = {
  mataKuliah: [
    { kode: "MK001", nama: "Pemrograman Web", sks: 3 },
    { kode: "MK002", nama: "Basis Data", sks: 3 },
    { kode: "MK003", nama: "Algoritma", sks: 2 },
  ],
};

const mahasiswaList = {
  mahasiswa: [
    {
      nim: "22001",
      nama: "Nauval Sutisna",
      status: true,
      matkul: [
        { matkulId: "MK001", tugas: 85, uts: 80, uas: 90 },
        { matkulId: "MK002", tugas: 88, uts: 85, uas: 92 },
      ],
    },
    {
      nim: "22002",
      nama: "Budi Santoso",
      status: true,
      matkul: [
        { matkulId: "MK002", tugas: 75, uts: 70, uas: 80 },
        { matkulId: "MK003", tugas: 65, uts: 60, uas: 75 },
      ],
    },
  ],
};


// Menampilkan Semua Data Mahasiswa [show()]
const show = () => {
  mahasiswaList.mahasiswa.forEach((mhs) => {
    console.log(`NIM: ${mhs.nim}, Nama: ${mhs.nama}, Status: ${mhs.status ? "Aktif" : "Tidak Aktif"}`);
        console.log("Mata Kuliah:");

    mhs.matkul.forEach((mk) => {
        const matkulObj = mataKuliahList.mataKuliah.find((m) => m.kode === mk.matkulId);
        const matkulName = matkulObj ? matkulObj.nama : "Mata Kuliah Tidak Ditemukan";
        console.log(`- ${matkulName}: Tugas ${mk.tugas}, UTS ${mk.uts}, UAS ${mk.uas}`);
    });
  });
};

show();


// Menambah Mahasiswa Baru [add()]
const add = (mahasiswa) => mahasiswaList.mahasiswa.push(mahasiswa);

add({
  nim: "22003",
  nama: "Andi Setiawan",
  status: true,
  matkul: [{ matkulId: "MK003", tugas: 88, uts: 85, uas: 90 }],
});

console.log("===== Setelah tambah mahasiswa baru: =====");
console.log(mahasiswaList);


// Mengupdate Mahasiswa [update()]
const update = (nim, dataBaru) => {
  mahasiswaList.mahasiswa = mahasiswaList.mahasiswa.map((m) =>
    m.nim === nim ? { ...m, ...dataBaru } : m
  );
};

update("22001", { status: false });
console.log("===== Setelah update status mahasiswa 22001: =====");
console.log(mahasiswaList);


// Menghapus Mahasiswa [deleteById()]
const deleteById = (nim) => {
  mahasiswaList.mahasiswa = mahasiswaList.mahasiswa.filter((m) => m.nim !== nim);
};

deleteById("22002");
console.log("===== Setelah hapus mahasiswa 22002: =====");
console.log(mahasiswaList);


// Menghitung Total Nilai [totalNilai()]
const hitungTotalNilai = (nim) => {
  const mahasiswa = mahasiswaList.mahasiswa.find((m) => m.nim === nim);
  if (!mahasiswa) return "Mahasiswa tidak ditemukan";

  return mahasiswa.matkul.map((mk) => {
    const total = mk.tugas + mk.uts + mk.uas;
    return { matkulId: mk.matkulId, total };
  });
};

console.log("===== Total Nilai Mahasiswa NIM 22001: =====", hitungTotalNilai("22001"));


// Mengelompokkan Mahasiswa Berdasarkan Kategori Nilai [kategoriNilai()]
const kategoriNilai = (nilai) => {
  if (nilai >= 85) return "A";
  if (nilai >= 75) return "B";
  if (nilai >= 65) return "C";
  if (nilai >= 50) return "D";
  return "E";
};

console.log(`Kategori Nilai 88: ${kategoriNilai(88)}`);
console.log(`Kategori Nilai 72: ${kategoriNilai(72)}`);


// Menghitung IPS Mahasiswa [IPS()]
const IPS = (nim) => {
  const mahasiswa = mahasiswaList.mahasiswa.find((m) => m.nim === nim);
  if (!mahasiswa) return "Mahasiswa tidak ditemukan";

  const totalSks = mahasiswa.matkul.reduce((sum, mk) => {
    const matkul = mataKuliahList.mataKuliah.find((m) => m.kode === mk.matkulId);
    return sum + (matkul ? matkul.sks : 0);
  }, 0);

  const totalNilai = mahasiswa.matkul.reduce((sum, mk) => {
    const matkul = mataKuliahList.mataKuliah.find((m) => m.kode === mk.matkulId);
    const total = mk.tugas * 0.3 + mk.uts * 0.3 + mk.uas * 0.4;
    return sum + total * (matkul ? matkul.sks : 0);
  }, 0);

  return totalSks === 0 ? "Data SKS tidak valid" : (totalNilai / totalSks).toFixed(2);
};

console.log(`IPS Mahasiswa 22001: =====> ${IPS("22001")}`);


// clear()  Menghapus semua data mahasiswa.
function clear() {
  for (let key in mahasiswa) {
    if (Array.isArray(mahasiswa[key])) mahasiswa[key] = [];
    else if (typeof mahasiswa[key] === "object" && mahasiswa[key] !== null) mahasiswa[key] = {};
    else mahasiswa[key] = null;
  }
  console.log("===== Sukses Menghapus semua data mahasiswa =====");
  console.log(mahasiswa);
}

console.log("===== clear() =====");
clear();


// Menghitung Jumlah Mahasiswa [jumlahMahasiswa()]
const jumlahMahasiswa = () => mahasiswaList.mahasiswa.length;
console.log(`Jumlah Mahasiswa: ${jumlahMahasiswa()}`);


// Mengurutkan Mahasiswa berdasarkan NIM [sortByNIM()]
const sortByNIM = () => mahasiswaList.mahasiswa.sort((a, b) => a.nim.localeCompare(b.nim));
sortByNIM();
console.log("===== Urutkan berdasarkan NIM: =====");
console.log(mahasiswaList);


// Menghitung Mahasiswa Aktif dan Tidak Aktif [jumlahAktifTidak()]
const jumlahAktifTidak = () => {
  return {
    aktif: mahasiswaList.mahasiswa.filter((m) => m.status).length,
    tidakAktif: mahasiswaList.mahasiswa.filter((m) => !m.status).length,
  };
};

console.log("Jumlah Mahasiswa Aktif dan Tidak Aktif:", jumlahAktifTidak());

// clearArray() Hapus semua data dari mahasiswaList
function clearArray() {
  mahasiswaList.mahasiswa.length = 0;
  console.log("Sukses Menghapus semua data mahasiswa dari array", mahasiswaList.mahasiswa);
}

console.log("===== clearArray() =====");

clearArray();
