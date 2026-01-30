import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEXUS | AI Intent Protocol",
  description: "Editorial Interface for Intelligent Logic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased relative`}>
        {/* Subtle Grid Background */}
        <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0" />

        {/* Major Grid Lines (optional for structure) */}
        <div className="fixed inset-0 container mx-auto border-x border-white/[0.03] pointer-events-none z-0 hidden md:block" />

        <Providers>
          <div className="relative z-10 selection:bg-[#FF3B2F] selection:text-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
