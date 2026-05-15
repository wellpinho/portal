import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: {
    default: "Comércios Locais",
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
    "produtos coloniais",
    "gastronomia",
  ],
  authors: [{ name: "Comércios Locais" }],
  creator: "Comércios Locais",
  icons: {
    icon: "/favicon.svg",
  },
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
    title:
      "Comércios Locais - O marketplace de proximidade de Águas Mornas e região, SC.",
    description: "O marketplace de proximidade de Águas Mornas e região, SC.",
    images: [
      {
        url: '/og-image.png', // Crie uma imagem de 1200x630 com o seu logo e o nome da cidade
        width: 1200,
        height: 630,
        alt: 'Comércios Locais - Marketplace de Águas Mornas',
      },
    ],
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
        <link rel="apple-touch-icon" href="/pwa-pin-green.png" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-stone-50 text-stone-900 font-sans"
      >
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js')
                  .catch(function () {});
              });
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
