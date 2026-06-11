import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Users, Truck, Leaf, LogOut, UserCircle, LayoutDashboard, CheckCircle, Clock, Key, ToggleLeft, ToggleRight, Eye, X } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { 
        currentUser, logout, 
        adminStats, adminUsers, adminReservations,
        fetchAdminStats, fetchAdminUsers, fetchAdminReservations, 
        updateReservationStatus, adminResetPassword, adminToggleUserStatus, fetchReservationDetail
    } = useApp();
    
    const [activeTab, setActiveTab] = useState('stats');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            fetchAdminStats();
            fetchAdminUsers();
            fetchAdminReservations();
        }
    }, [currentUser]);

    if (!currentUser) {
        return <div className="p-8 text-center">Silakan login terlebih dahulu.</div>;
    }

    if (currentUser.role !== 'admin') {
        navigate('/dashboard', { replace: true });
        return null;
    }

    const handleViewDetail = async (id) => {
        setDetailLoading(true);
        const detail = await fetchReservationDetail(id);
        if (detail) setSelectedReservation(detail);
        setDetailLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Leaf /> Recycle-In Admin Panel
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm hidden md:block">Halo, {currentUser.name}</span>
                    <button onClick={logout} className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 flex items-center gap-2 transition">
                        <LogOut size={16}/> Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto p-6">
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

                {/* ============ TAB STATS ============ */}
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500 hover:shadow-lg transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total User</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{adminStats.totalUsers || 0}</h3>
                                </div>
                                <Users className="text-blue-500 w-12 h-12 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500 hover:shadow-lg transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Reservasi</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{adminStats.totalReservasi || 0}</h3>
                                </div>
                                <Truck className="text-green-500 w-12 h-12 opacity-80" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500 hover:shadow-lg transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Mitra Aktif</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{adminStats.totalMitra || 0}</h3>
                                </div>
                                <UserCircle className="text-yellow-500 w-12 h-12 opacity-80" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ TAB KELOLA USER ============ */}
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
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center" style={{minWidth: '200px'}}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminUsers.length === 0 ? <tr><td colSpan="7" className="p-4 text-center text-gray-400">Memuat data...</td></tr> : null}
                                    {adminUsers.map(user => (
                                        <tr key={user.id_user} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-4 text-gray-500 font-mono text-sm">#{user.id_user}</td>
                                            <td className="p-4 font-semibold text-gray-800">{user.nama}</td>
                                            <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                                                    user.role === 'mitra' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-yellow-600 font-bold">{Number(user.poin).toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Reset password user "${user.nama}" menjadi "recycle123"?`)) {
                                                                adminResetPassword(user.id_user);
                                                            }
                                                        }}
                                                        className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-600 transition flex items-center gap-1"
                                                    >
                                                        <Key size={12}/> Reset Password
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const action = user.is_active ? 'nonaktifkan' : 'aktifkan';
                                                            if (window.confirm(`Yakin ingin ${action} user "${user.nama}"?`)) {
                                                                adminToggleUserStatus(user.id_user);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                                            user.is_active 
                                                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                                                : 'bg-green-500 text-white hover:bg-green-600'
                                                        }`}
                                                    >
                                                        {user.is_active ? <ToggleRight size={12}/> : <ToggleLeft size={12}/>}
                                                        {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ============ TAB PENJEMPUTAN ============ */}
                {activeTab === 'reservations' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <h2 className="font-bold text-gray-700">Jadwal Penjemputan Sampah</h2>
                                <button onClick={fetchAdminReservations} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                                    <Clock size={14}/> Refresh Data
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b text-gray-600 text-sm">
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Pengguna</th>
                                            <th className="p-4">Tanggal</th>
                                            <th className="p-4">Waktu</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-center">Detail</th>
                                            <th className="p-4 text-center">Aksi Admin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminReservations.length === 0 ? <tr><td colSpan="7" className="p-4 text-center text-gray-400">Belum ada reservasi.</td></tr> : null}
                                        {adminReservations.map(res => (
                                            <tr key={res.id_reservasi} className="border-b hover:bg-gray-50 transition">
                                                <td className="p-4 text-gray-500 font-mono text-sm">#{res.id_reservasi}</td>
                                                <td className="p-4 font-semibold text-gray-800">{res.user_nama}</td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {new Date(res.tanggal_penjemputan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">{res.waktu_penjemputan}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        res.status_penjemputan === 'Menunggu Konfirmasi' ? 'bg-yellow-100 text-yellow-700' : 
                                                        res.status_penjemputan === 'Dikonfirmasi' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {res.status_penjemputan}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleViewDetail(res.id_reservasi)}
                                                        className="text-primary hover:text-green-700 transition p-1"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye size={18}/>
                                                    </button>
                                                </td>
                                                <td className="p-4 text-center space-y-2">
                                                    {res.status_penjemputan === 'Menunggu Konfirmasi' && (
                                                        <button 
                                                            onClick={() => updateReservationStatus(res.id_reservasi, 'Dikonfirmasi')}
                                                            className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition w-full"
                                                        >
                                                            Setujui Jemput
                                                        </button>
                                                    )}
                                                    {res.status_penjemputan === 'Dikonfirmasi' && (
                                                        <button 
                                                            onClick={() => updateReservationStatus(res.id_reservasi, 'Selesai')}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition w-full flex items-center justify-center gap-1"
                                                        >
                                                            <CheckCircle size={14}/> Selesai (+Poin)
                                                        </button>
                                                    )}
                                                    {res.status_penjemputan === 'Selesai' && (
                                                        <span className="text-green-600 text-sm font-bold flex items-center justify-center gap-1">
                                                            <CheckCircle size={16}/> Selesai
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Detail Reservasi */}
                        {selectedReservation && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReservation(null)}>
                                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => setSelectedReservation(null)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X size={20}/>
                                    </button>
                                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                        <Truck className="text-primary w-5 h-5" />
                                        Detail Reservasi #{selectedReservation.id_reservasi}
                                    </h3>
                                    {detailLoading ? (
                                        <div className="text-center py-8 text-gray-400">Memuat detail...</div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                                <div>
                                                    <p className="text-xs text-gray-500">Pengguna</p>
                                                    <p className="font-semibold text-gray-800">{selectedReservation.user_nama}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <p className="text-sm text-gray-600">{selectedReservation.user_email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Tanggal</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {new Date(selectedReservation.tanggal_penjemputan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Waktu</p>
                                                    <p className="font-semibold text-gray-800">{selectedReservation.waktu_penjemputan}</p>
                                                </div>
                                                {selectedReservation.catatan && (
                                                    <div className="col-span-2">
                                                        <p className="text-xs text-gray-500">Catatan</p>
                                                        <p className="text-sm text-gray-600 italic">"{selectedReservation.catatan}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedReservation.items && selectedReservation.items.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-700 mb-2">Item Sampah</h4>
                                                    <div className="space-y-2">
                                                        {selectedReservation.items.map((item, i) => (
                                                            <div key={i} className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xl">{item.ikon || '🗑️'}</span>
                                                                    <span className="font-medium text-gray-700">{item.nama_kategori}</span>
                                                                </div>
                                                                <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-sm">
                                                                    {item.estimasi_berat} kg
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end pt-2">
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                                    selectedReservation.status_penjemputan === 'Menunggu Konfirmasi' ? 'bg-yellow-100 text-yellow-700' : 
                                                    selectedReservation.status_penjemputan === 'Dikonfirmasi' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {selectedReservation.status_penjemputan}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
