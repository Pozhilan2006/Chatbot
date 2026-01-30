"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowRight, Wallet } from 'lucide-react';

export default function Navbar() {
    const { isConnected, connect, address } = useWallet();
    const router = useRouter();

    // Redirect if connected
    useEffect(() => {
        if (isConnected) {
            router.push('/chat');
        }
    }, [isConnected, router]);

    return (
        <nav className="fixed top-0 w-full z-40 bg-[rgba(15,5,24,0.7)] backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                        <span className="font-bold text-white">AI</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Nexus
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="/" className="hover:text-white transition">Home</Link>
                    <Link href="#features" className="hover:text-white transition">Features</Link>
                    <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
                    <Link href="#blog" className="hover:text-white transition">Blog</Link>
                </div>

                <button
                    onClick={connect}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-full font-medium transition shadow-lg shadow-violet-600/20 active:scale-95"
                >
                    {isConnected ? (
                        <span>Connected</span>
                    ) : (
                        <>
                            <Wallet size={18} />
                            Connect Wallet
                        </>
                    )}
                </button>
            </div>
        </nav>
    );
}
