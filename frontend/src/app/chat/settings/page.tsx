"use client";

import Sidebar from '@/components/Sidebar';
import { Settings, Shield, Bell, Eye } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Preferences</h1>

                <div className="space-y-6 max-w-2xl">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Strict Confirmation Mode</h3>
                                <p className="text-sm text-gray-400">Require double approval for transactions over 1 ETH</p>
                            </div>
                        </div>
                        <div className="h-6 w-11 bg-violet-600 rounded-full relative cursor-pointer">
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Risk Alerts</h3>
                                <p className="text-sm text-gray-400">Notify me about high gas fees or unusual activity</p>
                            </div>
                        </div>
                        <div className="h-6 w-11 bg-zinc-700 rounded-full relative cursor-pointer">
                            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
