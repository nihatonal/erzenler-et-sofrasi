"use client";

import QRCode from "react-qr-code";
import { Download } from "lucide-react";
import { downloadQrOnly } from "@/lib/qr/download-table-design";

type StaticQrPanelProps = {
  locale?: string;
};

export function StaticQrPanel({ locale = "tr" }: StaticQrPanelProps) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://erzenleretsofrasi.com.tr";

  const tableMenuUrl = `${siteUrl}/${locale}/menu?qr=table`;
  const onlineOrderUrl = `${siteUrl}/${locale}/menu?qr=online`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <QrCard
        title="Masa QR Kodu"
        description="Masalarda kullanılacak QR. Sadece menü gösterir, sepete ekleme kapalıdır."
        url={tableMenuUrl}
        fileName="masa-menu-qr"
      />

      <QrCard
        title="Online Sipariş QR Kodu"
        description="Broşür, sosyal medya veya paket servis için. Sepete ekleme ve online sipariş aktiftir."
        url={onlineOrderUrl}
        fileName="online-siparis-qr"
      />
    </div>
  );
}

function QrCard({
  title,
  description,
  url,
  fileName,
}: {
  title: string;
  description: string;
  url: string;
  fileName: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-sand bg-white p-6">
      <h2 className="text-xl font-bold text-brand-green">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-brand-muted">{description}</p>

      <div className="mt-6 rounded-2xl border border-brand-sand bg-brand-cream p-6">
        <div className="mx-auto max-w-[250px] rounded-xl bg-white p-4">
          <QRCode value={url} size={220} />
        </div>
      </div>

      <p className="mt-4 break-all rounded-xl bg-brand-cream p-3 text-xs text-brand-muted">
        {url}
      </p>

      <button
        type="button"
        onClick={() => downloadQrOnly(fileName, url)}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold text-white transition hover:bg-brand-redLight"
      >
        <Download className="h-4 w-4" />
        QR İndir
      </button>
    </div>
  );
}