import "./globals.css";
import ClientLayout from "./ClientLayout";
import InstallPWA from "@/components/InstallPWA";
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
          <InstallPWA />
        </ClientLayout>
      </body>
    </html>
  );
}
