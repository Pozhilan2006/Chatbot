"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Wallet, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { isConnected, connect, address, error } = useWallet();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (error) {
            alert(`Connection Error: ${error}`);
        }
    }, [error]);

    // Redirect if connected
    useEffect(() => {
        if (isConnected) {
            router.push('/chat');
        }
    }, [isConnected, router]);

    // Scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-40 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-black/50 backdrop-blur-xl border-white/5 py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo Area */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-violet-500/5 group-hover:shadow-violet-500/20 transition-all duration-500 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles size={18} className="text-violet-200" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight text-white leading-none">Nexus</span>
                        <span className="text-[10px] font-medium text-gray-500 tracking-widest uppercase mt-0.5">AI Intent Protocol</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="/">Product</NavLink>
                    <NavLink href="#security">Security</NavLink>
                    <NavLink href="#pricing">Enterprise</NavLink>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => {
                        console.log("Connect Wallet button clicked");
                        connect();
                    }}
                    className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
                >
                    <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-black/80 gap-2">
                        {isConnected ? (
                            <>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Connected</span>
                            </>
                        ) : (
                            <>
                                <Wallet size={16} className="text-violet-300" />
                                <span>Connect Wallet</span>
                            </>
                        )}
                    </span>
                </button>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
        </Link>
    );
}
