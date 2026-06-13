"use client";

import { useEffect, useState } from "react";

import {
    getPlatformStats,
} from "@/services/contract";

export function usePlatformStats() {
    const [stats, setStats] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    async function loadStats() {
        try {
            const data =
                await getPlatformStats();

            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadStats();
    }, []);

    return {
        stats,
        loading,
        refresh: loadStats,
    };
}