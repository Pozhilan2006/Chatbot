"use client";

import Sidebar from '@/components/Sidebar';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

export default function TransactionsPage() {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Transaction History</h1>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center py-20">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="text-gray-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No Transactions Yet</h3>
                    <p className="text-gray-400 max-w-sm mx-auto">
                        Your recent blockchain interactions will appear here once you start using the Assistant.
                    </p>
                </div>
            </main>
        </div>
    );
}
