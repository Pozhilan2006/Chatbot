"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const { address, disconnect } = useWallet();
    const pathname = usePathname();

    const shorten = (addr: string | null) => {
        if (!addr) return '...';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className="w-56 h-full bg-[#0e0e0e] border-r border-[#262626] flex flex-col justify-between p-6 hidden md:flex">

            {/* Brand */}
            <div>
                <div className="mb-12">
                    <span className="font-bold text-xl tracking-tighter text-white uppercase leading-none block">Nexus</span>
                    <span className="text-[9px] font-bold text-[#444] tracking-widest uppercase block mt-1">Terminal v2</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-6">
                    <NavItem href="/chat" label="Terminal" active={pathname === '/chat'} index="01" />
                    <NavItem href="/chat/transactions" label="Ledger" active={pathname === '/chat/transactions'} index="02" />
                    <NavItem href="/chat/learn" label="Manual" active={pathname === '/chat/learn'} index="03" />
                    <NavItem href="/chat/settings" label="Config" active={pathname === '/chat/settings'} index="04" />
                </nav>
            </div>

            {/* Footer */}
            <div>
                <div className="border-t border-[#262626] pt-6 mb-4">
                    <p className="text-[9px] text-[#444] font-bold uppercase tracking-widest mb-2">Connected ID</p>
                    <p className="font-mono text-xs text-[#888]">{shorten(address)}</p>
                </div>

                <button
                    onClick={disconnect}
                    className="text-xs font-bold text-[#FF3B2F] uppercase tracking-widest hover:text-white transition-colors"
                >
                    Disconnect
                </button>
            </div>
        </div>
    );
}

function NavItem({ href, label, active = false, index }: { href: string, label: string, active?: boolean, index: string }) {
    return (
        <Link
            href={href}
            className={`block group transition-colors duration-200`}
        >
            <div className="flex items-baseline gap-3">
                <span className={`text-[9px] font-mono ${active ? 'text-[#FF3B2F]' : 'text-[#333]'}`}>{index}</span>
                <span className={`text-sm font-bold uppercase tracking-widest ${active ? 'text-white' : 'text-[#666] group-hover:text-white'}`}>
                    {label}
                </span>
            </div>
        </Link>
    );
}
