import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, AlertCircle, Building2, Search } from 'lucide-react';

const QRScannerPage = () => {
  const navigate = useNavigate();
  const [manualId, setManualId] = useState('');
  const [scanError, setScanError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: []
      },
      /* verbose= */ false
    );

    scannerRef.current = scanner;

    const onScanSuccess = (decodedText) => {
      scanner.clear().catch((err) => console.error(err));

      let employeeId = decodedText;
      if (decodedText.includes('/verify/')) {
        const parts = decodedText.split('/verify/');
        employeeId = parts[parts.length - 1];
      }

      if (employeeId) {
        navigate(`/verify/${employeeId.trim()}`);
      } else {
        setScanError('Invalid QR Code format.');
      }
    };

    const onScanError = () => {
      // Ignore normal continuous scanning errors
    };

    scanner.render(onScanSuccess, onScanError);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error('Failed to clear scanner', err));
      }
    };
  }, [navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualId.trim()) {
      navigate(`/verify/${manualId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl pointer-events-none opacity-60"></div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-none text-slate-900 tracking-tight">NexusCorp</h1>
              <span className="text-xs text-slate-500 font-semibold">Corporate Portal</span>
            </div>
          </div>
          <Link
            to="/login"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all"
          >
            Staff Login
          </Link>
        </div>

        {/* Scanner Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium p-6 md:p-8 space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-2xs">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">Scan ID Card QR Code</h2>
              <p className="text-sm text-slate-500">Hold the employee QR code in front of the camera</p>
            </div>
          </div>

          {/* Scanner Container */}
          <div className="overflow-hidden rounded-2xl bg-slate-50 border border-slate-200/80 min-h-[300px] flex flex-col justify-center shadow-inner relative">
            <div id="qr-reader" className="w-full"></div>
          </div>

          {scanError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center gap-2.5 font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Fallback Entry Form */}
          <div className="pt-5 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Camera not available? Enter Employee ID:</h3>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. EMP001"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="input-field uppercase font-mono font-bold tracking-wider flex-1"
              />
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 shrink-0 py-3 px-5 text-sm font-bold shadow-md shadow-indigo-600/10"
              >
                <Search className="w-4 h-4" />
                Verify Identity
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 font-medium">
          NexusCorp Corporate Identity Verification Suite. All scans are secured.
        </p>
      </div>
    </div>
  );
};

export default QRScannerPage;
