"use client";

import QRCode from "react-qr-code";

type TableQrCodeProps = {
  url: string;
};

export function TableQrCode({ url }: TableQrCodeProps) {
  return (
    <div className="rounded-xl bg-white p-4">
      <QRCode
        value={url}
        size={180}
        style={{
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}