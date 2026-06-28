import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel | Erzenler Et Sofrası",
    template: "%s | Erzenler Admin",
  },
  description: "Erzenler Et Sofrası yönetim paneli.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};  

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
