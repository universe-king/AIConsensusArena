"use client";

import { useEffect, useState } from "react";

import { useWallet } from "@/context/WalletContext";
import { getUserScore } from "@/services/contract";

export default function ProfilePage() {
    const { address } = useWallet();

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                if (!address) {
                    setLoading(false);
                    return;
                }

                const data =
                    await getUserScore(address);

                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [address]);

    const average =
        profile?.votes > 0
            ? Math.floor(
                profile.score /
                profile.votes
            )
            : 0;

    function getRank(score) {
        if (score >= 1000) {
            return {
                name: "Legend",
                icon: "👑",
                color:
                    "border-yellow-500 text-yellow-400",
            };
        }

        if (score >= 500) {
            return {
                name: "Gold",
                icon: "🥇",
                color:
                    "border-yellow-700 text-yellow-500",
            };
        }

        if (score >= 200) {
            return {
                name: "Silver",
                icon: "🥈",
                color:
                    "border-zinc-400 text-zinc-300",
            };
        }

        return {
            name: "Bronze",
            icon: "🥉",
            color:
                "border-orange-700 text-orange-400",
        };
    }

    const rank =
        getRank(
            profile?.score || 0
        );

    return (
        <main className="min-h-screen bg-black text-white">

            <div className="max-w-5xl mx-auto px-6 py-16">

                <h1 className="text-5xl font-black">
                    Profile
                </h1>

                {!address && (
                    <div className="mt-10 text-zinc-500">
                        Connect wallet first
                    </div>
                )}

                {loading && (
                    <div className="mt-10">
                        Loading...
                    </div>
                )}

                {address && profile && (
                    <>
                        <div
                            className="
                                mt-10
                                p-6
                                rounded-3xl
                                border
                                border-zinc-800
                                bg-zinc-950
                            "
                        >
                            <div className="text-zinc-500">
                                Wallet
                            </div>

                            <div className="mt-2 break-all">
                                {address}
                            </div>
                        </div>

                        <div
                            className={`
                                mt-8
                                p-6
                                rounded-3xl
                                border
                                bg-zinc-950
                                ${rank.color}
                            `}
                        >
                            <div className="text-zinc-500">
                                Rank
                            </div>

                            <div className="mt-3 text-4xl font-black">
                                {rank.icon} {rank.name}
                            </div>
                        </div>

                        <div
                            className="
                                mt-8
                                grid
                                md:grid-cols-3
                                gap-6
                            "
                        >

                            <div
                                className="
                                    p-6
                                    rounded-3xl
                                    border
                                    border-zinc-800
                                    bg-zinc-950
                                "
                            >
                                <div className="text-zinc-500">
                                    Total Score
                                </div>

                                <div className="text-4xl font-black mt-3">
                                    {profile.score}
                                </div>
                            </div>

                            <div
                                className="
                                    p-6
                                    rounded-3xl
                                    border
                                    border-zinc-800
                                    bg-zinc-950
                                "
                            >
                                <div className="text-zinc-500">
                                    Votes
                                </div>

                                <div className="text-4xl font-black mt-3">
                                    {profile.votes}
                                </div>
                            </div>

                            <div
                                className="
                                    p-6
                                    rounded-3xl
                                    border
                                    border-zinc-800
                                    bg-zinc-950
                                "
                            >
                                <div className="text-zinc-500">
                                    Average
                                </div>

                                <div className="text-4xl font-black mt-3">
                                    {average}
                                </div>
                            </div>

                        </div>

                    </>
                )}

            </div>

        </main>
    );
}