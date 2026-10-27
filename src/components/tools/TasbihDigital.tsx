import { useCallback, useEffect, useState } from 'react';
import { Plus, Minus, RotateCcw, CircleDot, Target } from 'lucide-react';
import { useTasbihStore } from '../../store/toolsStore';

const DZIKIR_OPTIONS = [
  { label: 'Subhanallah', value: 33 },
  { label: 'Alhamdulillah', value: 33 },
  { label: 'Allahu Akbar', value: 33 },
  { label: 'Tahlil', value: 100 },
  { label: 'Kustom', value: 0 },
];

export default function TasbihDigital() {
  const { counter, increment, decrement, reset, target, setTarget } = useTasbihStore();
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [customTarget, setCustomTarget] = useState(target);

  // Update progress when counter changes
  useEffect(() => {
    const p = target > 0 ? Math.min(100, Math.round((counter / target) * 100)) : 0;
    setProgress(p);
  }, [counter, target]);

  // Handle milestone celebrations
  useEffect(() => {
    if (counter > 0 && (counter % 100 === 0 || counter === target)) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [counter, target]);

  const handleSetTarget = useCallback((newTarget: number) => {
    setTarget(newTarget);
    setCustomTarget(newTarget);
  }, [setTarget]);

  const targetProgress = target > 0 ? counter % target : 0;

  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-5 relative overflow-hidden">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-[#0284C7]/5 flex items-center justify-center z-10 animate-in fade-in">
          <div className="text-center">
            <span className="text-3xl">🎉</span>
            <p className="text-sm font-semibold text-[#0284C7] mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {counter % 100 === 0 ? `${counter}x!` : 'Target Tercapai!'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <CircleDot size={18} className="text-[#0284C7]" />
        <h3 className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Tasbih Digital
        </h3>
      </div>

      {/* Counter Display */}
      <div className="bg-gradient-to-br from-[#0369A1] to-[#0284C7] rounded-xl p-5 text-white text-center mb-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="text-5xl font-bold tabular-nums" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {counter.toLocaleString()}
          </div>
          <p className="text-xs text-white/70 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {target > 0 ? `${targetProgress}/${target} (${progress}%)` : 'Total hitungan'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {target > 0 && (
        <div className="w-full h-2 bg-[#F0F4F8] rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Counter Buttons */}
      <div className="flex items-center justify-center gap-4 mb-5">
        <button
          onClick={decrement}
          disabled={counter === 0}
          className="w-14 h-14 rounded-full border-2 border-[rgba(0,0,0,0.1)] flex items-center justify-center text-[#555] hover:border-[#0284C7] hover:text-[#0284C7] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Minus size={24} />
        </button>

        <button
          onClick={increment}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
        >
          <Plus size={32} />
        </button>

        <button
          onClick={reset}
          className="w-14 h-14 rounded-full border-2 border-[rgba(0,0,0,0.1)] flex items-center justify-center text-[#555] hover:border-red-400 hover:text-red-500 transition-all active:scale-95"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Target Selector */}
      <div className="border-t border-[rgba(0,0,0,0.1)] pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} className="text-[#555]" />
          <span className="text-xs font-medium text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Target Dzikir
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {DZIKIR_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                if (opt.value === 0) {
                  const input = prompt('Masukkan target kustom:', String(customTarget));
                  if (input) {
                    const num = parseInt(input);
                    if (num > 0) handleSetTarget(num);
                  }
                } else {
                  handleSetTarget(opt.value);
                }
              }}
              className={`text-[10px] py-1.5 px-1 rounded-lg font-medium transition-all ${
                target === opt.value
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-[#F0F4F8] text-[#555] hover:bg-[#E0F2FE] hover:text-[#0284C7]'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {opt.value === 0 ? 'Custom' : opt.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
