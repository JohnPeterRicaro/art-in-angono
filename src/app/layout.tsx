import "./globals.css";

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
      <body className={"m-0 p-0 box-border"}>{children}</body>
    </html>
  );
}
