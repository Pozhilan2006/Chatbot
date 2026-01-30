"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { isConnected, connect, address } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (isConnected) {
            router.push('/chat');
        }
    }, [isConnected, router]);

    return (
        <nav className="fixed top-0 w-full z-40 bg-[var(--background)]/90 backdrop-blur-sm border-b border-white/5 md:border-none md:bg-transparent">
            <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                {/* Logo Text */}
                <Link href="/" className="text-xl font-bold tracking-tighter uppercase relative group">
                    Nexus
                    <span className="text-[#FF3B2F] absolute -top-1 -right-2 text-[8px]">●</span>
                </Link>

                {/* Navigation - Minimal Text */}
                <div className="hidden md:flex items-center gap-12 text-xs font-semibold uppercase tracking-widest text-[#888]">
                    <NavLink href="/">Manifesto</NavLink>
                    <NavLink href="#capabilities">Capabilities</NavLink>
                    <NavLink href="#pricing">Access</NavLink>
                </div>

                {/* CTA - Understated */}
                <button
                    onClick={connect}
                    className="text-xs font-bold uppercase tracking-widest border-b border-[#FF3B2F] pb-0.5 hover:text-[#FF3B2F] transition-colors"
                >
                    {isConnected ? 'Terminal Active' : 'Connect Wallet'}
                </button>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="hover:text-white transition-colors"
        >
            {children}
        </Link>
    );
}
