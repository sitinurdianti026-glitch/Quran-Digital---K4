
const API = "https://api.alquran.cloud/v1";

let daftarSurah = [];


// Mengambil daftar surah dari API
async function ambilDaftarSurah() {

    const container =
        document.getElementById("daftarSurah");

    try {

        const response = await fetch(API + "/surah");

        const hasil = await response.json();

        if (hasil.code !== 200) {
            throw new Error("Gagal mengambil data surah.");
        }

        daftarSurah = hasil.data;

        tampilkanDaftarSurah(daftarSurah);

    } catch (error) {

        container.innerHTML =
            '<p class="no-result">Gagal memuat daftar surah. Periksa koneksi internet.</p>';

        console.error(error);

    }

}


// Menampilkan kartu daftar surah
function tampilkanDaftarSurah(dataSurah) {

    const container =
        document.getElementById("daftarSurah");

    container.innerHTML = "";

    if (dataSurah.length === 0) {

        container.innerHTML =
            '<p class="no-result">Surah tidak ditemukan.</p>';

        return;

    }

    dataSurah.forEach(function (surah) {

        const kartu =
            document.createElement("div");

        kartu.className = "surah-card";

        kartu.innerHTML = `
            <div class="surah-number">
                ${surah.number}
            </div>

            <div class="surah-card-info">
                <h3>${surah.englishName}</h3>

                <p>
                    ${surah.englishNameTranslation}
                    • ${surah.numberOfAyahs} Ayat
                </p>
            </div>

            <div class="surah-card-arab">
                ${surah.name}
            </div>
        `;

        // Ketika kartu diklik
        kartu.addEventListener("click", function () {

            tampilkanSurah(surah.number);

            document.getElementById("baca-quran")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

        container.appendChild(kartu);

    });

}


// Fitur pencarian surah
document.getElementById("cariSurah")
    .addEventListener("input", function () {

        const kataKunci =
            this.value.toLowerCase().trim();

        const hasilPencarian =
            daftarSurah.filter(function (surah) {

                return (
                    surah.englishName
                        .toLowerCase()
                        .includes(kataKunci) ||

                    surah.englishNameTranslation
                        .toLowerCase()
                        .includes(kataKunci) ||

                    surah.name
                        .toLowerCase()
                        .includes(kataKunci) ||

                    String(surah.number)
                        .includes(kataKunci)
                );

            });

        tampilkanDaftarSurah(hasilPencarian);

    });


// Menampilkan ayat surah
async function tampilkanSurah(nomor) {

    const isiAyat =
        document.getElementById("isiAyat");

    isiAyat.innerHTML =
        '<div class="empty-state"><p>Memuat ayat Al-Qur\'an...</p></div>';


    try {

        const url =
            API + "/surah/" + nomor +
            "/editions/quran-uthmani,id.indonesian";

        const response = await fetch(url);

        const hasil = await response.json();

        if (hasil.code !== 200) {
            throw new Error("Data surah tidak ditemukan.");
        }

        const arab = hasil.data[0];

        const indonesia = hasil.data[1];


        // Informasi surah
        document.getElementById("namaSurah")
            .textContent =
            arab.name + " (" + arab.englishName + ")";


        document.getElementById("detailSurah")
            .textContent =
            arab.englishNameTranslation +
            " • " + arab.numberOfAyahs +
            " Ayat • " + arab.revelationType;


        // Audio murottal
        const audio =
            document.getElementById("audioSurah");

        audio.src =
            "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/" +
            nomor + ".mp3";

        audio.load();


        // Mengosongkan ayat sebelumnya
        isiAyat.innerHTML = "";


        // Menampilkan ayat
        arab.ayahs.forEach(function (ayat, index) {

            const terjemahan =
                indonesia.ayahs[index];

            const kartu =
                document.createElement("div");

            kartu.className = "ayat-card";


            // Nomor ayat
            const nomorAyat =
                document.createElement("div");

            nomorAyat.className = "ayat-number";

            nomorAyat.textContent =
                ayat.numberInSurah;

            kartu.appendChild(nomorAyat);


            // Teks Arab
            const teksArab =
                document.createElement("p");

            teksArab.className = "teks-arab";

            teksArab.textContent = ayat.text;

            teksArab.dir = "rtl";

            teksArab.lang = "ar";

            teksArab.setAttribute("translate", "no");

            kartu.appendChild(teksArab);


            // Terjemahan Indonesia
            const teksIndonesia =
                document.createElement("p");

            teksIndonesia.className = "teks-indonesia";

            teksIndonesia.textContent =
                terjemahan.text;

            kartu.appendChild(teksIndonesia);


            isiAyat.appendChild(kartu);

        });


    } catch (error) {

        isiAyat.innerHTML =
            '<div class="empty-state"><h3>Data tidak dapat ditampilkan</h3><p>Silakan periksa koneksi internet.</p></div>';

        console.error(error);

    }

}


// Memuat daftar surah saat halaman dibuka
ambilDaftarSurah();


// Membuka Al-Fatihah sebagai surah awal
tampilkanSurah(1);
