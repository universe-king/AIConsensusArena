"use client";

export default function LeaderboardCard({
    rank,
    user,
}) {
    return (
        <div
            className="
                p-6
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-950
                flex
                justify-between
                items-center
            "
        >

            <div>

                <div
                    className="
                        text-2xl
                        font-black
                    "
                >
                    #{rank}
                </div>

                <div
                    className="
                        text-zinc-400
                        mt-2
                    "
                >
                    {user.address?.slice(
                        0,
                        8
                    )}
                    ...
                    {user.address?.slice(
                        -4
                    )}
                </div>

            </div>

            <div className="text-right">

                <div className="text-zinc-500">
                    Score
                </div>

                <div
                    className="
                        text-3xl
                        font-black
                        text-violet-400
                    "
                >
                    {user.score}
                </div>

                <div
                    className="
                        text-sm
                        text-zinc-500
                        mt-1
                    "
                >
                    Votes:
                    {" "}
                    {user.votes}
                </div>

            </div>

        </div>
    );
}