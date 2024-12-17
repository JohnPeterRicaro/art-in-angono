import "./globals.css";
import ClientLayout from "./ClientLayout";
import PWANotification from "@/components/PWANotification";
import "@/lib/pwaHandler";  // Initialize PWA handler

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
      <body>
        <ClientLayout>
          {children}
          <PWANotification />
        </ClientLayout>
      </body>
    </html>
  );
}
