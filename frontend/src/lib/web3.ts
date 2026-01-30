import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export type WalletState = {
    address: string | null;
    chainId: string | null;
    isConnected: boolean;
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    error: string | null;
};

export const INITIAL_WALLET_STATE: WalletState = {
    address: null,
    chainId: null,
    isConnected: false,
    provider: null,
    signer: null,
    error: null,
};

export const connectWallet = async (): Promise<WalletState> => {
    console.log("Attempting to connect wallet...");
    if (typeof window === 'undefined') {
        console.error("Window is undefined");
        return { ...INITIAL_WALLET_STATE, error: 'Window not defined' };
    }

    if (!window.ethereum) {
        console.error("MetaMask (window.ethereum) not found");
        return { ...INITIAL_WALLET_STATE, error: 'MetaMask not installed' };
    }

    try {
        console.log("Initializing BrowserProvider...");
        const provider = new ethers.BrowserProvider(window.ethereum);

        console.log("Requesting eth_requestAccounts...");
        const accounts = await provider.send('eth_requestAccounts', []);
        console.log("Accounts received:", accounts);

        if (accounts.length === 0) {
            console.warn("No accounts found");
            return { ...INITIAL_WALLET_STATE, error: 'No account found' };
        }

        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        return {
            address,
            chainId: network.chainId.toString(),
            isConnected: true,
            provider,
            signer,
            error: null,
        };
    } catch (err: any) {
        console.error('Failed to connect wallet:', err);
        return { ...INITIAL_WALLET_STATE, error: err.message || 'Connection failed' };
    }
};

export const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
