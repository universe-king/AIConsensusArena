"use client";

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export async function connectWallet() {
    const provider =
        window.ethereum ||
        window.genlayer;

    if (!provider)
        throw new Error("Wallet not found");

    const accounts =
        await provider.request({
            method: "eth_requestAccounts",
        });

    const client = createClient({
        chain: studionet,
        account: accounts[0],
        provider,
    });

    return {
        client,
        address: accounts[0],
    };
}