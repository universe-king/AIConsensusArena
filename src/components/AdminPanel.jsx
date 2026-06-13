"use client";

import { useState } from "react";
import { resolveTopic } from "@/services/contract";

export default function AdminPanel({
    onGenerate,
    loading,
}) {
    const [resolving, setResolving] =
        useState(false);

    async function handleResolve(
        topicId
    ) {
        try {
            setResolving(true);

            await resolveTopic(topicId);

            alert(
                `Topic ${topicId} resolved successfully`
            );
        } catch (err) {
            console.error(err);

            alert(
                err?.message ||
                "Resolve failed"
            );
        } finally {
            setResolving(false);
        }
    }

    return (
        <div
            className="
                mt-10
                p-6
                rounded-3xl
                border
                border-violet-700
                bg-violet-950/20
            "
        >
            <h2 className="text-2xl font-black">
                Admin Panel
            </h2>

            <p className="text-zinc-400 mt-2">
                Contract Owner Controls
            </p>

            <button
                onClick={onGenerate}
                disabled={loading}
                className="
                    mt-6
                    px-6
                    py-3
                    rounded-xl
                    bg-violet-600
                    hover:bg-violet-500
                    disabled:opacity-50
                "
            >
                {loading
                    ? "Generating..."
                    : "Generate New Round"}
            </button>

            <div className="mt-8">
                <h3 className="font-bold mb-4">
                    Resolve Topics
                </h3>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={() =>
                            handleResolve(0)
                        }
                        disabled={resolving}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-green-600
                            hover:bg-green-500
                        "
                    >
                        Resolve Topic 0
                    </button>

                    <button
                        onClick={() =>
                            handleResolve(1)
                        }
                        disabled={resolving}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-green-600
                            hover:bg-green-500
                        "
                    >
                        Resolve Topic 1
                    </button>

                    <button
                        onClick={() =>
                            handleResolve(2)
                        }
                        disabled={resolving}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-green-600
                            hover:bg-green-500
                        "
                    >
                        Resolve Topic 2
                    </button>

                    <button
                        onClick={() =>
                            handleResolve(3)
                        }
                        disabled={resolving}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-green-600
                            hover:bg-green-500
                        "
                    >
                        Resolve Topic 3
                    </button>

                    <button
                        onClick={() =>
                            handleResolve(4)
                        }
                        disabled={resolving}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-green-600
                            hover:bg-green-500
                        "
                    >
                        Resolve Topic 4
                    </button>

                </div>
            </div>

        </div>
    );
}