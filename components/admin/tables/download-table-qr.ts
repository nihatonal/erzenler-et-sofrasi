import QRCode from "qrcode";

type LocaleCode = "tr" | "en" | "ru" | "ar";

const localeLabels: Record<LocaleCode, string> = {
  tr: "turkce",
  en: "english",
  ru: "russian",
  ar: "arabic",
};

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function normalizeFilename(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function downloadLocalizedQrOnly({
  tableLabel,
  locale,
  qrUrl,
}: {
  tableLabel: string;
  locale: LocaleCode;
  qrUrl: string;
}) {
  const canvas = document.createElement("canvas");

  await QRCode.toCanvas(canvas, qrUrl, {
    width: 1000,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  downloadCanvas(
    canvas,
    `${normalizeFilename(tableLabel)}-${localeLabels[locale]}-qr.png`,
  );
}