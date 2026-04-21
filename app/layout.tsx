import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: {
    default: "Comércios Locais – Águas Mornas, SC",
    template: "%s | Comércios Locais",
  },
  description:
    "Encontre os melhores comércios, serviços e produtos coloniais de Águas Mornas e região. O marketplace de proximidade da sua cidade.",
  keywords: [
    "comércios locais",
    "Águas Mornas",
    "Santa Catarina",
    "produtos coloniais",
    "serviços",
    "gastronomia",
    "marketplace",
  ],
  authors: [{ name: "Comércios Locais" }],
  creator: "Comércios Locais",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "ComLoc",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Comércios Locais",
    title: "Comércios Locais – Águas Mornas, SC",
    description: "O marketplace de proximidade de Águas Mornas e região, SC.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/pin-gold.png" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-stone-50 text-stone-900 font-sans"
      >
        {children}
      </body>
    </html>
  );
}
