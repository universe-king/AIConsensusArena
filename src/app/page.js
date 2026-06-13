"use client";

import { useState } from "react";

import HeroSection from "@/components/HeroSection";
import StatsCard from "@/components/StatsCard";
import TopicCard from "@/components/TopicCard";
import LoadingTopics from "@/components/LoadingTopics";
import AdminPanel from "@/components/AdminPanel";
import Footer from "@/components/Footer";
import { useTopics } from "@/hooks/useTopics";
import { usePlatformStats } from "@/hooks/usePlatformStats";

import {
  generateRound,
} from "@/services/contract";

export default function Home() {
  const {
    topics,
    loading,
    error,
    refresh,
  } = useTopics();

  const {
    stats,
    refresh: refreshStats,
  } = usePlatformStats();

  const [generating, setGenerating] =
    useState(false);

  async function handleGenerateRound() {
    try {
      setGenerating(true);

      const before =
        topics.length;

      await generateRound();

      await refresh();

      const after =
        topics.length;

      if (after > 0) {
        alert(
          "Round generated successfully"
        );
      } else {
        alert(
          "Transaction sent but topics were not updated"
        );
      }

    } catch (err) {
      console.error(err);

      alert(
        err?.message ||
        "Generate round failed"
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-6">

        <HeroSection />

        <AdminPanel
          loading={generating}
          onGenerate={handleGenerateRound}
        />

        <section
          className="
                        grid
                        grid-cols-2
                        md:grid-cols-4
                        gap-4
                        mt-8
                    "
        >
          <StatsCard
            title="Topics"
            value={
              stats?.topics || 0
            }
          />

          <StatsCard
            title="Votes"
            value={
              stats?.votes || 0
            }
          />

          <StatsCard
            title="Round"
            value={
              stats?.round || 0
            }
          />

          <StatsCard
            title="Users"
            value={
              stats?.users || 0
            }
          />
        </section>

        <section className="mt-20">

          <h2
            className="
                            text-3xl
                            font-black
                            mb-8
                        "
          >
            Active Debates
          </h2>

          <div
            className="
                            grid
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-6
                        "
          >
            {loading &&
              [...Array(6)].map(
                (_, i) => (
                  <LoadingTopics
                    key={i}
                  />
                )
              )}

            {!loading &&
              topics.map(
                (topic) => (
                  <TopicCard
                    key={
                      topic.id
                    }
                    topic={
                      topic
                    }
                  />
                )
              )}
          </div>

          {error && (
            <div className="mt-8 text-red-500">
              Error: {error}
            </div>
          )}

        </section>

      </div>
      <Footer />
    </main>
  );
}