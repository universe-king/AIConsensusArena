"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTopic } from "@/hooks/useTopic";
import { useTopicVotes } from "@/hooks/useTopicVotes";
import { vote } from "@/services/contract";

export default function TopicPage() {
    const params = useParams();

    const {
        topic,
        loading,
    } = useTopic(params.id);

    const {
        votes,
        loading: votesLoading,
        refresh,
    } = useTopicVotes(params.id);

    const [reason, setReason] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    async function submitVote(choice) {
        try {
            if (!reason.trim()) {
                alert("Please enter a reason");
                return;
            }

            setSubmitting(true);

            await vote(
                Number(topic.id),
                choice,
                reason
            );

            alert(
                "Vote submitted successfully"
            );

            setReason("");

            setTimeout(async () => {
                await refresh();
            }, 5000);

        } catch (err) {
            console.error(err);

            alert(
                err?.message ||
                "Vote failed"
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white p-10">
                Loading...
            </main>
        );
    }

    if (!topic) {
        return (
            <main className="min-h-screen bg-black text-white p-10">
                Topic Not Found
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="max-w-5xl mx-auto px-6 py-16">

                <div className="text-violet-400 uppercase">
                    {topic.category}
                </div>

                <h1 className="text-5xl font-black mt-4">
                    {topic.question}
                </h1>

                {topic.resolved && (
                    <div
                        className="
                            mt-6
                            p-5
                            rounded-2xl
                            border
                            border-green-600
                            bg-green-900/20
                        "
                    >
                        <div className="text-green-400 text-sm">
                            Debate Resolved
                        </div>

                        <div className="text-3xl font-black mt-2">
                            Winner: {topic.winner}
                        </div>
                    </div>
                )}

                <div className="mt-10 grid md:grid-cols-2 gap-6">

                    <div className="p-8 rounded-3xl border border-green-600 bg-zinc-950">
                        <div className="text-zinc-500">
                            Option A
                        </div>

                        <div className="text-2xl font-bold mt-2">
                            {topic.option_a}
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl border border-blue-600 bg-zinc-950">
                        <div className="text-zinc-500">
                            Option B
                        </div>

                        <div className="text-2xl font-bold mt-2">
                            {topic.option_b}
                        </div>
                    </div>

                </div>

                <div className="mt-12">

                    <div className="text-zinc-400 mb-3">
                        Why do you support this side?
                    </div>

                    <textarea
                        value={reason}
                        onChange={(e) =>
                            setReason(e.target.value)
                        }
                        maxLength={100}
                        placeholder="Explain your reasoning..."
                        className="
                            w-full
                            h-36
                            rounded-2xl
                            bg-zinc-950
                            border
                            border-zinc-800
                            p-4
                            outline-none
                        "
                    />

                    <div className="mt-6 flex gap-4">

                        <button
                            disabled={
                                submitting ||
                                topic.resolved
                            }
                            onClick={() =>
                                submitVote("A")
                            }
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-green-600
                                hover:bg-green-500
                                disabled:opacity-50
                            "
                        >
                            {submitting
                                ? "Submitting..."
                                : "Vote A"}
                        </button>

                        <button
                            disabled={
                                submitting ||
                                topic.resolved
                            }
                            onClick={() =>
                                submitVote("B")
                            }
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-500
                                disabled:opacity-50
                            "
                        >
                            {submitting
                                ? "Submitting..."
                                : "Vote B"}
                        </button>

                    </div>

                </div>

                <div className="mt-20">

                    <h2 className="text-3xl font-black mb-8">
                        Vote History
                    </h2>

                    {votesLoading && (
                        <div className="text-zinc-500">
                            Loading votes...
                        </div>
                    )}

                    {!votesLoading &&
                        votes.length === 0 && (
                            <div className="text-zinc-500">
                                No votes yet
                            </div>
                        )}

                    <div className="space-y-4">

                        {votes.map(
                            (
                                voteItem,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="
                                        p-5
                                        rounded-2xl
                                        border
                                        border-zinc-800
                                        bg-zinc-950
                                    "
                                >
                                    <div className="text-sm text-zinc-500">
                                        {voteItem.voter?.slice(
                                            0,
                                            6
                                        )}
                                        ...
                                        {voteItem.voter?.slice(
                                            -4
                                        )}
                                    </div>

                                    <div className="mt-2">
                                        Choice:
                                        <span className="ml-2 font-bold">
                                            {voteItem.choice}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-zinc-300">
                                        {voteItem.reason}
                                    </div>

                                    <div className="mt-3 text-violet-400">
                                        Score: {voteItem.score}
                                    </div>
                                </div>
                            )
                        )}

                    </div>

                </div>

            </div>
        </main>
    );
}