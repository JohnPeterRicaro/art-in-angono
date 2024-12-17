import "./globals.css";
import ClientLayout from "./ClientLayout";
import PWANotification from "@/components/PWANotification";
import "@/lib/pwaHandler";  // Initialize PWA handler

export const metadata = {
  title: "Art In Angono",
  description: "Discover art museums and galleries in Angono, Rizal",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Art In Angono",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png" },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Art In Angono" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="mask-icon" href="/icons/icon-512x512.png" color="#000000" />
      </head>
      <body>
        <ClientLayout>
          {children}
          <PWANotification />
        </ClientLayout>
      </body>
    </html>
  );
}
