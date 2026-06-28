// "use client";

// import QRCode from "react-qr-code";
// import { Download, ExternalLink, ImageIcon, Printer } from "lucide-react";

// import type { RestaurantTableRow } from "./AdminTablesClient";
// import { downloadQrOnly, downloadTableDesign } from "./download-table-qr";
// import Image from "next/image";

// type TableDesignPreviewProps = {
//   table: RestaurantTableRow | null;
// };

// function getTableNumber(label: string) {
//   const number = label.match(/\d+/)?.[0];
//   return number ? number.padStart(2, "0") : label;
// }

// export function TableDesignPreview({ table }: TableDesignPreviewProps) {
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

//   if (!table) {
//     return (
//       <section className="rounded-2xl border border-brand-sand bg-white p-8 text-center">
//         <h2 className="text-xl font-semibold text-brand-green">
//           Tasarım Önizleme
//         </h2>
//         <p className="mt-2 text-sm text-brand-muted">
//           Önizleme için bir masa seçin.
//         </p>
//       </section>
//     );
//   }

//   const qrUrl = `${siteUrl}/qr/${table.slug}`;

//   return (
//     <section className="overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm">
//       <div className="border-b border-brand-sand p-5">
//         <h2 className="text-xl font-bold text-brand-green">
//           {table.label} - Tasarım Önizleme
//         </h2>
//       </div>

//       <div className="flex justify-center bg-white p-5">
//         <div className="relative aspect-[15/21] w-full max-w-[480px] overflow-hidden rounded-[28px] border border-[#D6B35A]/60 bg-[#0f3f2a] shadow-2xl">
//           <div className="absolute inset-5 rounded-[22px] border border-[#D6B35A]/70" />

//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,179,90,0.22),transparent_38%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.38),transparent_44%)]" />

//           <div className="absolute left-1/2 top-10 w-[270px] -translate-x-1/2">
//             <Image
//               src="/images/erzenler-logo.png"
//               alt="Erzenler Et Sofrası"
//               width={270}
//               height={120}
//               priority
//               className="h-auto w-full object-contain drop-shadow-2xl"
//             />
//           </div>

//           <div className="absolute left-0 right-0 top-[205px] text-center">
//             <p className="text-sm font-bold uppercase tracking-[0.36em] text-[#D6B35A]">
//               QR MENÜ
//             </p>

//             <p className="mt-5 text-xl font-black tracking-[0.22em] text-white">
//               MASA
//             </p>

//             <p className="font-display text-[128px] font-black leading-none text-[#F8F4EA] drop-shadow-xl">
//               {getTableNumber(table.label)}
//             </p>
//           </div>

//           <div className="absolute left-1/2 top-[440px] -translate-x-1/2 rounded-2xl border border-[#D6B35A] bg-[#F8F4EA] p-4 shadow-2xl">
//             <QRCode value={qrUrl} size={175} />
//           </div>

//           <div className="absolute left-0 right-0 top-[680px] px-10 text-center">
//             <p className="font-display text-2xl italic text-[#D6B35A]">
//               Menümüzü görüntülemek için
//             </p>
//             <p className="mt-2 text-xl font-black tracking-[0.12em] text-white">
//               QR KODU OKUTUN
//             </p>
//           </div>

//           <div className="absolute bottom-0 left-0 right-0 border-t border-[#D6B35A]/60 bg-black/25 px-6 py-6 text-center text-white backdrop-blur-sm">
//             <p className="text-lg font-black leading-tight">
//               0544 518 23 42 • 0544 518 23 42
//             </p>
//             <p className="mt-1 text-lg font-black leading-tight">
//               0212 596 41 55 • 0212 596 41 42
//             </p>
//             <p className="mt-3 text-[11px] font-semibold leading-4 text-white/80">
//               İncirtepe Mah. Doğan Araslı Cad. No: 28 Esenyurt / İST.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-brand-sand p-5">
//         <div className="grid gap-3 sm:grid-cols-3">
//           <a
//             href={qrUrl}
//             target="_blank"
//             rel="noreferrer"
//             className="flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-sand text-sm font-semibold text-brand-green transition hover:border-brand-red hover:text-brand-red"
//           >
//             <ExternalLink className="h-4 w-4" />
//             QR Aç
//           </a>

//           <button
//             type="button"
//             onClick={() => downloadQrOnly(table.label, qrUrl)}
//             className="flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-sand text-sm font-semibold text-brand-green transition hover:border-brand-red hover:text-brand-red"
//           >
//             <Download className="h-4 w-4" />
//             Sadece QR
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               downloadTableDesign({
//                 tableLabel: table.label,
//                 qrUrl,
//               })
//             }
//             className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green text-sm font-semibold text-white transition hover:bg-brand-greenLight"
//           >
//             <ImageIcon className="h-4 w-4" />
//             Tasarım İndir
//           </button>
//         </div>

//         <div className="mt-5 grid gap-4 border-t border-brand-sand pt-5 text-sm sm:grid-cols-4">
//           <div>
//             <div className="flex items-center gap-2 font-semibold text-brand-green">
//               <Printer className="h-4 w-4" />
//               Önerilen Boyut
//             </div>
//             <p className="mt-1 text-brand-muted">15 × 21 cm A5</p>
//           </div>

//           <div>
//             <p className="font-semibold text-brand-green">Format</p>
//             <p className="mt-1 text-brand-muted">PNG</p>
//           </div>

//           <div>
//             <p className="font-semibold text-brand-green">Renk</p>
//             <p className="mt-1 text-brand-muted">Baskıya uygun</p>
//           </div>

//           <div>
//             <p className="font-semibold text-brand-green">Kenar Boşluğu</p>
//             <p className="mt-1 text-brand-muted">5 mm önerilir</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
