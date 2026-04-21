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
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js')
                  .then(function (registration) {
                    console.log('[SW] Registrado com sucesso:', registration.scope);
                  })
                  .catch(function (error) {
                    console.error('[SW] Erro ao registrar:', error);
                  });
              });
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
