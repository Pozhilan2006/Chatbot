"use client";

import Navbar from "@/components/Navbar";
import { useWallet } from "@/context/WalletContext";
import { ArrowRight, Lock, Zap, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
    const { isConnected, connect } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (isConnected) {
            router.push("/chat");
        }
    }, [isConnected, router]);

    return (
        <div className="min-h-screen text-white overflow-hidden relative selection:bg-violet-500/30">

            <Navbar />

            {/* Hero Section */}
            <main className="container mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col items-center text-center relative z-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in-up hover:bg-white/10 transition-colors cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-300">Nexus Protocol v2.0 Live</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 max-w-5xl leading-[1.1] drop-shadow-2xl">
                    Protocol for <br />
                    <span className="text-white">Intelligent Transactions</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light tracking-wide">
                    Execute complex blockchain intents with natural language. <br className="hidden md:block" />
                    Secure. Non-custodial. Powered by advanced AI.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center justify-center">
                    <button
                        onClick={connect}
                        className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white text-black px-8 font-bold text-sm transition-all duration-300 hover:bg-gray-200 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
                    >
                        <span className="mr-2">Connect Wallet</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </button>

                    <button className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 font-bold text-sm text-white transition-all hover:bg-white/10 hover:border-white/20 backdrop-blur-md">
                        Read Whitepaper
                    </button>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full max-w-6xl text-left">
                    <FeatureCard
                        icon={<Zap className="text-amber-400" size={24} />}
                        title="Instant Processing"
                        description="Latency-optimized intent parsing engine converts natural language to executable bytecode in milliseconds."
                        delay={0}
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="text-emerald-400" size={24} />}
                        title="Military-Grade Security"
                        description="Zero-knowledge architecture ensures private keys never leave your secure enclave. You verify every signature."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Lock className="text-violet-400" size={24} />}
                        title="Sovereign Control"
                        description="Non-custodial by design. Your assets, your keys, your decisions. AI acts only as an intelligent facilitator."
                        delay={0.2}
                    />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <div
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.04] group relative overflow-hidden backdrop-blur-sm"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-3 rounded-2xl bg-white/5 w-fit mb-6 border border-white/5 group-hover:border-white/10 transition-colors shadow-lg shadow-black/20 relative z-10">
                {icon}
            </div>

            <h3 className="text-xl font-bold mb-3 text-white tracking-tight relative z-10">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm font-light relative z-10">{description}</p>
        </div>
    );
}
