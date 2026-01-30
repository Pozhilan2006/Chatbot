"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import {
    MessageSquare,
    CreditCard,
    BookOpen,
    Settings,
    LogOut,
    Wallet
} from 'lucide-react';

export default function Sidebar() {
    const { address, disconnect } = useWallet();

    const shorten = (addr: string | null) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className="w-64 h-full bg-[#12081f] border-r border-white/5 flex flex-col justify-between p-4 hidden md:flex">
            <div>
                <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <span className="font-bold text-white leading-none">AI</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">Nexus</span>
                </div>

                <nav className="space-y-1">
                    <NavItem href="/chat" icon={<MessageSquare size={18} />} label="Chat" active />
                    <NavItem href="/chat/transactions" icon={<CreditCard size={18} />} label="Transactions" />
                    <NavItem href="/chat/learn" icon={<BookOpen size={18} />} label="Learn Web3" />
                    <NavItem href="/chat/settings" icon={<Settings size={18} />} label="Settings" />
                </nav>
            </div>

            <div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-violet-500/20 p-2 rounded-lg text-violet-400">
                            <Wallet size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Connected</p>
                            <p className="text-sm font-mono text-white truncate w-24">{shorten(address)}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={disconnect}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    Disconnect
                </button>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                    ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            {icon}
            {label}
        </Link>
    );
}
