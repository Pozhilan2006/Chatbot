"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import {
    MessageSquare,
    CreditCard,
    BookOpen,
    Settings,
    LogOut,
    Wallet,
    Sparkles,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const { address, disconnect } = useWallet();
    const pathname = usePathname();

    const shorten = (addr: string | null) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className="w-72 h-full bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between p-6 hidden md:flex relative z-20">

            {/* Brand */}
            <div>
                <div className="flex items-center gap-3 mb-10 pl-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-violet-500/5 relative overflow-hidden">
                        <Sparkles size={16} className="text-violet-200 relative z-10" />
                        <div className="absolute inset-0 bg-violet-500/10 blur-sm" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">Nexus</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">Menu</p>
                    <NavItem href="/chat" icon={<MessageSquare size={18} />} label="Assistant" active={pathname === '/chat'} />
                    <NavItem href="/chat/market" icon={<TrendingUp size={18} />} label="Market" active={pathname === '/chat/market'} />
                    <NavItem href="/chat/transactions" icon={<CreditCard size={18} />} label="History" active={pathname === '/chat/transactions'} />
                    <NavItem href="/chat/learn" icon={<BookOpen size={18} />} label="Learn" active={pathname === '/chat/learn'} />

                    <div className="h-px bg-white/5 my-4 mx-3" />

                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">System</p>
                    <NavItem href="/chat/settings" icon={<Settings size={18} />} label="Preferences" active={pathname === '/chat/settings'} />
                </nav>
            </div>

            {/* Footer / User Profile */}
            <div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-4 group hover:border-violet-500/20 transition-all cursor-default">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-violet-900/40">
                            <Wallet size={16} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Connected</p>
                            <p className="text-xs font-mono text-white truncate opacity-80 group-hover:opacity-100 transition-opacity">
                                {shorten(address)}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={disconnect}
                    className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-gray-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-all group"
                >
                    <span className="flex items-center gap-2">
                        <LogOut size={14} />
                        Sign Out
                    </span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </button>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${active
                ? 'bg-white/5 text-white shadow-sm border border-white/5'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 hover:translate-x-1'
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`transition-colors ${active ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {icon}
                </span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            {active && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.5)]" />}
        </Link>
    );
}
