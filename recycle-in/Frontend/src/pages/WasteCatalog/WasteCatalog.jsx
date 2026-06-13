import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Recycle, Info, Leaf, X, BookOpen, AlertTriangle, Lightbulb, DollarSign, CheckCircle, Hammer } from 'lucide-react';

// 🌟 DATA EDUKASI MENDALAM (20+ Ide & Langkah Pembuatan)
const educationDetails = {
  "Plastik": {
    icon: "🥤",
    color: "blue",
    impact: "Plastik membutuhkan 100-500 tahun untuk terurai di alam. Setiap tahun, 8 juta ton sampah plastik masuk ke lautan dan membunuh kehidupan laut. Dengan mendaur ulang, kita memutus siklus ini.",
    sortingGuide: [
      "Bilas sisa makanan/minuman di dalam plastik hingga bersih.",
      "Pisahkan tutup botol dari badan botol (jenis plastiknya berbeda).",
      "Lepas kertas label/kemasan pada botol jika memungkinkan.",
      "Jangan campur plastik berminyak berat (bekas mi instan) dengan plastik bersih."
    ],
    diyIdeas: [
      { 
        title: "Ecobrick (Bata Plastik)", 
        steps: ["Siapkan botol plastik bersih (min 600ml) dan tongkat bambu.", "Keringkan sampah plastik (kantong, cup, bungkus).", "Masukkan plastik ke botol, dorong dan padatkan menggunakan tongkat bambu.", "Pastikan plastik sangat padat hingga botol keras tidak bisa ditekan.", "Tutup rapat. Ecobrick siap dirangkai menjadi meja, bangku, atau dinding taman."]
      },
      { 
        title: "Tas Anyaman Plastik (Plarn)", 
        steps: ["Lipat kantong plastik memanjang, potong menjadi irisan lingkaran.", "Sambungkan irisan lingkaran menjadi benang plastik panjang (Plarn).", "Gulung benang plastik menjadi bola benang.", "Gunakan hakken/crochet ukuran besar untuk merajut tas, topi, atau tempat tisu.", "Anyam hingga terbentuk pola dan bentuk tas yang diinginkan."]
      },
      { 
        title: "Pot Tanam Gantung Botol", 
        steps: ["Potong botol plastik menjadi dua bagian (bawah sebagai pot, atas sebagai corong).", "Beri lubang kecil pada tutup botol untuk saluran air.", "Masukkan bagian atas botol terbalik ke dalam bagian bawah.", "Ikat dengan tali rafia atau tali sepatu.", "Isi dengan tanah dan tanaman, gantung di teras."]
      },
      { 
        title: "Lampu Hias Galon/Akuarium Mini", 
        steps: ["Cuci galon air mineral hingga bersih dan kering.", "Masukkan LED strip light warna-warni ke dalam galon.", "Buat lubang kecil di tutup galon untuk mengeluarkan kabel LED.", "Jika ingin akuarium, isi air, tanaman air, dan ikan kecil terlebih dahulu.", "Nyalakan LED di malam hari untuk efek estetik ruangan."]
      },
      { 
        title: "Penyimpan Tali/Kabel dari Cup Bekas", 
        steps: ["Cuci cup plastik bekas minuman hingga bersih.", "Lubangi bagian bawah cup menggunakan cutter kecil.", "Masukkan ujung tali/kabel ke dalam lubang.", "Gulung sisa tali/kabel ke luar cup agar tidak kusut.", "Tumpuk beberapa cup menggunakan paku/papan kayu sebagai organizer dinding."]
      }
    ],
    economicValue: "Plastik PET (botol) di bank sampah Rp 2.000 - Rp 4.000/kg. Tas Plarn bisa dijual Rp 50.000 - Rp 150.000. Ecobrick sangat dicari komunitas hijau untuk proyek furnitur."
  },
  "Kertas": {
    icon: "📦",
    color: "yellow",
    impact: "Memproduksi 1 ton kertas baru membutuhkan 17 pohon dewasa dan 26.500 liter air. Mendaur ulang kertas mengurangi 60% polusi air dan menghemat pohon yang menjadi paru-paru dunia.",
    sortingGuide: [
      "Pisahkan kertas putih (HVS) dengan kertas campuran (koran/kardus).",
      "Pastikan kertas tidak basah, berminyak (bekas pizza), atau terkena air kencing.",
      "Lepaskan staples, klip kertas, dan lakban/lem dari kertas.",
      "Ratakan (flatten) kardus agar volume penyimpanan efisien."
    ],
    diyIdeas: [
      { 
        title: "Kertas Daur Ulang (Handmade Paper)", 
        steps: ["Rendam kertas koran/HVS bekas dalam air selama 24 jam.", "Blender kertas basah hingga menjadi bubur kertas (pulp).", "Siapkan cetakan bingkai kayu dengan kasa/saring halus.", "Celupkan cetakan ke bak berisi pulp, angkat secara merata.", "Jemur di bawah matahari. Setelah kering, lepaskan kertas baru dari cetakan."]
      },
      { 
        title: "Paper Mache (Patung/Topeng 3D)", 
        steps: ["Buat lem kertas: campur tepung terigu dengan air panas, aduk hingga mengental.", "Sobol-sobol kertas koran menjadi potongan kecil.", "Siapkan balon atau kawat sebagai kerangka patung.", "Tempelkan sobekan kertas ke kerangka menggunakan lem tepung berlapis-lapis.", "Keringkan sempurna (1-2 hari), lalu cat dengan cat akrilik."]
      },
      { 
        title: "Bunga Kertas Kreasi", 
        steps: ["Gambar pola kelopak bunga pada kertas bekas (majalah/kardus tipis).", "Gunting kelopak sesuai pola (buat ukuran besar dan kecil).", "Bentuk kelopak dengan diguling-gulingkan di pensil agar melengkung.", "Lilitkan kelopak satu per satu pada kawat/batang bambu, rekatkan dengan lem tembak.", "Bungkus batang dengan pita florist hijau, rapikan bunga."]
      },
      { 
        title: "Tempat Pensil Kardus Modular", 
        steps: ["Potong gulungan kardus tisu (toilet roll) setinggi 10 cm.", "Potong kardus datar sebagai alas (lingkaran) untuk menutup bagian bawah gulungan.", "Rekatkan alas ke gulungan kardus menggunakan lem tembak.", "Susun dan rekatkan beberapa gulungan kardus secara berdampingan.", "Hias permukaan kardus dengan cat, kertas kado bekas, atau tali."]
      },
      { 
        title: "Buku Catatan Sisi Satu (One-Side Used)", 
        steps: ["Kumpulkan kertas HVS bekas cetak yang masih ada sisi kosong.", "Potong kertas menjadi ukuran sama (misal: A5).", "Kumpulkan sisi kosong menghadap ke atas.", "Jilid kertas menggunakan staples di bagian tengah atau karet gelang.", "Buat sampul dari kardus bekas dan lipat menjadi buku catatan baru."]
      }
    ],
    economicValue: "Kardus di bank sampah Rp 1.500 - Rp 2.500/kg. Kertas daur ulang handmade (untuk undangan/wedding) dijual Rp 5.000 - Rp 15.000/lembar. Bunga kertas bisa dijual Rp 5.000 - Rp 25.000/tangkai."
  },
  "Logam": {
    icon: "🥫",
    color: "gray",
    impact: "Menambang bauksit untuk aluminium menghasilkan limbah beracun. Mendaur ulang 1 kaleng aluminium menghemat energi yang cukup untuk menyalakan TV selama 3 jam! Logam bisa didaur ulang tanpa batas tanpa kehilangan kualitas.",
    sortingGuide: [
      "Bilas kaleng minuman/makanan hingga tidak ada sisa makanan agar tidak berkarat.",
      "Pisahkan Aluminium (ringan, kaleng soda) dengan Besi/Baja (berat, kaleng susu).",
      "Krem/tumpulkan ujung kaleng yang terbuka untuk menghindari luka.",
      "Pijak/tekan kaleng aluminium agar volume berkurang saat disetor."
    ],
    diyIdeas: [
      { 
        title: "Lilin Aromaterapi Kaleng", 
        steps: ["Cuci dan keringkan kaleng susu/minuman bersih.", "Beli lilin parafin/soy wax, lelehkan menggunakan mangkok di atas air panas.", "Tambahkan essential oil (lavender/peppermint) dan pewarna ke lilin cair.", "Letakkan sumbu lilin di tengah kaleng, tuang lilin cair perlahan.", "Diamkan hingga mengeras sempurna. Lilin siap menyala dan mengharumkan ruangan."]
      },
      { 
        title: "Pot Bunga Minimalis Cat Semprot", 
        steps: ["Bersihkan kaleng dan keringkan.", "Lindungi area kerja, semprot kaleng dengan cat semutr warna pastil/basic.", "Gunakan teknik masking tape untuk membuat pola garis-garis.", "Semprot warna kedua di atas masking tape, tunggu kering.", "Lepas masking tape, lubangi bagian bawah kaleng untuk saluran air, isi tanaman."]
      },
      { 
        title: "Lampu Gantung Kaleng Berlubang", 
        steps: ["Gambar pola bintang/geomteri di permukaan kaleng.", "Paku lubang-lubang mengikuti pola menggunakan paku dan palu.", "Cat kaleng dengan warna gelap (hitam/emas).", "Masukkan lampu bohlam dengan fitting kabel di dalamnya.", "Gantung di teras, nyalakan di malam hari untuk efek cahaya indah menembus lubang."]
      },
      { 
        title: "Asbak / Penyimpan Barang Kecil", 
        steps: ["Ratakan bagian atas kaleng yang penyok menggunakan palu karet.", "Amplas permukaan kaleng agar cat menempel baik.", "Cat dengan warna silver/krom agar terlihat industrial.", "Tambahkan kain felt di bagian bawah agar tidak menggores meja.", "Gunakan untuk menyimpan koin, paperclip, atau sebagai asbak."]
      },
      { 
        title: "Papan Tulis Magnetik (dari Baja Bekas)", 
        steps: ["Cari lempengan baja tipis atau seng bekas yang rata.", "Potong sesuai ukuran yang diinginkan (hati-hati tepinya yang tajam).", "Amplas dan cat dengan cat papan tulis (chalkboard/magnetic paint).", "Bingkai dengan kayu bekas, rekatkan menggunakan lem power.", "Tempelkan di dinding, gunakan magnet tempel untuk menulis catatan."]
      }
    ],
    economicValue: "Aluminium bekas harga premium (Rp 5.000 - Rp 15.000/kg). Lilin aromaterapi kaleng laris di e-commerce seharga Rp 35.000 - Rp 100.000. Lampu gantung kaleng unik dihargai Rp 150.000+."
  },
  "Organik": {
    icon: "🍂",
    color: "green",
    impact: "Sampah organik di TPA menghasilkan gas metana yang pemanasan globalnya 25x lebih kuat dari CO2. Padahal 100% sampah organik bisa dikembalikan ke alam menjadi pupuk dan produk berguna lainnya.",
    sortingGuide: [
      "Pisahkan sampah dapur (sisa sayur, buah) dengan sampah kebun (daun, ranting).",
      "JANGAN masukkan daging mentah, tulang, atau minyak goreng ke kompos rumahan.",
      "Simpan sisa sayur/buah dalam wadah kedap udara (pasti tersedia di aplikasi kita nanti) agar tidak mengundang lalat.",
      "Potong batang/bonggol besar menjadi ukuran kecil agar proses penguraian lebih cepat."
    ],
    diyIdeas: [
      { 
        title: "Kompos Takakura (Tanpa Bau)", 
        steps: ["Siapkan sekam padi/serbuk gergaji dan sampah organik potong kecil.", "Campurkan 1 bagian sampah dapur, 1 bagian sekam, aduk rata.", "Masukkan ke dalam ember/jurigen bertutup.", "Tutup rapat, aduk setiap 2 hari sekali untuk sirkulasi udara.", "Dalam 14-21 hari, sampah berubah menjadi pupuk kompos hitam gembur."]
      },
      { 
        title: "Eco-Enzyme (Pembersih Multi-Fungsi)", 
        steps: ["Siapkan wadah plastik bertutup (jangan kaca).", "Campurkan 1 bagian gula merah, 3 bagian kulit buah (jeruk/nanas), 10 bagian air.", "Masukkan semua ke wadah, aduk hingga gula larut.", "Tutup rapat, simpan di tempat sejuk. Buka tutup sebentar tiap hari selama 1 bulan pertama untuk melepas gas.", "Fermentasi selama 3 bulan. Saring cairan, dan Eco-Enzyme siap digunakan sebagai pembersih lantai/deterjen."]
      },
      { 
        title: "Pupuk Organik Cair (Bokashi)", 
        steps: ["Kumpulkan sampah organik dapur.", "Semprotkan sedikit EM4 (Effective Microorganism) yang diencerkan.", "Masukkan ke dalam plastik/ember kedap udara, padatkan.", "Tutup sangat rapat (kondisi anaerob/tanpa oksigen).", "Simpan 1-2 minggu. Cairan yang dihasilkan encer dan bisa langsung disiram ke tanaman sebagai pupuk."]
      },
      { 
        title: "Kerajinan Biji/Buah Kering", 
        steps: ["Kumpulkan biji-bijian besar (jengkol, kelapa, kemiri) atau akar rumput.", "Keringkan di bawah matahari hingga sangat kering.", "Amplas permukaan biji agar halus dan cat menyerap.", "Cat dengan cat akrilik/semir sepatu sesuai kreativitas.", "Rangkai biji-bijian dengan tali benang/jarum menjadi kalung, gelang, atau gantungan kunci."]
      },
      { 
        title: "Cat Alami dari Bunga/Buah", 
        steps: ["Kumpulkan bunga layu atau kulit buah berwarna (kunyit, bunga kembang sepatu).", "Rebus bunga/kulit buah dengan sedikit air hingga air berwarna.", "Saring air rebusan tersebut menggunakan kain/saringan halus.", "Campurkan air warna tersebut dengan sedikit tepung kanji/tapioka yang sudah dimasak (sebagai pengental/perekat).", "Gunakan cat alami ini untuk mewarnai kertas daur ulang atau lukisan anak."]
      }
    ],
    economicValue: "Pupuk kompos dijual Rp 15.000 - Rp 25.000/5kg. Eco-Enzyme botol 1L dijual Rp 25.000. Kerajinan biji-bijian sangat diminati wisatawan di Bali/Jogja seharga Rp 20.000 - Rp 100.000/set."
  }
};

const WasteCatalog = () => {
  const navigate = useNavigate();
  const { categories, fetchCategories } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.deskripsi && cat.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-800' },
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-800' },
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Katalog & Edukasi Sampah</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Banner Edukasi */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Leaf size={40} className="text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Kenapa Harus Memilah Sampah?</h2>
              <p className="text-green-50 text-sm md:text-base leading-relaxed">
                Dengan memilah sampah di rumah, Anda membantu mengurangi volume sampah di TPA hingga 60%. Sampah bukanlah akhir, melainkan awal dari kreativitas dan peluang ekonomi. Klik kategori di bawah untuk belajar mengolahnya!
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Cari kategori sampah (misal: Plastik, Kertas)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid Katalog */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><Info size={48} className="mx-auto mb-4" /><p>Kategori tidak ditemukan.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map(cat => {
              const detail = educationDetails[cat.nama_kategori] || {};
              const colors = getColorClasses(detail.color);
              
              return (
                <motion.div 
                  key={cat.id_kategori} 
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCategory({ ...cat, detail, colors })}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300 group cursor-pointer flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`text-4xl ${colors.bg} w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform`}>
                      {cat.ikon || <Recycle className="text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{cat.nama_kategori}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>Bisa Daur Ulang</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {cat.deskripsi || 'Pelajari cara memilah dan mengubah sampah ini menjadi barang bernilai.'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-green-600 text-sm font-semibold group-hover:text-green-700">
                    <Hammer size={14} className="mr-1" /> Lihat 5 Ide Kerajinan & Daur Ulang
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============ MODAL EDUKASI DETAIL (SUPER LENGKAP) ============ */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className={`sticky top-0 z-10 ${selectedCategory.colors.bg} p-6 border-b ${selectedCategory.colors.border} flex justify-between items-center`}>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{selectedCategory.ikon}</span>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Edukasi: {selectedCategory.nama_kategori}</h2>
                    <p className={`text-sm font-semibold ${selectedCategory.colors.text}`}>Panduan lengkap, ide kreatif, & peluang usaha</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCategory(null)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1.5 shadow-sm hover:shadow-md transition">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Dampak Lingkungan */}
                <div className="flex gap-4 bg-red-50 border border-red-100 p-5 rounded-xl">
                  <AlertTriangle className="text-red-500 w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-800 mb-1">🚨 Dampak Lingkungan</h3>
                    <p className="text-sm text-red-700 leading-relaxed">{selectedCategory.detail.impact}</p>
                  </div>
                </div>

                {/* Panduan Pemilahan */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><CheckCircle className="text-green-600 w-5 h-5" /> Panduan Pemilahan yang Benar</h3>
                  <div className="space-y-3">
                    {selectedCategory.detail.sortingGuide?.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                        <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ide Kerajinan & Daur Ulang (20 IDE) */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2"><Lightbulb className="text-yellow-500 w-5 h-5" /> Ide Daur Ulang & Kerajinan (DIY)</h3>
                  <p className="text-xs text-gray-500 mb-4">Kreativitas tidak ada batasnya. Berikut langkah-langkah pembuatan kerajinan dari sampah {selectedCategory.nama_kategori}:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCategory.detail.diyIdeas?.map((diy, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col">
                        <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1">
                          <Hammer size={14} className="text-primary" /> {diy.title}
                        </h4>
                        <ul className="text-xs text-gray-600 leading-relaxed space-y-1.5 list-none pl-0 flex-1">
                          {diy.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-1.5">
                              <span className="font-bold text-primary">{idx+1}.</span> 
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Potensi Ekonomi */}
                <div className="flex gap-4 bg-green-50 border border-green-100 p-5 rounded-xl">
                  <DollarSign className="text-green-600 w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-800 mb-1">💰 Potensi Ekonomi</h3>
                    <p className="text-sm text-green-700 leading-relaxed">{selectedCategory.detail.economicValue}</p>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-gray-100">
                  <button onClick={() => setSelectedCategory(null)} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 active:scale-95">
                    Ayo Mulai Berkreasi! 🚀
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WasteCatalog;