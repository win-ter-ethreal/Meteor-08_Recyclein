const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware WAJIB ditaruh paling atas sebelum route
app.use(cors());
app.use(express.json()); // Untuk parsing application/json
app.use(express.urlencoded({ extended: true })); // Untuk parsing application/x-www-form-urlencoded

// ================= AUTHENTICATION =================

// 1. Registrasi
app.post('/api/register', async (req, res) => {
    console.log("=== REGISTER REQUEST ===");
    console.log("Data diterima:", req.body);

    if (!req.body || !req.body.email) {
        return res.status(400).json({ error: 'Data register tidak diterima oleh server' });
    }

    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            [name, email, hashedPassword]);
        res.status(201).json({ message: 'User berhasil didaftarkan!' });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: 'Email sudah terdaftar atau error server' });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    console.log("=== LOGIN REQUEST ===");
    console.log("Data diterima:", req.body);

    // Anti-crash: Cek dulu apakah req.body ada isinya
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi ' });
    }

    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).json({ error: 'Email tidak ditemukan' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Password salah' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ 
            token, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role, points: user.points || 0 }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware untuk mengecek Token (Keamanan)
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Akses ditolak, tidak ada token' });
    
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

// ================= REWARDS =================

// 3. Ambil semua Rewards
app.get('/api/rewards', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, title, points_required as points, stock FROM rewards');
        res.json(rows);
    } catch (error) {
        console.error("Fetch Rewards Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. Redeem Reward
app.post('/api/rewards/redeem', authMiddleware, async (req, res) => {
    const { rewardId } = req.body;
    const userId = req.user.id;
    
    try {
        const [userRows] = await db.query('SELECT points FROM users WHERE id = ?', [userId]);
        const [rewardRows] = await db.query('SELECT * FROM rewards WHERE id = ?', [rewardId]);
        
        const user = userRows[0];
        const reward = rewardRows[0];

        if (!reward || reward.stock <= 0) return res.status(400).json({ error: 'Stok habis' });
        if (user.points < reward.points_required) return res.status(400).json({ error: 'Poin tidak cukup' });

        await db.query('UPDATE users SET points = points - ? WHERE id = ?', [reward.points_required, userId]);
        await db.query('UPDATE rewards SET stock = stock - 1 WHERE id = ?', [rewardId]);

        const [updatedUserRows] = await db.query('SELECT id, name, email, role, points FROM users WHERE id = ?', [userId]);
        const updatedUser = updatedUserRows[0];

        res.json({ 
            message: 'Redeem berhasil!', 
            updatedUser: updatedUser 
        });
    } catch (error) {
        console.error("Redeem Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ================= RESERVASI =================

// 5. Buat Reservasi
app.post('/api/reservations', authMiddleware, async (req, res) => {
    const { category, date, time } = req.body;
    const userId = req.user.id;

    try {
        await db.query('INSERT INTO reservations (user_id, category, date, time) VALUES (?, ?, ?, ?)', 
            [userId, category, date, time]);
        res.status(201).json({ message: 'Reservasi berhasil dibuat!' });
    } catch (error) {
        console.error("Reservasi Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));