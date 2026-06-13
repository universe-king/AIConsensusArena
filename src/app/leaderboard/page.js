"use client";

import { useEffect, useState } from "react";

import {
    getLeaderboard,
} from "@/services/contract";

import LeaderboardCard from "@/components/LeaderboardCard";

export default function LeaderboardPage() {
    const [leaders, setLeaders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data =
                    await getLeaderboard();

                setLeaders(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <main className="min-h-screen bg-black text-white">

            <div className="max-w-6xl mx-auto px-6 py-16">

                <h1 className="text-5xl font-black">
                    Leaderboard
                </h1>

                <p className="mt-4 text-zinc-400">
                    Top 10 Debate Players
                </p>

                {loading && (
                    <div className="mt-10">
                        Loading...
                    </div>
                )}

                <div className="mt-10 space-y-4">

                    {leaders.map(
                        (user, index) => (
                            <LeaderboardCard
                                key={index}
                                rank={
                                    index + 1
                                }
                                user={user}
                            />
                        )
                    )}

                </div>

            </div>

        </main>
    );
}