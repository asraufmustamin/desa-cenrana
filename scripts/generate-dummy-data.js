// Generate 100 Dummy Penduduk Data
const XLSX = require('xlsx');
const fs = require('fs');

// Data pools
const namaDepan = [
    'Abdullah', 'Ahmad', 'Ali', 'Amir', 'Andi', 'Arif', 'Budi', 'Dedi', 'Eko', 'Fajar',
    'Hadi', 'Hasan', 'Ilham', 'Joko', 'Kurnia', 'Lukman', 'Muhammad', 'Nur', 'Rizki', 'Yusuf',
    'Aminah', 'Ani', 'Dewi', 'Fatimah', 'Fitri', 'Intan', 'Lestari', 'Noor', 'Putri', 'Rina',
    'Sari', 'Siti', 'Sri', 'Tri', 'Wati', 'Yanti', 'Zahra'
];

const namaBelakang = [
    'Abdullah', 'Akbar', 'Amin', 'Basri', 'Gunawan', 'Hasan', 'Ibrahim', 'Ismail', 'Jamil',
    'Karim', 'Mahmud', 'Mansur', 'Nasir', 'Pratama', 'Rahman', 'Ramadhan', 'Santoso', 'Saputra',
    'Syahputra', 'Wahyudi', 'Yunus', 'Hakim', 'Kusuma', 'Permana', 'Wibowo'
];

const dusunList = ['Benteng', 'Kajuara', 'Tanatengnga', 'Panagi', 'Holiang'];

const pekerjaanList = [
    'Petani', 'Pedagang', 'Nelayan', 'Buruh', 'Wiraswasta', 'PNS', 'Guru', 'Sopir',
    'Tukang', 'Karyawan Swasta', 'Ibu Rumah Tangga', 'Pelajar', 'Mahasiswa'
];

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateNIK(index) {
    // Format NIK Indonesia: 16 digit EXACTLY
    // 737101 (6 digit kode wilayah Maros) + DDMMYY (6 digit) + XXXX (4 digit serial)
    // Total: 6 + 6 + 4 = 16 ✓

    const year = 1970 + Math.floor(Math.random() * 40); // 1970-2010
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    const ddmmyy = day + month + String(year).slice(2);
    const serial = String(index + 1).padStart(4, '0');

    // 737101 (Maros) + 260690 (26 Juni 1990) + 0001 = 7371012606900001 (16 digit)
    return '737101' + ddmmyy + serial;
}

function generateTanggalLahir(nik) {
    // Extract from NIK: position 6-11 is DDMMYY (after 737101)
    const dd = nik.slice(6, 8);
    const mm = nik.slice(8, 10);
    const yy = nik.slice(10, 12);

    const year = parseInt(yy) < 50 ? '20' + yy : '19' + yy;
    return `${year}-${mm}-${dd}`;
}

function generateData() {
    const data = [];

    for (let i = 0; i < 100; i++) {
        const nik = generateNIK(i);
        const nama = `${randomElement(namaDepan)} ${randomElement(namaBelakang)}`;
        const dusun = randomElement(dusunList);
        const tanggalLahir = Math.random() > 0.2 ? generateTanggalLahir(nik) : ''; // 80% filled
        const pekerjaan = Math.random() > 0.3 ? randomElement(pekerjaanList) : ''; // 70% filled

        data.push({
            NIK: nik,
            Nama: nama,
            Dusun: dusun,
            'Tanggal Lahir': tanggalLahir,
            Pekerjaan: pekerjaan
        });
    }

    return data;
}

// Generate data
console.log('🔄 Generating 100 dummy penduduk data...');
const dummyData = generateData();

// Create workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(dummyData);

// Add to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Data Penduduk');

// Write to file
const filename = 'dummy_penduduk_100.xlsx';
XLSX.writeFile(wb, filename);

console.log('✅ File created:', filename);
console.log('📊 Total records:', dummyData.length);
console.log('');
console.log('Sample data (first 5):');
dummyData.slice(0, 5).forEach((row, i) => {
    console.log(`${i + 1}. ${row.NIK} - ${row.Nama} (${row.Dusun})`);
});
console.log('');
console.log('🎉 Ready to import!');
