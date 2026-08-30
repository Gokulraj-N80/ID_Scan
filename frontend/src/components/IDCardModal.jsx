import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Building2, X, Printer, Download, ShieldCheck } from 'lucide-react';

const IDCardModal = ({ employee, onClose }) => {
  const cardRef = useRef(null);

  if (!employee) return null;

  const verificationUrl = `${window.location.origin}/verify/${employee.employeeId}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ID Card - ${employee.name} (${employee.employeeId})</title>
          <style>
            body {
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f8fafc;
            }
            .card {
              width: 320px;
              height: 500px;
              background: #ffffff;
              color: #0f172a;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              border: 1px solid #cbd5e1;
              position: relative;
              box-sizing: border-box;
            }
            .top-banner {
              background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
              color: white;
              padding: 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .logo-title {
              font-weight: 800;
              font-size: 16px;
              letter-spacing: 1px;
            }
            .photo-area {
              margin-top: -30px;
            }
            .photo {
              width: 90px;
              height: 90px;
              border-radius: 50%;
              object-fit: cover;
              border: 4px solid #ffffff;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            }
            .photo-fallback {
              width: 90px;
              height: 90px;
              border-radius: 50%;
              background: #4f46e5;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
              font-weight: bold;
              border: 4px solid #ffffff;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
              margin: 0 auto;
            }
            .content {
              padding: 12px 20px;
            }
            .name {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
              margin-top: 4px;
            }
            .designation {
              font-size: 13px;
              color: #4f46e5;
              font-weight: 600;
            }
            .dept {
              font-size: 12px;
              color: #64748b;
            }
            .blood {
              font-size: 11px;
              color: #e11d48;
              font-weight: 800;
              margin-top: 2px;
            }
            .empid {
              background: #e0e7ff;
              color: #3730a3;
              padding: 4px 12px;
              border-radius: 12px;
              font-weight: 800;
              font-family: monospace;
              font-size: 13px;
              margin-top: 8px;
              display: inline-block;
            }
            .qr-box {
              background: #f8fafc;
              padding: 10px;
              border-radius: 14px;
              border: 1px solid #e2e8f0;
              display: inline-block;
              margin-bottom: 12px;
            }
            .footer {
              background: #f1f5f9;
              padding: 8px;
              font-size: 10px;
              color: #64748b;
              font-weight: 600;
              border-top: 1px solid #e2e8f0;
            }
            @media print {
              body { background: none; }
              .card { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="top-banner">
              <div class="logo-title">NEXUSCORP</div>
              <div style="font-size: 10px; opacity: 0.8; font-weight: bold;">OFFICIAL ID</div>
            </div>

            <div class="photo-area">
              ${employee.profilePhoto 
                ? `<img src="${employee.profilePhoto}" class="photo" />`
                : `<div class="photo-fallback">${employee.name[0]}</div>`
              }
            </div>
            
            <div class="content">
              <div class="name">${employee.name}</div>
              <div class="designation">${employee.designation}</div>
              <div class="dept">${employee.department} Department</div>
              <div class="blood">Blood Group: ${employee.bloodGroup || 'O+'}</div>
              <div class="empid">${employee.employeeId}</div>
            </div>

            <div>
              <div class="qr-box">
                <svg id="qr-code-svg"></svg>
              </div>
            </div>

            <div class="footer">PROPERTY OF NEXUSCORP INC.</div>
          </div>

          <script src="https://unpkg.com/qrcode-generator@1.4.4/qrcode.js"></script>
          <script>
            var typeNumber = 0;
            var errorCorrectionLevel = 'L';
            var qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData('${verificationUrl}');
            qr.make();
            document.getElementById('qr-code-svg').outerHTML = qr.createSvgTag(3, 0);
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadQR = () => {
    const svg = document.getElementById('employee-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${employee.employeeId}_QR.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full relative space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Digital Employee ID Card</h3>
          <p className="text-xs text-slate-500">Official company identification badge</p>
        </div>

        {/* Physical ID Card Mockup */}
        <div 
          ref={cardRef}
          className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl text-center space-y-3 relative"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xs tracking-wider">NEXUSCORP</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-indigo-500/30 px-2 py-0.5 rounded border border-indigo-400/40">
              IDENTITY BADGE
            </span>
          </div>

          {/* Photo & Profile */}
          <div className="flex flex-col items-center space-y-2 px-4 pt-1">
            <div className="-mt-8">
              {employee.profilePhoto ? (
                <img
                  src={employee.profilePhoto}
                  alt={employee.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-600 border-4 border-white text-white font-extrabold flex items-center justify-center text-2xl shadow-md">
                  {employee.name[0]}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900">{employee.name}</h4>
              <p className="text-xs text-indigo-600 font-bold">{employee.designation}</p>
              <p className="text-[11px] text-slate-500">{employee.department} Dept. • <span className="text-rose-600 font-extrabold">Blood {employee.bloodGroup || 'O+'}</span></p>
            </div>

            <span className="px-3 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-xs rounded-full border border-indigo-200">
              {employee.employeeId}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl inline-block shadow-sm mx-auto my-2">
            <QRCodeSVG
              id="employee-qr-svg"
              value={verificationUrl}
              size={110}
              level="M"
              includeMargin={false}
            />
          </div>

          <div className="bg-slate-100 p-2 text-[10px] text-slate-500 font-medium border-t border-slate-200">
            NexusCorp Corporate ID Card • Scan to Verify
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadQR}
            className="btn-secondary text-xs font-bold flex items-center justify-center gap-2 py-2.5"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            Download QR
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary text-xs font-bold flex items-center justify-center gap-2 py-2.5"
          >
            <Printer className="w-4 h-4" />
            Print ID Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default IDCardModal;
