import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Lock, Save, Camera, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

/** Ambil pesan error terbaca dari axios error / Error biasa. */
function getApiError(err: unknown): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return detail || (err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.');
}

// ===== Schema Data Personal (FR-3.1) =====
const personalSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  jk: z.string().min(1, 'Jenis kelamin wajib dipilih'),
  nohp: z
    .string()
    .refine(
      (v) => v === '' || /^0[0-9]{8,12}$/.test(v.replace(/[\s-]/g, '')),
      'Format nomor HP tidak valid (mis. 081234567890)',
    ),
  alamat: z.string(),
});
type PersonalFormValues = z.infer<typeof personalSchema>;

// ===== Schema Ubah Password (FR-3.2) =====
const passwordSchema = z
  .object({
    password_lama: z.string().min(1, 'Password lama wajib diisi'),
    password_baru: z.string().min(8, 'Password baru minimal 8 karakter'),
    konfirmasi_password: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((v) => v.password_baru === v.konfirmasi_password, {
    message: 'Password baru dan konfirmasi tidak cocok',
    path: ['konfirmasi_password'],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

const inputClass =
  'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] transition-all';
const labelStyle = { fontFamily: "'Plus Jakarta Sans', sans-serif" } as const;

export default function SettingAkunPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'personal' | 'password'>('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ===== Form Data Personal =====
  const personalForm = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      nama: user?.nama || '',
      email: user?.email || '',
      // DB ENUM users.jk = ('Laki-laki','Perempuan') — jangan pakai 'L'/'P'
      jk: user?.jk || 'Laki-laki',
      nohp: user?.nohp || '',
      alamat: user?.alamat || '',
    },
  });

  const profileMutation = useMutation({
    mutationFn: (values: PersonalFormValues) => authService.updateProfile(values),
    onSuccess: (updatedProfile) => {
      // Sinkronkan auth store agar nama/alamat dsb. langsung ikut berubah di seluruh app
      setUser({ ...user, ...updatedProfile });
      toast.success('Data personal berhasil disimpan');
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  // ===== Form Ubah Password =====
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password_lama: '', password_baru: '', konfirmasi_password: '' },
  });

  const passwordMutation = useMutation({
    mutationFn: (values: PasswordFormValues) =>
      authService.changePassword(values.password_lama, values.password_baru),
    onSuccess: () => {
      toast.success('Password berhasil diubah. Gunakan password baru pada login berikutnya.');
      passwordForm.reset();
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  const submitPersonal = personalForm.handleSubmit((values) => profileMutation.mutate(values));
  const submitPassword = passwordForm.handleSubmit((values) => passwordMutation.mutate(values));

  const jkValue = personalForm.watch('jk');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EAF6E8] rounded-xl flex items-center justify-center">
          <User size={20} className="text-[#28A71A]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#303030]" style={labelStyle}>
            Setting Akun
          </h1>
          <p className="text-sm text-[#555]" style={labelStyle}>
            Kelola profil dan keamanan akun Anda
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F0F4F8] rounded-xl w-fit">
        {([
          { key: 'personal', label: 'Data Personal', icon: User },
          { key: 'password', label: 'Ubah Password', icon: Lock },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#28A71A] shadow-sm'
                : 'text-[#555] hover:text-[#303030]'
            }`}
            style={labelStyle}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Data Personal */}
      {activeTab === 'personal' ? (
        <form onSubmit={submitPersonal} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.06)]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#28A71A] flex items-center justify-center text-white text-xl font-semibold">
                {(personalForm.watch('nama') || 'U').charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                title="Upload foto profil (belum tersedia)"
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-[rgba(0,0,0,0.1)] rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow"
              >
                <Camera size={12} className="text-[#555]" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-[#303030]" style={labelStyle}>Foto Profil</p>
              <p className="text-xs text-[#555]" style={labelStyle}>Upload foto profil akan segera tersedia</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-[#303030] mb-1.5" style={labelStyle}>Nama Lengkap</label>
              <input id="nama" type="text" {...personalForm.register('nama')} className={inputClass} style={labelStyle} />
              {personalForm.formState.errors.nama && (
                <p className="mt-1 text-xs text-red-500">{personalForm.formState.errors.nama.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#303030] mb-1.5" style={labelStyle}>Email</label>
              <input id="email" type="email" {...personalForm.register('email')} className={inputClass} style={labelStyle} />
              {personalForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">{personalForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="nohp" className="block text-sm font-medium text-[#303030] mb-1.5" style={labelStyle}>No. HP</label>
              <input id="nohp" type="text" placeholder="081234567890" {...personalForm.register('nohp')} className={inputClass} style={labelStyle} />
              {personalForm.formState.errors.nohp && (
                <p className="mt-1 text-xs text-red-500">{personalForm.formState.errors.nohp.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="jk" className="block text-sm font-medium text-[#303030] mb-1.5" style={labelStyle}>Jenis Kelamin</label>
              <select id="jk" {...personalForm.register('jk')} className={`${inputClass} bg-white`} style={labelStyle}>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
                {/* Fallback data legacy (mis. 'L'/'P' dari seed lama) supaya tetap tampil */}
                {jkValue && jkValue !== 'Laki-laki' && jkValue !== 'Perempuan' && (
                  <option value={jkValue}>{jkValue}</option>
                )}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="alamat" className="block text-sm font-medium text-[#303030] mb-1.5" style={labelStyle}>Alamat</label>
              <textarea
                id="alamat"
                rows={3}
                {...personalForm.register('alamat')}
                className={`${inputClass} resize-none`}
                style={labelStyle}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="btn-primary-green gap-2 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {profileMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {profileMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      ) : (
        /* Tab Content: Ubah Password */
        <form onSubmit={submitPassword} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 space-y-5 max-w-lg">
          <div>
            <label htmlFor="password_lama" className="block text-sm font-medium text-[#303030] mb-1.5" style={labelStyle}>Password Lama</label>
            <div className="relative">
              <input
                id="password_lama"
                type={showPassword ? 'text' : 'password'}
                {...passwordForm.register('password_lama')}
                className={`${inputClass} pr-10`}
                style={labelStyle}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]" aria-label="Tampilkan password lama">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordForm.formState.errors.password_lama && (
              <p className="mt-1 text-xs text-red-500">{passwordForm.formState.errors.password_lama.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password_baru" className="block text-sm font-medium text-[#303030] mb-1.5" style={labelStyle}>Password Baru</label>
            <div className="relative">
              <input
                id="password_baru"
                type={showNewPassword ? 'text' : 'password'}
                {...passwordForm.register('password_baru')}
                className={`${inputClass} pr-10`}
                style={labelStyle}
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]" aria-label="Tampilkan password baru">
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordForm.formState.errors.password_baru && (
              <p className="mt-1 text-xs text-red-500">{passwordForm.formState.errors.password_baru.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="konfirmasi_password" className="block text-sm font-medium text-[#303030] mb-1.5" style={labelStyle}>Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                id="konfirmasi_password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...passwordForm.register('konfirmasi_password')}
                className={`${inputClass} pr-10`}
                style={labelStyle}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]" aria-label="Tampilkan konfirmasi password">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordForm.formState.errors.konfirmasi_password && (
              <p className="mt-1 text-xs text-red-500">{passwordForm.formState.errors.konfirmasi_password.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="btn-primary-green gap-2 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {passwordMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {passwordMutation.isPending ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
