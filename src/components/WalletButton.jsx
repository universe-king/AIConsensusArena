"use client";

import { Wallet, LogOut } from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { connectWallet } from "@/services/contract";

export default function WalletButton() {
    const {
        address,
        setAddress,
        disconnectWallet,
    } = useWallet();

    async function handleConnect() {
        try {
            const wallet =
                await connectWallet();

            setAddress(wallet.address);

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    function handleDisconnect() {
        disconnectWallet();
    }

    if (address) {
        return (
            <button
                onClick={handleDisconnect}
                className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    bg-zinc-900
                    border
                    border-zinc-800
                    hover:border-red-500
                    transition
                "
            >
                <Wallet size={16} />

                <span>
                    {address.slice(0, 6)}
                    ...
                    {address.slice(-4)}
                </span>

                <LogOut size={16} />
            </button>
        );
    }

    return (
        <button
            onClick={handleConnect}
            className="
                flex
                items-center
                gap-2
                px-5
                py-2
                rounded-xl
                bg-violet-600
                hover:bg-violet-500
                transition
                font-semibold
            "
        >
            <Wallet size={18} />
            Connect Wallet
        </button>
    );
}