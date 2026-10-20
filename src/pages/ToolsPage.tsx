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
    { id: 'kiblat', label: 'Arah Kiblat', icon: MapPin, desc: 'Cari arah kiblat dari lokasi Anda dengan kompas interaktif', color: 'from-[#28A71A] to-[#6FC466]' },
    { id: 'jadwal', label: 'Jadwal Sholat', icon: Sun, desc: 'Lihat jadwal sholat harian untuk berbagai kota di Indonesia', color: 'from-[#E8A317] to-[#F5C842]' },
    { id: 'tasbih', label: 'Tasbih Digital', icon: CircleDot, desc: 'Hitung dzikir dan wirid dengan target yang bisa disesuaikan', color: 'from-[#166b0d] to-[#28A71A]' },
    { id: 'jam', label: 'Jam Digital', icon: Clock, desc: 'Jam digital dengan tampilan waktu Hijriyah dan Masehi', color: 'from-[#0E6E8C] to-[#4AAFD4]' },
    { id: 'todo', label: 'To-do List', icon: CheckSquare, desc: 'Catat dan kelola tugas ibadah dan kegiatan harian Anda', color: 'from-[#7C3AED] to-[#A78BFA]' },
    { id: 'scan', label: 'Scan QRIS', icon: Scan, desc: 'Scan kode QRIS untuk pembayaran dan donasi digital', color: 'from-[#DC2626] to-[#F87171]' },
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-white to-[#F0FCE8] pb-12 pt-20">
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#28A71A]/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-[#6FC466]/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-4 h-4 rounded-full bg-[#28A71A]/20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#6FC466]/20 animate-pulse" style={{ animationDelay: '1s' }} />

        {!activeTool ? (
          <>
            <div className="relative z-10 max-w-5xl mx-auto px-4">
              <div className="badge-green mx-auto mb-6 w-fit">
                <Wrench size={14} />
                <span>Tools</span>
              </div>
              <h1 className="text-center">
                Alat Bantu <span className="text-gradient-green">Interaktif</span>
              </h1>
              <p className="text-lg text-[#555] max-w-2xl mx-auto text-center">
                Kumpulan alat bantu interaktif untuk aktivitas ibadah dan keseharian Anda
              </p>

              {/* Tool Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 max-w-4xl mx-auto">
                {allTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className="group relative bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 text-left hover:shadow-lg hover:border-[#28A71A]/20 transition-all duration-300 text-center"
                    >
                      {/* Icon Circle */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-[#303030] group-hover:text-[#28A71A] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {tool.label}
                      </h3>
                      <p className="text-[11px] text-[#888] mt-1.5 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {tool.desc}
                      </p>
                      {/* Hover arrow */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                        <ChevronRight size={14} className="text-[#28A71A]" />
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
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#555] hover:text-[#28A71A] transition-colors mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ArrowLeft size={14} />
              Kembali ke Tools
            </button>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentTool?.color} flex items-center justify-center shadow-sm`}>
                {currentTool && <currentTool.icon size={22} className="text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {currentTool?.label}
                </h1>
                <p className="text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
                          ? 'bg-[#28A71A] text-white shadow-sm shadow-[#28A71A]/20'
                          : 'bg-white border border-[rgba(0,0,0,0.08)] text-[#555] hover:border-[#28A71A] hover:text-[#28A71A]'
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
