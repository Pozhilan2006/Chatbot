"use client";

import Navbar from "@/components/Navbar";
import { useWallet } from "@/context/WalletContext";
import { ArrowRight, Lock, Zap, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isConnected, connect } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/chat");
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-[#0f0518] text-white overflow-hidden relative selection:bg-violet-500/30">

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-32 md:py-48 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="text-xs font-medium text-violet-200 tracking-wide uppercase">AI-Powered Web3 Transactions</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 max-w-4xl leading-tight">
          Execute Blockchain Intents with <span className="text-violet-400">Natural Language</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          The safest way to interact with Web3. Type what you want to do, verify the intent, and execute securely. No confusing interfaces.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={connect}
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-violet-600 px-8 font-medium text-white transition-all duration-300 hover:bg-violet-700 hover:ring-2 hover:ring-violet-400 hover:ring-offset-2 hover:ring-offset-[#0f0518]"
          >
            <span className="mr-2">Connect Wallet</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </button>

          <button className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 font-medium text-white transition-colors hover:bg-white/10">
            View Features
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl">
          <FeatureCard
            icon={<Zap className="text-amber-400" />}
            title="Instant Parsing"
            description="Our AI understands complex transaction requests instantly and converts them to executable data."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-emerald-400" />}
            title="Security First"
            description="We never access your private keys. Every transaction requires your manual confirmation via wallet."
          />
          <FeatureCard
            icon={<Lock className="text-blue-400" />}
            title="Non-Custodial"
            description="Your assets remain in your control. The AI only suggests actions; you have the final say."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors backdrop-blur-lg flex flex-col items-start text-left">
      <div className="p-3 rounded-lg bg-white/5 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
