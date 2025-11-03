import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muscle to Movement",
  description:
    "Innovative software and hardware solutions empowering individuals living with Multiple Sclerosis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900">
          <Navbar />
          <main className="flex-1">
            <div className="page-stack">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
