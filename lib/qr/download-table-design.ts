import QRCode from "qrcode";

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function downloadQrOnly(filename: string, qrUrl: string) {
  const canvas = document.createElement("canvas");

  await QRCode.toCanvas(canvas, qrUrl, {
    width: 1000,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  downloadCanvas(canvas, `${filename}.png`);
}
