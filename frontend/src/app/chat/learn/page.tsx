"use client";

import Sidebar from '@/components/Sidebar';
import { BookOpen } from 'lucide-react';

export default function LearnPage() {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Learn Web3</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all cursor-pointer group">
                        <div className="mb-4 text-violet-400 group-hover:scale-110 transition-transform origin-left">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Understanding Intents</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Learn how AI converts your natural language requests into deterministic blockchain transactions without compromising security.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                        <div className="mb-4 text-emerald-400 group-hover:scale-110 transition-transform origin-left">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Safety 101</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Best practices for signing transactions, verifying addresses, and understanding gas fees on Ethereum.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
