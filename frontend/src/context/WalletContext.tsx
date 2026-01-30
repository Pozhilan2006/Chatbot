"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletState, INITIAL_WALLET_STATE, connectWallet } from '@/lib/web3';
import { ethers } from 'ethers';

interface WalletContextType extends WalletState {
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET_STATE);

    const connect = async () => {
        const state = await connectWallet();
        setWallet(state);
    };

    const disconnect = () => {
        setWallet(INITIAL_WALLET_STATE);
    };

    // Auto-connect if already authorized?
    // For safety/strictness, we might require explicit button press every reload or check existing permissions.
    // Checking existing permissions provided nothing changed.
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            const ethereum = (window as any).ethereum;

            const handleAccountsChanged = async (accounts: string[]) => {
                if (accounts.length > 0) {
                    // Refresh state if account changed
                    const state = await connectWallet();
                    setWallet(state);
                } else {
                    // Disconnected
                    setWallet(INITIAL_WALLET_STATE);
                }
            };

            const handleChainChanged = () => {
                window.location.reload();
            };

            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('chainChanged', handleChainChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    ethereum.removeListener('chainChanged', handleChainChanged);
                }
            };
        }
    }, []);

    return (
        <WalletContext.Provider value={{ ...wallet, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
