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

    useEffect(() => {
        // If not connected, redirect to home
        // But allow a brief delay for hydration or check
        const checkConnection = setTimeout(() => {
            if (!isConnected) {
                router.push('/');
            }
        }, 500);
        return () => clearTimeout(checkConnection);
    }, [isConnected, router]);

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0518] text-white">
                <div className="flex flex-col items-center animate-pulse">
                    <div className="w-12 h-12 bg-violet-600/20 rounded-full flex items-center justify-center mb-4">
                        <Wallet className="text-violet-500" />
                    </div>
                    <p className="text-gray-400">Connecting to wallet...</p>
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
