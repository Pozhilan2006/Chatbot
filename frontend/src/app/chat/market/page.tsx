"use client";

import Sidebar from '@/components/Sidebar';
import MarketWidget from '@/components/market/MarketWidget';

export default function MarketPage() {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col p-8 overflow-y-auto relative">
                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-[50vh] bg-violet-600/5 blur-[120px] pointer-events-none" />

                <div className="max-w-6xl mx-auto w-full relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Market Overview</h1>
                    <p className="text-gray-400 mb-8">Real-time insights across the crypto ecosystem.</p>

                    <MarketWidget />
                </div>
            </main>
        </div>
    );
}
