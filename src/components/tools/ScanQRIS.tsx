import { useState, useRef, useEffect, useCallback } from 'react';
import { Scan, Camera, CheckCircle2, ExternalLink, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const SCANNER_ID = 'qris-scanner';

export default function ScanQRIS() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Initialize scanner lazily - only when user clicks start
  const getScanner = useCallback(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(SCANNER_ID);
    }
    return scannerRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = useCallback(async () => {
    setError(null);
    setResult(null);
    setScanning(true);

    // Wait for DOM to render the scanner element before starting
    await new Promise(resolve => requestAnimationFrame(resolve));

    const scanner = getScanner();
    if (!scanner) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    try {
      await scanner.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          setResult(decodedText);
          stopScanning();
        },
        () => {}
      );
    } catch (err: any) {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
      setScanning(false);
    }
  }, [getScanner]);

  const stopScanning = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
    }
    setScanning(false);
  }, []);

  const resetScan = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2">
          <Scan size={18} className="text-[#28A71A]" />
          <h3 className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Scan QRIS
          </h3>
        </div>
      </div>

      <div className="p-5">
        {scanning ? (
          <div className="space-y-4">
            {/* Scanner Container */}
            <div
              id={SCANNER_ID}
              className="rounded-xl overflow-hidden bg-black aspect-[4/3] relative"
            />

            <button
              onClick={stopScanning}
              className="w-full py-2.5 border border-[rgba(0,0,0,0.1)] rounded-lg text-sm text-[#555] hover:bg-[#F0F4F8] transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <X size={16} />
              Hentikan Scan
            </button>
          </div>
        ) : result ? (
          /* Result Display */
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#EAF6E8] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-[#28A71A]" />
            </div>
            <p className="text-sm font-semibold text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              QRIS Terdeteksi!
            </p>
            <div className="bg-[#FAFAFA] border border-[rgba(0,0,0,0.1)] rounded-lg p-3 mb-4 text-left">
              <p className="text-xs text-[#555] break-all font-mono" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {result}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              {result.startsWith('http') && (
                <button
                  onClick={() => window.open(result, '_blank')}
                  className="py-2.5 px-5 bg-[#28A71A] text-white rounded-lg text-sm font-medium hover:bg-[#1C7712] transition-colors flex items-center gap-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <ExternalLink size={14} />
                  Buka Link
                </button>
              )}
              <button
                onClick={resetScan}
                className="py-2.5 px-5 border border-[rgba(0,0,0,0.1)] rounded-lg text-sm text-[#555] hover:bg-[#F0F4F8] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Scan Lagi
              </button>
            </div>
          </div>
        ) : (
          /* Initial State */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#EAF6E8] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scan size={28} className="text-[#28A71A]" />
            </div>
            <p className="text-sm font-semibold text-[#303030] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Scan QRIS Pembayaran
            </p>
            <p className="text-xs text-[#555] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Arahkan kamera ke kode QRIS untuk melakukan pembayaran
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={startScanning}
              className="py-2.5 px-6 bg-[#28A71A] text-white rounded-lg text-sm font-medium hover:bg-[#1C7712] transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#28A71A]/25"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Camera size={16} />
              Mulai Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
