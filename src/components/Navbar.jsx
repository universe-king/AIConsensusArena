"use client";

import Link from "next/link";
import WalletButton from "./WalletButton";

export default function Navbar() {
    return (
        <nav className="border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                <div>
                    <h1 className="font-black text-2xl">
                        AI Consensus Arena
                    </h1>
                </div>

                <div className="flex gap-8 text-zinc-400">
                    <Link href="/">
                        Dashboard
                    </Link>

                    <Link href="/leaderboard">
                        Leaderboard
                    </Link>

                    <Link href="/profile">
                        Profile
                    </Link>
                </div>

                <WalletButton />

            </div>
        </nav>
    );
}