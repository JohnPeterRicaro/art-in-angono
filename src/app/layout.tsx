import "./globals.css";
import ClientLayout from "./ClientLayout";
import "@/lib/pwaHandler";  // Import PWA handler as early as possible

export const metadata = {
  title: "Art In Angono",
  description: "Art In Angono",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/your-main-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        
        {/* Meta tags for better performance */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={"m-0 p-0 box-border"}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
