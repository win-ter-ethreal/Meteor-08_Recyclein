import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Users, Truck, Leaf, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
    const { 
        currentUser, 
        adminStats, adminUsers, adminReservations,
        fetchAdminStats, fetchAdminUsers, fetchAdminReservations, updateReservationStatus
    } = useApp();
    
    const [activeTab, setActiveTab] = useState('stats');

    // Ambil data dari API saat halaman dibuka
    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            fetchAdminStats();
            fetchAdminUsers();
            fetchAdminReservations();
        }
    }, [currentUser]);

    // Keamanan: Jika bukan admin, tolak akses
    if (!currentUser || currentUser.role !== 'admin') {
        return <div className="p-8 text-center text-red-500 font-bold text-xl mt-20">403 - Akses Ditolak. Halaman ini hanya untuk Admin.</div>;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/'; // Kembali ke halaman login
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar Admin */}
            <div className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Leaf /> Recycle-In Admin Panel
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm hidden md:block">Halo, {currentUser.name}</span>
                    <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 flex items-center gap-2 transition">
                        <LogOut size={16}/> Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto p-6">
                {/* Menu Navigasi Tab */}
                <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm">
                    <button onClick={() => setActiveTab('stats')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${activeTab === 'stats' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <LayoutDashboard size={18}/> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Users size={18}/> Kelola User
                    </button>
                    <button onClick={() => setActiveTab('reservations')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${activeTab === 'reservations' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Truck size={18}/> Penjemputan
                    </button>
                </div>

                {/* Konten Berdasarkan Tab */}
                
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500 hover:shadow-lg transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total User</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{adminStats.totalUsers}</h3>
                                </div>
                                <Users className="text-blue-500 w-12 h-12 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500 hover:shadow-lg transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Reservasi</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{adminStats.totalReservasi}</h3>
                                </div>
                                <Truck className="text-green-500 w-12 h-12 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500 hover:shadow-lg transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Mitra Aktif</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{adminStats.totalMitra}</h3>
                                </div>
                                <UserCircle className="text-yellow-500 w-12 h-12 opacity-80" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-bold text-gray-700">Data Pengguna Terdaftar</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b text-gray-600 text-sm">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Nama</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Poin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminUsers.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-400">Memuat data...</td></tr> : null}
                                    {adminUsers.map(user => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-4 text-gray-500"># {user.id}</td>
                                            <td className="p-4 font-semibold text-gray-800">{user.name}</td>
                                            <td className="p-4 text-gray-600">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-100 text-red-600' : user.role === 'mitra' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-yellow-600 font-bold">{user.points.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reservations' && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-bold text-gray-700">Jadwal Penjemputan Sampah</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b text-gray-600 text-sm">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Pengguna</th>
                                        <th className="p-4">Kategori</th>
                                        <th className="p-4">Tanggal</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminReservations.length === 0 ? <tr><td colSpan="6" className="p-4 text-center text-gray-400">Memuat data...</td></tr> : null}
                                    {adminReservations.map(res => (
                                        <tr key={res.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-4 text-gray-500"># {res.id}</td>
                                            <td className="p-4 font-semibold text-gray-800">{res.user_name}</td>
                                            <td className="p-4">{res.category}</td>
                                            <td className="p-4 text-sm text-gray-600">{new Date(res.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    res.status === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-700' : 
                                                    res.status === 'Dijemput' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {res.status === 'Menunggu Verifikasi' && (
                                                    <button 
                                                        onClick={() => updateReservationStatus(res.id, 'Dijemput')}
                                                        className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-secondary transition"
                                                    >
                                                        Setujui Jemput
                                                    </button>
                                                )}
                                                {res.status === 'Dijemput' && (
                                                    <button 
                                                        onClick={() => updateReservationStatus(res.id, 'Selesai')}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition"
                                                    >
                                                        Tandai Selesai
                                                    </button>
                                                )}
                                                {res.status === 'Selesai' && (
                                                    <span className="text-green-500 text-sm font-medium">✓ Selesai</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;