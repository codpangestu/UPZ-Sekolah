import { useState } from 'react';
import { Wrench, MapPin, Sun, CircleDot, Clock, CheckSquare, Scan, ArrowLeft, ChevronRight } from 'lucide-react';
import JamDigital from '../components/tools/JamDigital';
import TasbihDigital from '../components/tools/TasbihDigital';
import TodoList from '../components/tools/TodoList';
import JadwalSholat from '../components/tools/JadwalSholat';
import ScanQRIS from '../components/tools/ScanQRIS';
import ArahKiblat from '../components/tools/ArahKiblat';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const allTools = [
    { id: 'kiblat', label: 'Arah Kiblat', icon: MapPin, desc: 'Cari arah kiblat dari sekolah atau lokasi Anda dengan kompas interaktif', color: 'from-[#0284C7] to-[#38BDF8]' },
    { id: 'jadwal', label: 'Jadwal Sholat', icon: Sun, desc: 'Lihat jadwal waktu sholat dan imsakiyah untuk lingkungan sekolah di seluruh kota', color: 'from-[#0284C7] to-[#60A5FA]' },
    { id: 'tasbih', label: 'Tasbih Digital', icon: CircleDot, desc: 'Hitung dzikir, wirid, dan shalawat dengan counter digital praktis', color: 'from-[#0369A1] to-[#0284C7]' },
    { id: 'jam', label: 'Jam Digital', icon: Clock, desc: 'Jam digital madrasah dengan tampilan waktu Hijriyah dan Masehi akurat', color: 'from-[#0284C7] to-[#38BDF8]' },
    { id: 'todo', label: 'To-do List Ibadah', icon: CheckSquare, desc: 'Catat dan kelola agenda ibadah harian serta kegiatan UPZ Sekolah', color: 'from-[#6366F1] to-[#818CF8]' },
    { id: 'scan', label: 'Scan QRIS Donasi', icon: Scan, desc: 'Scan kode QRIS resmi untuk penyaluran infak dan zakat pendidikan digital', color: 'from-[#0EA5E9] to-[#38BDF8]' },
  ];

  const toolComponents: Record<string, React.ReactNode> = {
    kiblat: <ArahKiblat />,
    jadwal: <JadwalSholat />,
    tasbih: <TasbihDigital />,
    jam: <JamDigital />,
    todo: <TodoList />,
    scan: <ScanQRIS />,
  };

  const currentTool = allTools.find((t) => t.id === activeTool);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-white to-[#F0F9FF] pb-12 pt-20">
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#0284C7]/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-[#38BDF8]/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-4 h-4 rounded-full bg-[#0284C7]/20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#38BDF8]/20 animate-pulse" style={{ animationDelay: '1s' }} />

        {!activeTool ? (
          <>
            <div className="relative z-10 max-w-5xl mx-auto px-4">
              <div className="badge-blue mx-auto mb-6 w-fit flex items-center gap-2">
                <Wrench size={14} />
                <span>Fitur & Alat Bantu</span>
              </div>
              <h1 className="text-center text-slate-800">
                Alat Bantu <span className="text-gradient-blue">Interaktif Siswa & Guru</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center">
                Kumpulan alat bantu interaktif untuk ibadah harian, jadwal sholat, dzikir, dan kepedulian sekolah
              </p>

              {/* Tool Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 max-w-4xl mx-auto">
                {allTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className="group relative bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-lg hover:border-[#0284C7]/40 transition-all duration-300 text-center"
                    >
                      {/* Icon Circle */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#0284C7] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {tool.label}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {tool.desc}
                      </p>
                      {/* Hover arrow */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                        <ChevronRight size={14} className="text-[#0284C7]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* ===== ACTIVE TOOL HEADER ===== */
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <button
              onClick={() => setActiveTool(null)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0284C7] transition-colors mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ArrowLeft size={14} />
              Kembali ke Menu Tools
            </button>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentTool?.color} flex items-center justify-center shadow-sm`}>
                {currentTool && <currentTool.icon size={22} className="text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {currentTool?.label}
                </h1>
                <p className="text-sm text-slate-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {currentTool?.desc}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===== TOOL CONTENT ===== */}
      {activeTool && (
        <section className="page-section pt-10 pb-16">
          <div className="page-section-inner">
            <div className="max-w-4xl mx-auto" key={activeTool}>
              {/* Tool Navigation Mini Chips */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {allTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#0284C7] text-white shadow-sm shadow-[#0284C7]/20'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-[#0284C7] hover:text-[#0284C7]'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <Icon size={11} />
                      {tool.label}
                    </button>
                  );
                })}
              </div>

              {/* Active Tool Component */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {toolComponents[activeTool]}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

