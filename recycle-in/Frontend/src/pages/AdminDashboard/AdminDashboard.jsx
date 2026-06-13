import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Users, Truck, Leaf, LogOut, UserCircle, LayoutDashboard, CheckCircle, Clock, Key, ToggleLeft, ToggleRight, Eye, X, Gift, AlertCircle, Sparkles } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { 
        currentUser, logout, 
        adminStats, adminUsers, adminReservations,
        fetchAdminStats, fetchAdminUsers, fetchAdminReservations, 
        updateReservationStatus, adminResetPassword, adminToggleUserStatus, fetchReservationDetail,
        adminClaims, fetchAdminClaims, approveClaim // PERBAIKAN: Gunakan fungsi & state Admin
    } = useApp();
    
    const [activeTab, setActiveTab] = useState('stats');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            fetchAdminStats();
            fetchAdminUsers();
            fetchAdminReservations();
            fetchAdminClaims(); // PERBAIKAN: Panggil fetch Admin
        }
    }, [currentUser]);

    if (!currentUser) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Silakan login terlebih dahulu.</div>;
    }

    if (currentUser.role !== 'admin') {
        navigate('/dashboard', { replace: true });
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    const handleViewDetail = async (id) => {
        setDetailLoading(true);
        const detail = await fetchReservationDetail(id);
        if (detail) setSelectedReservation(detail);
        setDetailLoading(false);
    };

    // PERBAIKAN: Hitung klaim yang statusnya "Diproses Admin" (menunggu persetujuan admin)
    const pendingClaims = adminClaims.filter(c => c.status === 'Diproses Admin').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Navbar */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white p-4 shadow-lg flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-2 animate-[fadeIn_0.5s_ease-in-out]">
                    <Sparkles className="text-yellow-300" /> Recycle-In Admin Panel
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm hidden md:block opacity-90">Halo, {currentUser.name}</span>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500/80 backdrop-blur-sm px-5 py-2 rounded-full text-sm hover:bg-red-600 flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-md"
                    >
                        <LogOut size={16}/> Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto p-6">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <button onClick={() => setActiveTab('stats')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'stats' ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <LayoutDashboard size={18}/> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'users' ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Users size={18}/> User
                    </button>
                    <button onClick={() => setActiveTab('reservations')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'reservations' ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Truck size={18}/> Jemput
                    </button>
                    <button onClick={() => setActiveTab('claims')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium relative ${activeTab === 'claims' ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Gift size={18}/> Klaim
                        {pendingClaims > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                                {pendingClaims}
                            </span>
                        )}
                    </button>
                </div>

                {/* ============ TAB STATS ============ */}
                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-[fadeIn_0.5s]">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total User</p>
                                    <h3 className="text-4xl font-extrabold mt-1">{adminStats.totalUsers || 0}</h3>
                                </div>
                                <Users className="text-white/30 w-16 h-16" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium">Total Reservasi</p>
                                    <h3 className="text-4xl font-extrabold mt-1">{adminStats.totalReservasi || 0}</h3>
                                </div>
                                <Truck className="text-white/30 w-16 h-16" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-amber-100 text-sm font-medium">Mitra Aktif</p>
                                    <h3 className="text-4xl font-extrabold mt-1">{adminStats.totalMitra || 0}</h3>
                                </div>
                                <UserCircle className="text-white/30 w-16 h-16" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-400 to-indigo-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Klaim Menunggu</p>
                                    <h3 className="text-4xl font-extrabold mt-1">{pendingClaims}</h3>
                                </div>
                                <Gift className="text-white/30 w-16 h-16" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ TAB KELOLA USER ============ */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s]">
                        <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-gray-700 flex items-center gap-2"><Users size={18}/> Data Pengguna</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Nama</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Poin</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminUsers.length === 0 ? <tr><td colSpan="7" className="p-8 text-center text-gray-400">Memuat data...</td></tr> : null}
                                    {adminUsers.map(user => (
                                        <tr key={user.id_user} className="border-b hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 text-gray-400 font-mono text-sm">#{user.id_user}</td>
                                            <td className="p-4 font-semibold text-gray-800">{user.nama}</td>
                                            <td className="p-4 text-gray-500 text-sm">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    user.role === 'admin' ? 'bg-red-50 text-red-600' : 
                                                    user.role === 'mitra' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-yellow-500 font-bold">{Number(user.poin).toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => { if (window.confirm(`Reset password user "${user.nama}"?`)) adminResetPassword(user.id_user); }} className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-200 transition flex items-center gap-1"><Key size={12}/> Reset</button>
                                                    <button onClick={() => { if (window.confirm(`Ubah status user "${user.nama}"?`)) adminToggleUserStatus(user.id_user); }} className={`${user.is_active ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1`}>
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
                    <div className="space-y-6 animate-[fadeIn_0.5s]">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                                <h2 className="font-bold text-gray-700 flex items-center gap-2"><Truck size={18}/> Penjemputan Sampah</h2>
                                <button onClick={fetchAdminReservations} className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1"><Clock size={14}/> Refresh</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b text-gray-500 text-xs uppercase tracking-wider">
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Pengguna</th>
                                            <th className="p-4">Tanggal</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-center">Detail</th>
                                            <th className="p-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminReservations.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-gray-400">Tidak ada reservasi.</td></tr> : null}
                                        {adminReservations.map(res => (
                                            <tr key={res.id_reservasi} className="border-b hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 text-gray-400 font-mono text-sm">#{res.id_reservasi}</td>
                                                <td className="p-4 font-semibold text-gray-800">{res.user_nama}</td>
                                                <td className="p-4 text-sm text-gray-500">{new Date(res.tanggal_penjemputan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        res.status_penjemputan === 'Menunggu Konfirmasi' ? 'bg-yellow-50 text-yellow-600' : 
                                                        res.status_penjemputan === 'Dikonfirmasi' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                                    }`}>
                                                        {res.status_penjemputan}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => handleViewDetail(res.id_reservasi)} className="text-emerald-500 hover:text-emerald-700 transition p-1"><Eye size={18}/></button>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {res.status_penjemputan === 'Menunggu Konfirmasi' && (
                                                        <button onClick={() => updateReservationStatus(res.id_reservasi, 'Dikonfirmasi')} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition w-full">Setujui</button>
                                                    )}
                                                    {res.status_penjemputan === 'Dikonfirmasi' && (
                                                        <button onClick={() => updateReservationStatus(res.id_reservasi, 'Selesai')} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition w-full flex items-center justify-center gap-1"><CheckCircle size={14}/> Selesai</button>
                                                    )}
                                                    {res.status_penjemputan === 'Selesai' && (
                                                        <span className="text-green-500 text-sm font-bold flex items-center justify-center gap-1"><CheckCircle size={16}/> Selesai</span>
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
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s]" onClick={() => setSelectedReservation(null)}>
                                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setSelectedReservation(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"><X size={20}/></button>
                                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2"><Truck className="text-emerald-500 w-5 h-5" /> Detail Reservasi #{selectedReservation.id_reservasi}</h3>
                                    {detailLoading ? (
                                        <div className="text-center py-8 text-gray-400">Memuat...</div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                                <div><p className="text-xs text-gray-500">Pengguna</p><p className="font-semibold">{selectedReservation.user_nama}</p></div>
                                                <div><p className="text-xs text-gray-500">Email</p><p className="text-sm">{selectedReservation.user_email}</p></div>
                                                <div><p className="text-xs text-gray-500">Tanggal</p><p className="font-semibold">{new Date(selectedReservation.tanggal_penjemputan).toLocaleDateString('id-ID')}</p></div>
                                                <div><p className="text-xs text-gray-500">Catatan</p><p className="text-sm italic">{selectedReservation.catatan || '-'}</p></div>
                                            </div>
                                            {selectedReservation.items && selectedReservation.items.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-700 mb-2">Item Sampah</h4>
                                                    <div className="space-y-2">
                                                        {selectedReservation.items.map((item, i) => (
                                                            <div key={i} className="flex justify-between bg-white border p-3 rounded-xl">
                                                                <span className="font-medium">{item.nama_kategori}</span>
                                                                <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg text-sm">{item.estimasi_berat} kg</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============ TAB KLAIM HADIAH ============ */}
                {activeTab === 'claims' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-[fadeIn_0.5s]">
                        <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-gray-700 flex items-center gap-2"><Gift size={18}/> Permintaan Klaim Hadiah</h2>
                            <button onClick={fetchAdminClaims} className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1"><Clock size={14}/> Refresh</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Pengguna</th>
                                        <th className="p-4">Hadiah</th>
                                        <th className="p-4">Rarity</th>
                                        <th className="p-4">Tanggal</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Aksi Admin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminClaims.length === 0 ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-gray-400">Belum ada riwayat klaim.</td></tr>
                                    ) : null}
                                    {adminClaims.map(claim => (
                                        <tr key={claim.id_claim} className="border-b hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 text-gray-400 font-mono text-sm">#{claim.id_claim}</td>
                                            <td className="p-4 font-semibold text-gray-800">{claim.user_nama || 'User'}</td>
                                            <td className="p-4 text-gray-700 font-medium">{claim.reward_name || 'Hadiah'}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    claim.rarity === 'Legendaris' ? 'bg-yellow-50 text-yellow-600' :
                                                    claim.rarity === 'Epik' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {claim.rarity || 'Langka'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {new Date(claim.tanggal_klaim).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                                                    claim.status === 'Diproses Admin' ? 'bg-orange-50 text-orange-600' : 
                                                    claim.status === 'Selesai' ? 'bg-green-50 text-green-600' :
                                                    'bg-gray-50 text-gray-600'
                                                }`}>
                                                    {claim.status === 'Diproses Admin' && <AlertCircle size={12}/>}
                                                    {claim.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {claim.status === 'Diproses Admin' ? (
                                                    <button 
                                                        onClick={async () => {
                                                            const result = await approveClaim(claim.id_claim);
                                                            if(result.success) alert(result.msg);
                                                        }}
                                                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 mx-auto shadow-sm"
                                                    >
                                                        <CheckCircle size={14}/> Proses & Berikan
                                                    </button>
                                                ) : claim.status === 'Selesai' ? (
                                                    <span className="text-green-500 text-sm font-bold flex items-center justify-center gap-1">
                                                        <CheckCircle size={16}/> Sudah Diberikan
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">Menunggu User Klaim</span>
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