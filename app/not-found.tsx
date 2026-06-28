"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const ascii =
    "  ____    _    ____  _____ \n / ___|  / \\  |  _ \\| ____|\n| |  _  / _ \\ | |_) |  _|  \n| |_| |/ ___ \\|  __/| |___ \n \\____/_/   \\_\\_|   |_____|\n\n   ____  _   _  ____  _____ \n  / ___|| \\ | |/ ___|| ____|\n | |  _ |  \\| | |  _ |  _|  \n | |_| || |\\  | |_| || |___ \n  \\____||_| \\_|\\____||_____|";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="scanlines" />
      <div
        className="w-full max-w-2xl mx-auto border border-[#333] rounded-lg overflow-hidden shadow-2xl shadow-[#00ff41]/5"
        style={{ fontFamily: "var(--font-terminal)" }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a2e] border-b border-[#333] select-none">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm text-[#aaa] tracking-wider">
              amarnath@portfolio:~
            </span>
          </div>
          <div className="w-14" />
        </div>

        <div className="p-6 sm:p-8">
          <pre className="text-[#00ff41] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight whitespace-pre text-center">
            {ascii}
          </pre>
          <div className="text-center mt-6 space-y-4">
            <p className="text-[#ff3355] text-base sm:text-lg">
              Error 404 — The page you seek does not exist in this kernel.
            </p>
            <button
              onClick={() => router.push("/")}
              className="text-[#66b3ff] text-sm underline hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              ~$ cd ~ && go home
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-1.5 bg-[#111] border-t border-[#333] text-[10px] text-[#666] select-none">
          <span>PORTFOLIO v1.0.0</span>
          <span>404 Not Found</span>
        </div>
      </div>
    </div>
  );
}
