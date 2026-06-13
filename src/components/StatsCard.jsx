export default function StatsCard({
    title,
    value
}) {
    return (
        <div
            className="
      rounded-3xl
      border
      border-zinc-800
      bg-zinc-950
      p-6
    "
        >
            <p className="text-zinc-500">
                {title}
            </p>

            <h2 className="
        text-4xl
        font-black
        mt-3
      ">
                {value}
            </h2>
        </div>
    );
}