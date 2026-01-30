"use client";

import Navbar from "@/components/Navbar";
import { useWallet } from "@/context/WalletContext";
import { ArrowRight, ArrowDownRight } from "lucide-react";
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
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 md:pt-40 min-h-[90vh] flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Main Headline Block */}
          <div className="md:col-span-8 flex flex-col justify-start">
            <div className="mb-4 flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF3B2F]">● Logic Protocol</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#404040]">Edition 01</span>
            </div>

            <h1 className="text-hero leading-none tracking-tighter mb-12">
              Human taste. <br />
              <span className="text-[#333]">AI Speed.</span>
            </h1>

            <div className="max-w-md border-l border-[#FF3B2F] pl-6 py-1">
              <p className="text-lg font-medium text-[#888] mb-8 leading-relaxed">
                WE DESIGN INTENT. <br />
                A NON-CUSTODIAL INTERFACE FOR INTELLIGENT CAPITAL ALLOCATION. ZERO NOISE.
              </p>

              <button
                onClick={connect}
                className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all duration-300"
              >
                Connect Terminal
                <ArrowRight size={16} className="text-[#FF3B2F]" />
              </button>
            </div>
          </div>

          {/* Abstract Visual / Right Column */}
          <div className="md:col-span-4 relative h-[400px] md:h-auto border border-[#262626] bg-[#0A0A0A] flex items-center justify-center p-8 overflow-hidden">
            {/* Abstract Generative CSS Shape */}
            <div className="absolute w-[200px] h-[200px] bg-[#FF3B2F] mix-blend-exclusion rounded-full blur-[80px] animate-pulse" />
            <div className="relative z-10 font-mono text-xs text-[#404040] space-y-1">
              <p>0x1f...a3c</p>
              <p>BLOCK: 192842</p>
              <p>STATUS: IDLE</p>
              <p className="text-[#FF3B2F]">WAITING FOR INPUT_</p>
            </div>

            {/* Twisted Grid Overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, #333 25%, #333 26%, transparent 27%, transparent 74%, #333 75%, #333 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #333 25%, #333 26%, transparent 27%, transparent 74%, #333 75%, #333 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px',
                transform: 'perspective(500px) rotateX(60deg) scale(2)'
              }}
            />
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#262626] py-12 mt-20">
          <FeatureBlock title="Precision" desc="Exact intent parsing." />
          <FeatureBlock title="Security" desc="Enclave validation." />
          <FeatureBlock title="Speed" desc="Zero latency execution." />
          <div className="flex items-end justify-end">
            <ArrowDownRight size={32} className="text-[#333]" />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureBlock({ title, desc }: { title: string, desc: string }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-[#fff]">{title}</h3>
      <p className="text-sm text-[#666]">{desc}</p>
    </div>
  )
}
