const express = require('express'); // Mengimpor modul Express untuk membuat server
const mysql = require('mysql2'); // Mengimpor modul MySQL2 untuk koneksi dengan database MySQL
const bodyParser = require('body-parser'); // Mengimpor modul Body Parser untuk mengelola data dari form

const app = express(); // Membuat instance aplikasi Express

app.use(bodyParser.urlencoded({ extended: false })); // Menggunakan body-parser untuk menangani data form yang dikirimkan melalui URL-encoded
app.use(bodyParser.json()); // Menggunakan body-parser untuk menangani data JSON

// Koneksi ke database MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Alamat host database (localhost karena database berjalan di komputer lokal)
    user: 'root', // Username MySQL
    password: '', // Password MySQL (dikosongkan jika tidak ada)
    database: 'pertemuan5' // Nama database yang digunakan dalam aplikasi
});

// Cek koneksi MySQL
connection.connect((err) => {
    if (err) { // Jika terjadi kesalahan, tampilkan pesan error
        console.error("Terjadi kesalahan dalam koneksi ke MySQL:", err.stack);
        return;
    }
    console.log("Koneksi MySQL berhasil dengan id " + connection.threadId); // Jika koneksi berhasil, tampilkan ID thread dari koneksi
});

// Menggunakan EJS sebagai view engine untuk merender halaman HTML
app.set('view engine', 'ejs'); // Menyatakan bahwa EJS adalah template engine yang digunakan
app.set('views', './views'); // Menyatakan bahwa semua file template HTML berada di folder 'views'

// Route untuk Read (menampilkan semua user)
app.get('/', (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => { // Query SQL untuk mengambil semua data dari tabel 'users'
        if (err) throw err; // Jika ada kesalahan dalam query, tampilkan error
        res.render('Tampilan1', { users: result }); // Render file 'index.ejs' dengan data user yang diambil dari database
    });
});

// Route untuk Create (menambahkan user baru)
app.post('/add', (req, res) => {
    const { name, email, nim } = req.body; // Mengambil data dari form input user
    const query = 'INSERT INTO users (name, email, nim) VALUES (?, ?, ?)'; // Query SQL untuk menambahkan user baru ke database
    connection.query(query, [name, email, nim], (err, result) => { // Eksekusi query dengan data user
        if (err) throw err; // Jika ada kesalahan, tampilkan error
        res.redirect('/'); // Setelah berhasil menambahkan, redirect kembali ke halaman utama
    });
});

// Route untuk Update (mengambil data user berdasarkan ID untuk diedit)
app.get('/edit/:id', (req, res) => {
    const { id } = req.params; // Mengambil ID user dari parameter URL
    const query = 'SELECT * FROM users WHERE id = ?'; // Query SQL untuk mengambil data user berdasarkan ID
    connection.query(query, [id], (err, result) => {
        if (err) throw err; // Jika ada kesalahan, tampilkan error
        res.render('edit', { user: result[0] }); // Render form edit dengan data user yang diambil
    });
});

// Route untuk Update (mengirim perubahan user ke database)
app.post('/update/:id', (req, res) => {
    const { name, email, nim } = req.body; // Mengambil data yang telah diubah dari form
    const query = 'UPDATE users SET name = ?, email = ?, nim = ? WHERE id = ?'; // Query SQL untuk memperbarui data user di database
    connection.query(query, [name, email, nim, req.params.id], (err, result) => {
        if (err) throw err; // Jika ada kesalahan, tampilkan error
        res.redirect('/'); // Setelah berhasil diupdate, redirect kembali ke halaman utama
    });
});

// Route untuk Delete (menghapus user berdasarkan ID)
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM users WHERE id = ?'; // Query SQL untuk menghapus user dari database berdasarkan ID
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err; // Jika ada kesalahan, tampilkan error
        res.redirect('/'); // Setelah berhasil dihapus, redirect kembali ke halaman utama
    });
});

// Server yang fadli buat nantinya akan berjalan di port 3000
app.listen(3000, () => {
    console.log('Server berjalan di port 3000. Bukalah akses melalui http://localhost:3000'); // Menjalankan server di port 3000
});



