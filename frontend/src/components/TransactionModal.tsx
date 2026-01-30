"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X, ExternalLink } from 'lucide-react';
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#1a103c] border border-violet-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                Confirm Transaction
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Transaction Details */}
                        {!txHash ? (
                            <div className="space-y-4">
                                <div className="bg-violet-900/20 p-4 rounded-xl border border-violet-500/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm">Action</span>
                                        <span className="text-white font-semibold uppercase">{intent.action}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm">Amount</span>
                                        <span className="text-2xl font-bold text-violet-300">
                                            {intent.amount} {intent.asset}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Chain</span>
                                        <span className="text-white bg-slate-800 px-2 py-1 rounded text-xs">
                                            {intent.chain || 'Ethereum'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider">Recipient</label>
                                    <div className="bg-black/40 p-3 rounded-lg font-mono text-sm text-gray-300 break-all border border-white/5">
                                        {intent.to_address}
                                    </div>
                                </div>

                                {/* Risk Flags */}
                                {intent.risk_flags.length > 0 && (
                                    <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-400 mb-1">
                                            <AlertTriangle size={16} />
                                            <span className="text-sm font-semibold">Security Warning</span>
                                        </div>
                                        <ul className="list-disc list-inside text-xs text-red-300">
                                            {intent.risk_flags.map((flag, idx) => (
                                                <li key={idx}>{flag}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Estimated Gas (Static for now) */}
                                <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                                    <span className="text-gray-500">Estimated Gas</span>
                                    <span className="text-gray-400">~0.00042 ETH ($1.50)</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 px-4 rounded-xl bg-transparent border border-gray-600 text-gray-300 font-medium hover:bg-gray-800 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isProcessing}
                                        className="flex-1 py-3 px-4 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isProcessing ? 'Signing...' : 'Confirm in Wallet'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-green-500/20 p-4 rounded-full text-green-400">
                                        <CheckCircle size={48} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Transaction Sent!</h3>
                                <p className="text-gray-400 mb-6 text-sm">
                                    Your transaction has been broadcast to the network.
                                </p>

                                <a
                                    href={`https://etherscan.io/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm mb-6"
                                >
                                    View on Explorer <ExternalLink size={14} />
                                </a>

                                <button
                                    onClick={onClose}
                                    className="w-full py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TransactionModal;
