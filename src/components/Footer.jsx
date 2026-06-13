export default function Footer() {
    return (
        <footer
            className="
                mt-24
                border-t
                border-zinc-800
                py-10
            "
        >
            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    flex
                    flex-col
                    md:flex-row
                    items-center
                    justify-between
                    gap-6
                "
            >
                <div>
                    <h3 className="font-black text-xl">
                        Consensus Arena
                    </h3>

                    <p className="text-zinc-500 mt-2">
                        AI powered debate platform on GenLayer
                    </p>
                </div>

                <div className="flex gap-6">

                    <a
                        href="https://x.com/genlayer"
                        target="_blank"
                        className="text-zinc-400 hover:text-white"
                    >
                        X
                    </a>

                    <a
                        href="https://discord.com/invite/8Jm4v89VAu"
                        target="_blank"
                        className="text-zinc-400 hover:text-white"
                    >
                        Discord
                    </a>

                    <a
                        href="https://github.com/genlayerlabs"
                        target="_blank"
                        className="text-zinc-400 hover:text-white"
                    >
                        GitHub
                    </a>

                </div>
            </div>
        </footer>
    );
}