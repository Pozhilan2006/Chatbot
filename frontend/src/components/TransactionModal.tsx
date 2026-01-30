"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Wallet, AlertTriangle } from 'lucide-react';
import { IntentResponse } from '@/lib/api';

interface TransactionModalProps {
    isOpen: boolean;
    intent: IntentResponse | null;
    onClose: () => void;
    onConfirm: () => void;
    isProcessing: boolean;
    txHash: string | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    intent,
    onClose,
    onConfirm,
    isProcessing,
    txHash,
}) => {
    return (
        <AnimatePresence>
            {isOpen && intent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="bg-[#111] border border-[#333] w-full max-w-lg shadow-2xl relative"
                    >

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#222]">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-[#FF3B2F] uppercase tracking-widest">Security Protocol</span>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Confirm Intent</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#222] text-[#666] hover:text-white transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {!txHash ? (
                                <div className="space-y-8">

                                    {/* Data Grid */}
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-[9px] font-bold text-[#555] uppercase tracking-widest mb-1">Action</p>
                                            <p className="text-lg font-mono text-white uppercase">{intent.action}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-[#555] uppercase tracking-widest mb-1">Asset</p>
                                            <p className="text-lg font-mono text-white">{intent.asset}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-[#555] uppercase tracking-widest mb-1">Amount</p>
                                            <p className="text-3xl font-bold text-white tracking-tighter">{intent.amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-[#555] uppercase tracking-widest mb-1">Confidence</p>
                                            <p className="text-lg font-mono text-[#FF3B2F]">{(intent.confidence * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-[#222]">
                                        <p className="text-[9px] font-bold text-[#555] uppercase tracking-widest mb-2">Recipient</p>
                                        <p className="font-mono text-sm text-[#888] break-all bg-[#0a0a0a] p-3 border border-[#222]">{intent.to_address}</p>
                                    </div>

                                    {/* Risk Flags */}
                                    {intent.risk_flags.length > 0 && (
                                        <div className="bg-red-950/20 border border-red-900/50 p-4">
                                            <div className="flex items-center gap-2 text-red-500 mb-2">
                                                <AlertTriangle size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Risk Factor</span>
                                            </div>
                                            <ul className="list-disc list-inside text-xs text-red-400 font-mono">
                                                {intent.risk_flags.map((flag, idx) => (
                                                    <li key={idx}>{flag}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 py-4 bg-transparent border border-[#333] text-[#666] font-bold uppercase text-xs tracking-widest hover:border-[#666] hover:text-white transition"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            onClick={onConfirm}
                                            disabled={isProcessing}
                                            className="flex-3 py-4 bg-[#FF3B2F] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#D32F2F] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 px-8"
                                        >
                                            {isProcessing ? 'Signing...' : 'Execute'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <h3 className="text-4xl font-bold text-white mb-4 tracking-tighter">BROADCASTED.</h3>
                                    <p className="text-[#666] mb-8 font-mono text-sm">
                                        TX HASH: {txHash?.slice(0, 10)}...
                                    </p>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition"
                                    >
                                        Close Terminal
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TransactionModal;
