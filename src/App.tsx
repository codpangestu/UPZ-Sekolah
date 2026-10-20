import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authService } from './services/authService';
import { useAuthStore } from './store/authStore';
import { inferRoleFromUser } from './types';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TentangPage from './pages/TentangPage';
import MasjidPage from './pages/MasjidPage';
import PublicationMenu from './pages/PublicationMenu';
import DonasiPage from './pages/DonasiPage';
import KontakPage from './pages/KontakPage';
import ToolsPage from './pages/ToolsPage';
import AjukanMasjidPage from './pages/AjukanMasjidPage';
import MasjidDetailPage from './pages/MasjidDetailPage';
import PengajuanMasjidApproval from './pages/dashboard/PengajuanMasjidApproval';
import DataMasjidBaznasPage from './pages/dashboard/DataMasjidBaznasPage';
import KelolaPenggunaPage from './pages/dashboard/KelolaPenggunaPage';
import BukuKasPenerimaanPage from './features/buku-kas/pages/BukuKasPenerimaanPage';
import BukuKasPengeluaranPage from './features/buku-kas-pengeluaran/pages/BukuKasPengeluaranPage';
import DataAnggotaPage from './features/data-anggota/pages/DataAnggotaPage';
import DataPengurusPage from './features/data-pengurus/pages/DataPengurusPage';
import ProfilMasjidPage from './features/profil-masjid/pages/ProfilMasjidPage';
import PublikasiDashboardPage from './features/menu-publikasi/pages/PublikasiPage';
import DashboardAdminMasjid from './pages/dashboard/DashboardAdminMasjid';
import DashboardAdminBaznas from './pages/dashboard/DashboardAdminBaznas';
import DashboardAdminDaerah from './pages/dashboard/DashboardAdminDaerah';
import DashboardAdminKab from './pages/dashboard/DashboardAdminKab';
import DashboardAdminKua from './pages/dashboard/DashboardAdminKua';
import SettingAkunPage from './pages/SettingAkunPage';
import DataKegiatanPage from './features/kegiatan-masjid/pages/DataKegiatanPage';
import BukuAsetPage from './features/buku-aset/pages/BukuAsetPage';
import FotoMasjidPage from './pages/FotoMasjidPage';
import FasilitasMasjidPage from './pages/FasilitasMasjidPage';
import LogoMasjidPage from './pages/LogoMasjidPage';
import StrukturMasjidPage from './pages/StrukturMasjidPage';
import MitraKerjasamaPage from './pages/MitraKerjasamaPage';
import QRISPage from './pages/QRISPage';
import KalkulatorPinjamanPage from './pages/KalkulatorPinjamanPage';
import SkoringPinjamanPage from './pages/SkoringPinjamanPage';
import MicrofinanceMenuPage from './features/microfinance/pages/MicrofinanceMenuPage';
import SejarahProfilPage from './features/microfinance/pages/SejarahProfilPage';
import SaldoPage from './features/microfinance/pages/SaldoPage';
import PilihanSkemaPinjamanPage from './features/microfinance/pages/PilihanSkemaPinjamanPage';
import PendampingPage from './features/microfinance/pages/PendampingPage';
import PesertaProgramPage from './features/microfinance/pages/PesertaProgramPage';
import MutasiTransaksiPage from './features/microfinance/pages/MutasiTransaksiPage';
import PetaSebaranPage from './features/microfinance/pages/PetaSebaranPage';
import OperasionalKasPage from './features/microfinance/pages/OperasionalKasPage';
import RiwayatPemutihanPage from './features/microfinance/pages/RiwayatPemutihanPage';

function App() {
  // Restore & validasi sesi dari localStorage saat aplikasi dimuat.
  // Jika ada token tersimpan: panggil GET /api/v1/me untuk memvalidasi token,
  // me-refresh data user & role (backend tidak mengirim role di login response).
  // Jika token invalid/expired (401): sesi dibersihkan (interceptor juga menangani).
  useEffect(() => {
    const { token, setLoading, setUser, setRole } = useAuthStore.getState();
    if (!token) return;

    let cancelled = false;
    setLoading(true);
    authService
      .getProfile()
      .then((profile) => {
        if (cancelled) return;
        setUser(profile);
        setRole(inferRoleFromUser(profile));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // 401 (token invalid/expired) sudah ditangani response interceptor
        // (logout + redirect ke /login). Error lain (mis. jaringan) dibiarkan
        // agar sesi tidak hilang saat backend sedang bermasalah.
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tentang" element={<TentangPage />} />
          <Route path="masjid" element={<MasjidPage />} />
          <Route path="masjid/:id" element={<MasjidDetailPage />} />
          <Route path="kajian" element={<PublicationMenu />} />
          <Route path="donasi" element={<DonasiPage />} />
          <Route path="kontak" element={<KontakPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="ajukan-masjid" element={<AjukanMasjidPage />} />
          <Route path="kalkulator-pinjaman" element={<KalkulatorPinjamanPage />} />
          <Route path="skoring-pinjaman" element={<SkoringPinjamanPage />} />
        </Route>

        {/* ========== AUTH ========== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ========== DASHBOARD ADMIN MASJID ========== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <DashboardAdminMasjid />
              </ProtectedRoute>
            }
          />
          {/* Placeholder routes for dashboard child pages */}
          <Route
            path="profil"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <div className="p-4 text-[#555]">Halaman Profil Masjid</div>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========== DASHBOARD ADMIN BAZNAS ========== */}
        <Route
          path="/dashboard-baznas"
          element={
            <ProtectedRoute allowedRoles={['admin-baznas']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['admin-baznas']}>
                <DashboardAdminBaznas />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========== DASHBOARD ADMIN DAERAH / KAB / KUA (anak Admin BAZNAS, scope wilayah) ========== */}
        <Route
          path="/dashboard-daerah"
          element={
            <ProtectedRoute allowedRoles={['admin-daerah']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAdminDaerah />} />
        </Route>

        <Route
          path="/dashboard-kab"
          element={
            <ProtectedRoute allowedRoles={['admin-kab']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAdminKab />} />
        </Route>

        <Route
          path="/dashboard-kua"
          element={
            <ProtectedRoute allowedRoles={['admin-kua']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAdminKua />} />
        </Route>

        {/* Additional dashboard sub-routes will be added as features are built */}
        <Route
          path="/data-masjid"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid', 'admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="profil"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <ProfilMasjidPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="daftar"
            element={
              <ProtectedRoute allowedRoles={['admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua']}>
                <DataMasjidBaznasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="foto"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <FotoMasjidPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="fasilitas"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <FasilitasMasjidPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="kegiatan"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <div className="p-4 text-[#555]">Kegiatan Masjid</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="logo"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <LogoMasjidPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/info-masjid"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid', 'admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="data-pengurus"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid', 'admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua']}>
                <DataPengurusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="data-anggota"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <DataAnggotaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="struktur"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <StrukturMasjidPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="mitra-kerjasama"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <MitraKerjasamaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="qris"
            element={
              <ProtectedRoute allowedRoles={['admin-masjid']}>
                <QRISPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/menu-publikasi"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<PublikasiDashboardPage />}
          />
          {/* Sidebar menunjuk ke /menu-publikasi/postingan (tab default) */}
          <Route
            path="postingan"
            element={<PublikasiDashboardPage />}
          />
        </Route>

        <Route
          path="/buku-kas"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="penerimaan"
            element={<BukuKasPenerimaanPage />}
          />
          <Route
            path="pengeluaran"
            element={<BukuKasPengeluaranPage />}
          />
        </Route>

        <Route
          path="/buku-aset"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<BukuAsetPage />}
          />
        </Route>

        <Route
          path="/kegiatan-masjid"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<DataKegiatanPage />}
          />
        </Route>

        <Route
          path="/setting-akun"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid', 'admin-baznas', 'admin-daerah', 'admin-kab', 'admin-kua']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<SettingAkunPage />}
          />
        </Route>

        <Route
          path="/pengajuan-masjid"
          element={
            <ProtectedRoute allowedRoles={['admin-baznas']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<PengajuanMasjidApproval />}
          />
        </Route>

        <Route
          path="/microfinance"
          element={
            <ProtectedRoute allowedRoles={['admin-masjid']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MicrofinanceMenuPage />} />
          <Route path="sejarah-profil" element={<SejarahProfilPage />} />
          <Route path="saldo" element={<SaldoPage />} />
          <Route path="pilihan-skema-pinjaman" element={<PilihanSkemaPinjamanPage />} />
          <Route path="pendamping" element={<PendampingPage />} />
          <Route path="peserta-program" element={<PesertaProgramPage />} />
          <Route path="mutasi-transaksi" element={<MutasiTransaksiPage />} />
          <Route path="peta-sebaran" element={<PetaSebaranPage />} />
          <Route path="operasional-kas" element={<OperasionalKasPage />} />
          <Route path="riwayat-pemutihan" element={<RiwayatPemutihanPage />} />
        </Route>

        <Route
          path="/kelola-pengguna"
          element={
            <ProtectedRoute allowedRoles={['admin-baznas']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<KelolaPenggunaPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
