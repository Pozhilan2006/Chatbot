"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import { Wallet } from 'lucide-react';

export default function ChatPage() {
    const { isConnected } = useWallet();
    const router = useRouter();

    // Remove redirect loop
    // Instead of redirecting to '/', show the Connect Wallet UI here.

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0518] text-white relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]"></div>

                <div className="flex flex-col items-center z-10 p-8 border border-white/5 bg-white/5 backdrop-blur-2xl rounded-3xl max-w-md w-full mx-4 shadow-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
                        <Wallet className="text-white" size={32} />
                    </div>

                    <h1 className="text-2xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        Connect Wallet
                    </h1>
                    <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">
                        Securely connect your wallet to access the Nexus AI Protocol and manage your assets with natural language.
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>Connect MetaMask</span>
                        <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest text-center">
                        Non-Custodial • End-to-End Encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0f0518] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col relative">
                {/* Header mobile only */}
                <div className="md:hidden h-16 border-b border-white/5 flex items-center px-4 justify-between bg-[#12081f]">
                    <span className="font-bold text-lg">Nexus</span>
                </div>

                <ChatInterface />
            </main>
        </div>
    );
}
