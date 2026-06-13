"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const WalletContext =
    createContext();

export function WalletProvider({
    children,
}) {
    const [address, setAddress] =
        useState(null);

    useEffect(() => {
        const saved =
            localStorage.getItem(
                "wallet_address"
            );

        if (saved) {
            setAddress(saved);
        }
    }, []);

    function updateAddress(addr) {
        setAddress(addr);

        if (addr) {
            localStorage.setItem(
                "wallet_address",
                addr
            );
        } else {
            localStorage.removeItem(
                "wallet_address"
            );
        }
    }

    function disconnectWallet() {
        updateAddress(null);
    }

    return (
        <WalletContext.Provider
            value={{
                address,
                setAddress:
                    updateAddress,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () =>
    useContext(WalletContext);