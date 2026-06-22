'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

type TableQrCodeProps = {
  url: string;
  tableLabel: string;
};

export function TableQrCode({ url, tableLabel }: TableQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    async function generateQr() {
      if (!canvasRef.current) return;

      await QRCode.toCanvas(canvasRef.current, url, {
        width: 220,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#0F0D09',
          light: '#FFFFFF',
        },
      });

      setQrReady(true);
    }

    generateQr();
  }, [url]);

  async function downloadQrPng() {
    const qrCanvas = canvasRef.current;
    if (!qrCanvas) return;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 900;
    finalCanvas.height = 1200;

    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0F0D09';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    ctx.fillStyle = '#C9973F';
    ctx.font = 'bold 48px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('MIRA', 450, 120);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.letterSpacing = '6px';
    ctx.fillText('BISTRO', 450, 155);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px Arial';
    ctx.fillText(tableLabel, 450, 245);

    ctx.fillStyle = '#C9973F';
    ctx.font = '24px Arial';
    ctx.fillText('QR MENÜ', 450, 295);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(250, 360, 400, 400);

    ctx.drawImage(qrCanvas, 280, 390, 340, 340);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText('Menüyü görüntülemek için okutun', 450, 840);

    ctx.fillStyle = '#8A7A5C';
    ctx.font = '18px Arial';
    ctx.fillText(url, 450, 895);

    const link = document.createElement('a');
    link.download = `${tableLabel.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-40 w-40 items-center justify-center border border-neutral-200 bg-white shadow-sm">
        <canvas
          ref={canvasRef}
          className="h-32 w-32"
        />
      </div>

      <button
        type="button"
        onClick={downloadQrPng}
        disabled={!qrReady}
        className="mt-4 flex h-10 items-center justify-center gap-2 border border-brand-gold px-4 text-xs font-bold uppercase tracking-[0.12em] text-brand-gold transition hover:bg-brand-gold hover:text-white disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        PNG İndir
      </button>
    </div>
  );
}