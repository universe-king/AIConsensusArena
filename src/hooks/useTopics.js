"use client";

import { useEffect, useState } from "react";
import { getTopics } from "@/services/contract";

export function useTopics() {
    const [topics, setTopics] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    async function loadTopics() {
        try {
            setLoading(true);
            setError(null);

            const data =
                await getTopics();

            console.log(
                "Topics:",
                data
            );

            setTopics(data || []);
        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                "Failed to load topics"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTopics();
    }, []);

    return {
        topics,
        loading,
        error,
        refresh: loadTopics,
    };
}