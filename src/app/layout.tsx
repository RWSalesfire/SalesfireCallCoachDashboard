import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDR Call Coaching Dashboard",
  description: "Daily and weekly call coaching insights for Salesfire SDR team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
