"use client";

import Link from "next/link";

export default function TopicCard({
  topic
}) {
  return (
    <Link
      href={`/topic/${topic.id}`}
    >
      <div
        className="
        p-6
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950
        hover:border-violet-600
        transition
        cursor-pointer
      "
      >

        <div
          className="
          text-xs
          uppercase
          tracking-widest
          text-violet-400
        "
        >
          {topic.category}
        </div>

        <h3 className="
          mt-4
          text-xl
          font-bold
        ">
          {topic.question}
        </h3>

        <div className="mt-6">

          <div className="text-zinc-400">
            A: {topic.option_a}
          </div>

          <div className="text-zinc-400 mt-2">
            B: {topic.option_b}
          </div>

        </div>

      </div>
    </Link>
  );
}