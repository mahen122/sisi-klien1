// React itu bungkus HTML ke dalam Javascript
// 1 file jsx itu punya 1 function utama
// 1 function utama dinyatakan dengan default
// 1 function harus return 1 tag. tidak boleh lebih 

function Home () {
    return  <h1 class="text-3x1 font-bold underline">
                Hello World!
            </h1>;
            // <div>
            //     <Judul />
            //     <Isi />
            // </div>
}

function Judul() {
    return <h1>Berita Heboh</h1>;
}

function Isi() {
    return <p>Semarang. Hari ini telah lahir banyak programmer frontend jago dari kelas D2I</p>;
}

export default Home;