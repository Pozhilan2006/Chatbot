import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Web3 Assistant",
    description: "Secure, AI-powered blockchain transactions.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} min-h-screen bg-[var(--background)] text-white relative overflow-x-hidden selection:bg-violet-500/30`}>
                {/* Cinematic Background Elements */}

                {/* Noise Texture */}
                <div className="fixed inset-0 w-full h-full mix-blend-overlay opacity-[0.03] pointer-events-none z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
                />

                {/* Ambient Orbs */}
                <div className="fixed -bottom-[20vh] -left-[10vw] w-[60vw] h-[60vh] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none z-0 mix-blend-screen" />
                <div className="fixed -bottom-[20vh] -right-[10vw] w-[60vw] h-[60vh] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none z-0 mix-blend-screen" />
                <div className="fixed -bottom-[30vh] left-1/2 -translate-x-1/2 w-[50vw] h-[50vh] rounded-full bg-white/5 blur-[100px] pointer-events-none z-0 mix-blend-overlay" />

                <Providers>
                    <div className="relative z-10">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
