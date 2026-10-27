import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Terima kasih! Pesan Anda telah dikirim.');
    setFormData({ nama: '', email: '', subjek: '', pesan: '' });
  };

  return (
    <div className="bg-[#FAFAFA]">
      {/* Hero */}
      <section className="hero-section">
        <div className="badge-green mx-auto mb-6 w-fit">
          <MessageCircle size={14} />
          <span>Kontak</span>
        </div>
        <h1>
          Hubungi <span className="text-gradient-green">Kami</span>
        </h1>
        <p className="text-lg text-[#555] max-w-2xl mx-auto">
          Punya pertanyaan atau masukan? Kami siap membantu Anda
        </p>
      </section>

      {/* Contact Section */}
      <section className="page-section pb-24">
        <div className="page-section-inner">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="section-title mb-6">
                Mari <span className="text-gradient-blue">Terhubung</span>
              </h2>
              <p className="text-base text-[#555] mb-10 leading-relaxed">
                Jangan ragu untuk menghubungi tim kami jika ada pertanyaan, saran, atau
                konsultasi terkait pendaftaran dan pengelolaan UPZ Sekolah BAZNAS.
              </p>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 text-sky-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kantor Pusat BAZNAS RI</h4>
                    <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Gedung BAZNAS RI<br />
                      Jl. Matraman Raya No. 134, Kebon Manggis<br />
                      Jakarta Timur, 13150
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 text-sky-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Layanan Call Center</h4>
                    <p className="text-sm text-slate-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      0811 8882 1818<br />
                      (021) 2289-7979
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 text-sky-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email Resmi</h4>
                    <p className="text-sm text-slate-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      upzsekolah@baznas.go.id<br />
                      layanan@baznas.go.id
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-[#0284C7]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#303030] mb-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Jam Operasional</h4>
                    <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Senin - Jumat: 08.00 - 17.00 WIB<br />
                      Sabtu: 08.00 - 14.00 WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-[#303030] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Kirim Pesan
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 transition-all text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 transition-all text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    placeholder="Masukkan email Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Subjek
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subjek}
                    onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 transition-all text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    placeholder="Subjek pesan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#303030] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Pesan
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 transition-all text-sm resize-none"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    placeholder="Tulis pesan Anda..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary-blue w-full justify-center text-base py-4 rounded-xl"
                >
                  <Send size={16} />
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
