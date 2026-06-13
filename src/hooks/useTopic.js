"use client";

import { useEffect, useState } from "react";
import { getTopics } from "@/services/contract";

export function useTopic(id) {
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const topics =
                    await getTopics();

                const found =
                    topics.find(
                        t =>
                            String(t.id) ===
                            String(id)
                    );

                setTopic(found || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    return {
        topic,
        loading,
    };
}