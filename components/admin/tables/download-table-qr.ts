import QRCode from "qrcode";

type DownloadTableDesignArgs = {
  tableLabel: string;
  qrUrl: string;
};

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function getTableNumber(label: string) {
  const number = label.match(/\d+/)?.[0];
  return number ? number.padStart(2, "0") : label;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export async function downloadQrOnly(tableLabel: string, qrUrl: string) {
  const canvas = document.createElement("canvas");

  await QRCode.toCanvas(canvas, qrUrl, {
    width: 1000,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  downloadCanvas(canvas, `${tableLabel}-qr.png`);
}

export async function downloadTableDesign({
  tableLabel,
  qrUrl,
}: DownloadTableDesignArgs) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  canvas.width = 1240;
  canvas.height = 1748;

  const centerX = canvas.width / 2;

  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, "#123F2B");
  bgGradient.addColorStop(0.55, "#0B2D20");
  bgGradient.addColorStop(1, "#06170F");

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft gold glow top
  const topGlow = ctx.createRadialGradient(centerX, 190, 40, centerX, 190, 620);
  topGlow.addColorStop(0, "rgba(214,179,90,0.28)");
  topGlow.addColorStop(0.45, "rgba(214,179,90,0.10)");
  topGlow.addColorStop(1, "rgba(214,179,90,0)");

  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, canvas.width, 760);

  // Bottom dark glow
  const bottomGlow = ctx.createRadialGradient(
    centerX,
    1420,
    60,
    centerX,
    1420,
    720,
  );
  bottomGlow.addColorStop(0, "rgba(0,0,0,0.30)");
  bottomGlow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = bottomGlow;
  ctx.fillRect(0, 950, canvas.width, 798);

  // Outer border
  ctx.strokeStyle = "#D6B35A";
  ctx.lineWidth = 10;
  ctx.strokeRect(54, 54, canvas.width - 108, canvas.height - 108);

  // Inner border
  ctx.strokeStyle = "rgba(214,179,90,0.42)";
  ctx.lineWidth = 3;
  ctx.strokeRect(82, 82, canvas.width - 164, canvas.height - 164);

  // Decorative corner lines
  ctx.strokeStyle = "rgba(214,179,90,0.68)";
  ctx.lineWidth = 5;

  const corner = 150;
  const inset = 115;

  ctx.beginPath();
  ctx.moveTo(inset, inset + corner);
  ctx.lineTo(inset, inset);
  ctx.lineTo(inset + corner, inset);

  ctx.moveTo(canvas.width - inset - corner, inset);
  ctx.lineTo(canvas.width - inset, inset);
  ctx.lineTo(canvas.width - inset, inset + corner);

  ctx.moveTo(inset, canvas.height - inset - corner);
  ctx.lineTo(inset, canvas.height - inset);
  ctx.lineTo(inset + corner, canvas.height - inset);

  ctx.moveTo(canvas.width - inset - corner, canvas.height - inset);
  ctx.lineTo(canvas.width - inset, canvas.height - inset);
  ctx.lineTo(canvas.width - inset, canvas.height - inset - corner);
  ctx.stroke();

  // Subtle watermark text
  ctx.save();
  ctx.globalAlpha = 0.035;
  ctx.fillStyle = "#F8F4EA";
  ctx.font = "bold 110px Georgia";
  ctx.textAlign = "center";
  ctx.translate(centerX, 910);
  ctx.rotate(-0.18);
  ctx.fillText("ERZENLER", 0, 0);
  ctx.restore();

  // Logo
  try {
    const logo = await loadImage("/images/erzenler-logo.png");
    ctx.drawImage(logo, 270, 120, 700, 260);
  } catch {
    ctx.fillStyle = "#F8F4EA";
    ctx.font = "bold 72px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("ERZENLER", centerX, 230);

    ctx.fillStyle = "#D6B35A";
    ctx.font = "bold 34px Arial";
    ctx.fillText("ET SOFRASI", centerX, 280);
  }

  // Top label
  ctx.textAlign = "center";
  ctx.fillStyle = "#D6B35A";
  ctx.font = "bold 34px Arial";
  ctx.letterSpacing = "8px";
  ctx.fillText("QR MENÜ", centerX, 440);

  // Table title
  ctx.fillStyle = "#F8F4EA";
  ctx.font = "bold 44px Arial";
  ctx.fillText("MASA", centerX, 535);

  // Table number
  ctx.fillStyle = "#F8F4EA";
  ctx.font = "bold 220px Georgia";
  ctx.fillText(getTableNumber(tableLabel), centerX, 735);

  // Gold divider ornaments
  ctx.strokeStyle = "#D6B35A";
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(300, 655);
  ctx.lineTo(455, 655);
  ctx.moveTo(785, 655);
  ctx.lineTo(940, 655);
  ctx.stroke();

  ctx.fillStyle = "#D6B35A";
  ctx.beginPath();
  ctx.ellipse(475, 655, 10, 18, Math.PI / 2, 0, Math.PI * 2);
  ctx.ellipse(765, 655, 10, 18, Math.PI / 2, 0, Math.PI * 2);
  ctx.fill();

  // QR
  const qrCanvas = document.createElement("canvas");

  await QRCode.toCanvas(qrCanvas, qrUrl, {
    width: 430,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  const qrX = 405;
  const qrY = 805;
  const qrSize = 430;

  // QR shadow
  ctx.fillStyle = "rgba(0,0,0,0.30)";
  ctx.fillRect(qrX + 14, qrY + 16, qrSize, qrSize);

  // QR frame
  ctx.fillStyle = "#F8F4EA";
  ctx.strokeStyle = "#D6B35A";
  ctx.lineWidth = 6;
  ctx.roundRect(qrX - 18, qrY - 18, qrSize + 36, qrSize + 36, 26);
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(qrCanvas, qrX, qrY);

  // CTA
  ctx.fillStyle = "#D6B35A";
  ctx.font = "italic 46px Georgia";
  ctx.fillText("Menümüzü görüntülemek için", centerX, 1325);

  ctx.fillStyle = "#F8F4EA";
  ctx.font = "bold 48px Arial";
  ctx.fillText("QR KODU OKUTUN", centerX, 1395);

  // Footer
  const footerY = 1495;

  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(0, footerY, canvas.width, canvas.height - footerY);

  ctx.strokeStyle = "#D6B35A";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(canvas.width, footerY);
  ctx.stroke();

  // Phone circle
  ctx.fillStyle = "#0F3F2A";
  ctx.strokeStyle = "#D6B35A";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(centerX, footerY, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#F8F4EA";
  ctx.font = "bold 42px Arial";
  ctx.fillText("☎", centerX, footerY + 15);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 42px Arial";
  ctx.fillText("0544 518 23 42  •  0544 518 23 42", centerX, 1588);

  ctx.font = "bold 42px Arial";
  ctx.fillText("0212 596 41 55  •  0212 596 41 42", centerX, 1650);

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "bold 25px Arial";
  ctx.fillText(
    "İncirtepe Mah. Doğan Araslı Cad. No: 28 Esenyurt / İST.",
    centerX,
    1712,
  );

  downloadCanvas(canvas, `${tableLabel}-dark-luxury-qr.png`);
}