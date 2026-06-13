"use client";

import { useEffect, useState } from "react";
import { getTopicVotes } from "@/services/contract";

export function useTopicVotes(topicId) {
    const [votes, setVotes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    async function loadVotes() {
        try {
            setLoading(true);

            const data =
                await getTopicVotes(
                    Number(topicId)
                );

            setVotes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (topicId !== undefined) {
            loadVotes();
        }
    }, [topicId]);

    return {
        votes,
        loading,
        refresh: loadVotes,
    };
}