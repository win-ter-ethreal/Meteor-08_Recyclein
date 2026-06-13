const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ================= AUTHENTICATION =================

// 1. Registrasi
app.post('/api/register', async (req, res) => {
    console.log("=== REGISTER REQUEST ===");
    console.log("Data diterima:", req.body);

    if (!req.body || !req.body.email) {
        return res.status(400).json({ error: 'Data register tidak diterima oleh server' });
    }

    const { name: nama, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (nama, email, password, role, poin) VALUES (?, ?, ?, "user", 0)',
            [nama, email, hashedPassword]);
        res.status(201).json({ message: 'User berhasil didaftarkan!' });
    } catch (error) {
        console.error("Register Error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email ini sudah terdaftar, silakan gunakan email lain atau login.' });
        }
        res.status(500).json({ error: 'Terjadi kesalahan di server' });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).json({ error: 'Email tidak ditemukan' });

        const user = rows[0];
        const isActive = user.is_active !== undefined ? user.is_active : 1;
        if (!isActive) return res.status(403).json({ error: 'Akun Anda telah dinonaktifkan. Hubungi admin.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Password salah' });

        const token = jwt.sign({ id: user.id_user, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user.id_user, name: user.nama, email: user.email, role: user.role, points: user.poin || 0 }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware Token
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Akses ditolak' });
    try {
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token tidak valid' });
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token tidak valid' });
    }
};

// Middleware Admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Akses ditolak, bukan Admin' });
    next();
};

// ================= PROFILE =================
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id_user, nama, email, role, poin, COALESCE(is_active, 1) as is_active FROM users WHERE id_user = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
        const user = rows[0];
        res.json({ id: user.id_user, name: user.nama, email: user.email, role: user.role, points: user.poin, is_active: user.is_active });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
    const { name, email } = req.body;
    try {
        await db.query('UPDATE users SET nama = ?, email = ? WHERE id_user = ?', [name, email, req.user.id]);
        const [rows] = await db.query('SELECT id_user, nama, email, role, poin FROM users WHERE id_user = ?', [req.user.id]);
        const user = rows[0];
        res.json({ id: user.id_user, name: user.nama, email: user.email, role: user.role, points: user.poin });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email sudah digunakan' });
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/profile/password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const [rows] = await db.query('SELECT password FROM users WHERE id_user = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
        const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
        if (!isMatch) return res.status(400).json({ error: 'Password saat ini salah' });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id_user = ?', [hashedPassword, req.user.id]);
        res.json({ message: 'Password berhasil diubah!' });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ================= KATEGORI SAMPAH =================
app.get('/api/kategori', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kategori_sampah');
        res.json(rows);
    } catch (error) {
        console.error("Kategori Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ================= RESERVASI =================
app.post('/api/reservasi', authMiddleware, async (req, res) => {
    const { tanggal_penjemputan, waktu_penjemputan, catatan, items } = req.body;
    const id_user = req.user.id;

    try {
        await db.query('START TRANSACTION');
        const [result] = await db.query(
            'INSERT INTO reservasi_penjemputan (id_user, tanggal_penjemputan, waktu_penjemputan, catatan) VALUES (?, ?, ?, ?)',
            [id_user, tanggal_penjemputan, waktu_penjemputan, catatan]
        );
        const id_reservasi = result.insertId;

        if (items && items.length > 0) {
            for (let item of items) {
                await db.query(
                    'INSERT INTO detail_reservasi (id_reservasi, id_kategori, estimasi_berat) VALUES (?, ?, ?)',
                    [id_reservasi, item.id_kategori, item.estimasi_berat]
                );
            }
        }

        await db.query('COMMIT');
        res.status(201).json({ message: 'Reservasi berhasil dibuat!' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error("Reservasi Error:", error);
        res.status(500).json({ error: 'Gagal membuat reservasi' });
    }
});

// ================= REWARD & REDEEM =================
app.get('/api/rewards', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id_reward as id, nama_reward as title, poin_dibutuhkan as points, stok as stock FROM reward');
        res.json(rows);
    } catch (error) {
        console.error("Rewards Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/rewards/redeem', authMiddleware, async (req, res) => {
    const { id_reward } = req.body;
    const id_user = req.user.id;

    try {
        await db.query('START TRANSACTION');

        const [userRows] = await db.query('SELECT poin FROM users WHERE id_user = ?', [id_user]);
        const [rewardRows] = await db.query('SELECT * FROM reward WHERE id_reward = ?', [id_reward]);

        const user = userRows[0];
        if (!user) { await db.query('ROLLBACK'); return res.status(404).json({ error: 'User tidak ditemukan' }); }
        const reward = rewardRows[0];

        if (!reward || reward.stok <= 0) { await db.query('ROLLBACK'); return res.status(400).json({ error: 'Stok habis' }); }
        if (user.poin < reward.poin_dibutuhkan) { await db.query('ROLLBACK'); return res.status(400).json({ error: 'Poin tidak cukup' }); }

        await db.query('UPDATE users SET poin = poin - ? WHERE id_user = ?', [reward.poin_dibutuhkan, id_user]);
        await db.query('UPDATE reward SET stok = stok - 1 WHERE id_reward = ?', [id_reward]);
        await db.query('INSERT INTO redeem_reward (id_user, id_reward, status_redeem) VALUES (?, ?, "Berhasil")', [id_user, id_reward]);
        await db.query('INSERT INTO transaksi_poin (id_user, tipe_transaksi, jumlah_poin, keterangan) VALUES (?, "Keluar", ?, ?)',
            [id_user, reward.poin_dibutuhkan, `Redeem ${reward.nama_reward}`]);

        await db.query('COMMIT');
        res.json({ message: 'Redeem berhasil!' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error("Redeem Error:", error);
        res.status(500).json({ error: 'Gagal redeem reward' });
    }
});

// ================= ADMIN =================
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "user"');
        const [mitraCount] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "mitra"');
        const [reservasiCount] = await db.query('SELECT COUNT(*) as total FROM reservasi_penjemputan');

        let dashboardStats = { total_sampah_daur: 0, pohon_diselamatkan: 0 };
        try {
            const [dashboard] = await db.query('SELECT * FROM dashboard_lingkungan LIMIT 1');
            if (dashboard.length > 0) dashboardStats = dashboard[0];
        } catch (e) { /* Abaikan jika tabel belum ada */ }

        res.json({
            totalUsers: userCount[0].total,
            totalMitra: mitraCount[0].total,
            totalReservasi: reservasiCount[0].total,
            dashboardStats
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id_user, nama, email, poin, role, created_at, COALESCE(is_active, 1) as is_active FROM users');
        res.json(rows);
    } catch (error) {
        console.error("Admin Users Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/admin/reservasi', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.id_reservasi, u.nama as user_nama, r.tanggal_penjemputan, r.waktu_penjemputan, r.status_penjemputan 
            FROM reservasi_penjemputan r 
            JOIN users u ON r.id_user = u.id_user
            ORDER BY r.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("Admin Reservasi Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/admin/reservasi/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status_penjemputan } = req.body;

    try {
        await db.query('UPDATE reservasi_penjemputan SET status_penjemputan = ? WHERE id_reservasi = ?', [status_penjemputan, id]);

        if (status_penjemputan === 'Selesai') {
            const [reservasiRows] = await db.query('SELECT id_user FROM reservasi_penjemputan WHERE id_reservasi = ?', [id]);
            const [detailRows] = await db.query('SELECT SUM(estimasi_berat) as total_berat FROM detail_reservasi WHERE id_reservasi = ?', [id]);

            if (reservasiRows.length > 0 && detailRows[0].total_berat > 0) {
                const id_user = reservasiRows[0].id_user;
                const totalBerat = detailRows[0].total_berat;
                const poinDidapat = Math.round(totalBerat * 100);

                await db.query('UPDATE users SET poin = poin + ? WHERE id_user = ?', [poinDidapat, id_user]);

                try {
                    await db.query('INSERT INTO poin_user (id_user, jumlah_poin, keterangan) VALUES (?, ?, ?)',
                        [id_user, poinDidapat, `Penjemputan sampah #${id} selesai (${totalBerat} kg)`]);
                } catch (e) { console.log("Tabel poin_user belum ada, dilewati"); }

                await db.query('INSERT INTO transaksi_poin (id_user, tipe_transaksi, jumlah_poin, keterangan) VALUES (?, "Masuk", ?, ?)',
                    [id_user, poinDidapat, `Poin dari reservasi #${id}`]);
            }
        }

        res.json({ message: 'Status reservasi berhasil diupdate!' });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ error: 'Gagal update status' });
    }
});

app.put('/api/admin/users/:id/reset-password', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const defaultPassword = 'recycle123';
    try {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id_user = ?', [hashedPassword, id]);
        res.json({ message: `Password berhasil direset menjadi "${defaultPassword}"` });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/admin/users/:id/toggle-status', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT is_active FROM users WHERE id_user = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
        const currentStatus = rows[0].is_active !== undefined ? rows[0].is_active : 1;
        const newStatus = currentStatus ? 0 : 1;
        await db.query('UPDATE users SET is_active = ? WHERE id_user = ?', [newStatus, id]);
        const statusText = newStatus ? 'diaktifkan' : 'dinonaktifkan';
        res.json({ message: `User berhasil ${statusText}`, is_active: newStatus });
    } catch (error) {
        console.error("Toggle Status Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/admin/reservasi/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [reservasi] = await db.query(`
            SELECT r.id_reservasi, u.nama as user_nama, u.email as user_email, 
                   r.tanggal_penjemputan, r.waktu_penjemputan, r.status_penjemputan, r.catatan
            FROM reservasi_penjemputan r 
            JOIN users u ON r.id_user = u.id_user
            WHERE r.id_reservasi = ?
        `, [id]);
        if (reservasi.length === 0) return res.status(404).json({ error: 'Reservasi tidak ditemukan' });
        const [items] = await db.query(`
            SELECT d.estimasi_berat, k.nama_kategori, k.ikon
            FROM detail_reservasi d
            JOIN kategori_sampah k ON d.id_kategori = k.id_kategori
            WHERE d.id_reservasi = ?
        `, [id]);
        res.json({ ...reservasi[0], items });
    } catch (error) {
        console.error("Detail Reservasi Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ================= GACHA & CLAIM SYSTEM =================

// 1. User melakukan tarik Gacha
app.post('/api/gacha/pull', authMiddleware, async (req, res) => {
    const { reward_name, rarity, cost } = req.body;
    const id_user = req.user.id;

    try {
        await db.query('START TRANSACTION');

        const [userRows] = await db.query('SELECT poin FROM users WHERE id_user = ?', [id_user]);
        if (userRows[0].poin < cost) {
            await db.query('ROLLBACK');
            return res.status(400).json({ error: 'Poin tidak cukup' });
        }

        await db.query('UPDATE users SET poin = poin - ? WHERE id_user = ?', [cost, id_user]);

        // PERBAIKAN: Tambahkan status default "Menunggu Klaim" secara eksplisit
        await db.query('INSERT INTO claim_history (id_user, reward_name, rarity, status) VALUES (?, ?, ?, "Menunggu Klaim")',
            [id_user, reward_name, rarity]);

        await db.query('COMMIT');
        res.json({ message: 'Gacha berhasil! Hadiah masuk ke riwayat klaim.' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error("Gacha Pull Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. User melihat riwayat hadiah & status klaim (Hanya milik user tersebut)
app.get('/api/gacha/history', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM claim_history WHERE id_user = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(rows);
    } catch (error) {
        console.error("History Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. User menekan tombol "Klaim Hadiah"
app.put('/api/gacha/claim/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE claim_history SET status = "Diproses Admin" WHERE id_claim = ? AND id_user = ? AND status = "Menunggu Klaim"', [id, req.user.id]);
        res.json({ message: 'Hadiah berhasil diklaim! Tunggu Admin memproses.' });
    } catch (error) {
        console.error("Claim Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ================= ADMIN CLAIM (BARU) =================

// 4. Admin: Melihat semua permintaan klaim dari semua user
app.get('/api/admin/claims', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ch.id_claim, ch.reward_name, ch.rarity, ch.status, ch.created_at as tanggal_klaim, u.nama as user_nama 
            FROM claim_history ch 
            JOIN users u ON ch.id_user = u.id_user 
            ORDER BY ch.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("Admin Claims Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 5. Admin: Menyetujui/Memberikan hadiah ke user
app.put('/api/admin/claims/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE claim_history SET status = "Selesai" WHERE id_claim = ?', [id]);
        res.json({ message: 'Hadiah berhasil diproses dan diberikan ke user!' });
    } catch (error) {
        console.error("Admin Approve Claim Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ SERVER V2 BERJALAN DI PORT ${PORT}`));