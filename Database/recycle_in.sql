-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 13 Jun 2026 pada 18.43
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recycle_in`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `claim_history`
--

CREATE TABLE `claim_history` (
  `id_claim` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `reward_name` varchar(255) NOT NULL,
  `rarity` varchar(50) DEFAULT NULL,
  `status` enum('Menunggu Klaim','Diproses Admin','Selesai') DEFAULT 'Menunggu Klaim',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `claim_history`
--

INSERT INTO `claim_history` (`id_claim`, `id_user`, `reward_name`, `rarity`, `status`, `created_at`) VALUES
(1, 2, 'Voucher Mitra Potongan 5%', 'Normal', 'Selesai', '2026-06-13 16:14:52'),
(2, 2, 'Saldo Dana 5k', 'Normal', 'Selesai', '2026-06-13 16:18:52'),
(3, 2, 'Saldo Dana 10k', 'Langka', 'Selesai', '2026-06-13 16:19:01'),
(4, 2, 'Saldo Dana 5k', 'Normal', 'Selesai', '2026-06-13 16:25:24'),
(5, 2, 'Saldo Dana 10k', 'Langka', 'Selesai', '2026-06-13 16:27:57'),
(6, 2, 'Saldo Dana 5k', 'Normal', 'Selesai', '2026-06-13 16:38:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `dashboard_lingkungan`
--

CREATE TABLE `dashboard_lingkungan` (
  `id_dashboard` int(11) NOT NULL,
  `judul` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `jumlah_kg` float DEFAULT 0,
  `jumlah_pohon` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `dashboard_lingkungan`
--

INSERT INTO `dashboard_lingkungan` (`id_dashboard`, `judul`, `deskripsi`, `jumlah_kg`, `jumlah_pohon`, `updated_at`) VALUES
(1, 'Dampak Bersama', 'Total kontribusi pelestari bumi', 128.5, 12, '2026-06-07 09:27:39');

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_reservasi`
--

CREATE TABLE `detail_reservasi` (
  `id_detail_reservasi` int(11) NOT NULL,
  `id_reservasi` int(11) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `estimasi_berat` float DEFAULT NULL,
  `foto_sampah` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_reservasi`
--

INSERT INTO `detail_reservasi` (`id_detail_reservasi`, `id_reservasi`, `id_kategori`, `estimasi_berat`, `foto_sampah`) VALUES
(1, 1, 2, 10, NULL),
(2, 2, 2, 5, NULL),
(3, 2, 3, 5, NULL),
(4, 3, 3, 16, NULL),
(5, 3, 1, 3, NULL),
(6, 3, 2, 1, NULL),
(7, 3, 4, 2, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori_sampah`
--

CREATE TABLE `kategori_sampah` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(50) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `ikon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kategori_sampah`
--

INSERT INTO `kategori_sampah` (`id_kategori`, `nama_kategori`, `deskripsi`, `ikon`) VALUES
(1, 'Plastik', 'Botol plastik, kantong plastik', '🥤'),
(2, 'Kertas', 'Kardus, koran, kertas bekas', '📦'),
(3, 'Logam', 'Kaleng aluminium, besi bekas', '🥫'),
(4, 'Organik', 'Sisa makanan, daun kering', '🍂');

-- --------------------------------------------------------

--
-- Struktur dari tabel `poin_user`
--

CREATE TABLE `poin_user` (
  `id_poin` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `jumlah_poin` int(11) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `tanggal_dapat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `poin_user`
--

INSERT INTO `poin_user` (`id_poin`, `id_user`, `jumlah_poin`, `keterangan`, `tanggal_dapat`) VALUES
(1, 3, 100, NULL, '2026-06-13 07:06:39'),
(2, 2, 1000, 'Penjemputan sampah #2 selesai (10 kg)', '2026-06-13 15:18:10'),
(3, 2, 1000, 'Penjemputan sampah #1 selesai (10 kg)', '2026-06-13 15:18:14'),
(4, 2, 2200, 'Penjemputan sampah #3 selesai (22 kg)', '2026-06-13 15:25:23');

-- --------------------------------------------------------

--
-- Struktur dari tabel `redeem_reward`
--

CREATE TABLE `redeem_reward` (
  `id_redeem` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_reward` int(11) NOT NULL,
  `tanggal_redeem` timestamp NOT NULL DEFAULT current_timestamp(),
  `status_redeem` enum('Proses','Berhasil','Gagal') DEFAULT 'Proses'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `reservasi_penjemputan`
--

CREATE TABLE `reservasi_penjemputan` (
  `id_reservasi` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `tanggal_penjemputan` date NOT NULL,
  `waktu_penjemputan` varchar(50) NOT NULL,
  `status_penjemputan` enum('Menunggu Konfirmasi','Dikonfirmasi','Selesai','Dibatalkan') DEFAULT 'Menunggu Konfirmasi',
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `reservasi_penjemputan`
--

INSERT INTO `reservasi_penjemputan` (`id_reservasi`, `id_user`, `tanggal_penjemputan`, `waktu_penjemputan`, `status_penjemputan`, `catatan`, `created_at`) VALUES
(1, 2, '2026-06-13', '08:00 - 12:00', 'Selesai', '', '2026-06-13 07:43:45'),
(2, 2, '2026-06-13', '08:00 - 12:00', 'Selesai', '', '2026-06-13 14:54:08'),
(3, 2, '2026-06-13', '13:00 - 17:00', 'Selesai', '', '2026-06-13 15:24:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `reward`
--

CREATE TABLE `reward` (
  `id_reward` int(11) NOT NULL,
  `nama_reward` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `poin_dibutuhkan` int(11) NOT NULL,
  `stok` int(11) NOT NULL,
  `gambar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `reward`
--

INSERT INTO `reward` (`id_reward`, `nama_reward`, `deskripsi`, `poin_dibutuhkan`, `stok`, `gambar`) VALUES
(1, 'Saldo OVO/GoPay Rp50.000', 'Transfer saldo e-wallet', 5000, 10, NULL),
(2, 'Voucher Alfamart Rp25.000', 'Belanja kebutuhan sehari-hari', 2500, 20, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi_poin`
--

CREATE TABLE `transaksi_poin` (
  `id_transaksi` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `tipe_transaksi` enum('Masuk','Keluar') NOT NULL,
  `jumlah_poin` int(11) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `tanggal_transaksi` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi_poin`
--

INSERT INTO `transaksi_poin` (`id_transaksi`, `id_user`, `tipe_transaksi`, `jumlah_poin`, `keterangan`, `tanggal_transaksi`) VALUES
(1, 2, 'Masuk', 1000, 'Poin dari reservasi #2', '2026-06-13 15:18:10'),
(2, 2, 'Masuk', 1000, 'Poin dari reservasi #1', '2026-06-13 15:18:14'),
(3, 2, 'Masuk', 2200, 'Poin dari reservasi #3', '2026-06-13 15:25:23');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','mitra') DEFAULT 'user',
  `poin` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `nama`, `email`, `password`, `role`, `poin`, `created_at`, `is_active`) VALUES
(1, 'Admin RecycleIn', 'admin@mail.com', '$2a$10$dummyhashplaceholder', 'admin', 0, '2026-06-07 09:27:39', 1),
(2, 'riana', 'Rianakhlul@mail.com', '$2b$10$4Pj1kvpSum9cGJHerUQg5upumzbzHl7kdrBJ3fd.xlVEzFB0vtzLy', 'user', 1200, '2026-06-08 03:23:45', 1),
(3, 'Rian akhlul fadli', 'riananakbaik@gmail.com', '$2b$10$XnJW23jYFGjMNr9TPEEAn.SAt19y1Y5d3N0MVy7HGXa9K1thUv6fG', 'user', 100, '2026-06-11 04:10:06', 1),
(8, 'admin123', 'admin123@mail.com', '$2b$10$wXX0lz5YxwUWLXF9asVyXO1uWEoHFz5YjmHkZOKEkFBEfnFtXKTl.', 'admin', 0, '2026-06-13 07:11:15', 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `claim_history`
--
ALTER TABLE `claim_history`
  ADD PRIMARY KEY (`id_claim`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `dashboard_lingkungan`
--
ALTER TABLE `dashboard_lingkungan`
  ADD PRIMARY KEY (`id_dashboard`);

--
-- Indeks untuk tabel `detail_reservasi`
--
ALTER TABLE `detail_reservasi`
  ADD PRIMARY KEY (`id_detail_reservasi`),
  ADD KEY `id_reservasi` (`id_reservasi`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indeks untuk tabel `kategori_sampah`
--
ALTER TABLE `kategori_sampah`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `poin_user`
--
ALTER TABLE `poin_user`
  ADD PRIMARY KEY (`id_poin`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `redeem_reward`
--
ALTER TABLE `redeem_reward`
  ADD PRIMARY KEY (`id_redeem`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_reward` (`id_reward`);

--
-- Indeks untuk tabel `reservasi_penjemputan`
--
ALTER TABLE `reservasi_penjemputan`
  ADD PRIMARY KEY (`id_reservasi`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `reward`
--
ALTER TABLE `reward`
  ADD PRIMARY KEY (`id_reward`);

--
-- Indeks untuk tabel `transaksi_poin`
--
ALTER TABLE `transaksi_poin`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `claim_history`
--
ALTER TABLE `claim_history`
  MODIFY `id_claim` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `dashboard_lingkungan`
--
ALTER TABLE `dashboard_lingkungan`
  MODIFY `id_dashboard` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `detail_reservasi`
--
ALTER TABLE `detail_reservasi`
  MODIFY `id_detail_reservasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `kategori_sampah`
--
ALTER TABLE `kategori_sampah`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `poin_user`
--
ALTER TABLE `poin_user`
  MODIFY `id_poin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `redeem_reward`
--
ALTER TABLE `redeem_reward`
  MODIFY `id_redeem` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `reservasi_penjemputan`
--
ALTER TABLE `reservasi_penjemputan`
  MODIFY `id_reservasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `reward`
--
ALTER TABLE `reward`
  MODIFY `id_reward` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `transaksi_poin`
--
ALTER TABLE `transaksi_poin`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `claim_history`
--
ALTER TABLE `claim_history`
  ADD CONSTRAINT `claim_history_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Ketidakleluasaan untuk tabel `detail_reservasi`
--
ALTER TABLE `detail_reservasi`
  ADD CONSTRAINT `detail_reservasi_ibfk_1` FOREIGN KEY (`id_reservasi`) REFERENCES `reservasi_penjemputan` (`id_reservasi`) ON DELETE CASCADE,
  ADD CONSTRAINT `detail_reservasi_ibfk_2` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_sampah` (`id_kategori`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `poin_user`
--
ALTER TABLE `poin_user`
  ADD CONSTRAINT `poin_user_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `redeem_reward`
--
ALTER TABLE `redeem_reward`
  ADD CONSTRAINT `redeem_reward_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `redeem_reward_ibfk_2` FOREIGN KEY (`id_reward`) REFERENCES `reward` (`id_reward`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `reservasi_penjemputan`
--
ALTER TABLE `reservasi_penjemputan`
  ADD CONSTRAINT `reservasi_penjemputan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transaksi_poin`
--
ALTER TABLE `transaksi_poin`
  ADD CONSTRAINT `transaksi_poin_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
