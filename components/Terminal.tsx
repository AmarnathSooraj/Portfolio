"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BOOT_SEQUENCE } from "@/data/boot";
import { COMMANDS } from "@/data/commands";
import { TERMINAL_CONFIG } from "@/data/config";
import type { Line } from "@/data/types";
import ContactForm from "./ContactForm";
import GithubContributions from "./GithubContributions";

type HistoryEntry = {
  command: string;
  output: Line[];
};

function renderText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith("http")
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#ff69b4]">{part}</a>
      : part
  );
}

function processCommand(input: string): Line[] {
  const cmd = input.toLowerCase().trim().split(/\s+/)[0];
  if (!cmd) return [];

  if (cmd === "date") {
    return [{ text: new Date().toLocaleDateString(), type: "output" }];
  }

  if (cmd === "contact") {
    return [{ text: "", type: "form" }];
  }

  if (cmd === "github") {
    return [{ text: "", type: "github" }];
  }

  const output = COMMANDS[cmd];
  if (!output) {
    return [
      { text: `command not found: ${cmd}`, type: "error" },
      { text: "Type 'help' for available commands.", type: "system" },
    ];
  }

  if (typeof output === "string") {
    return [{ text: output, type: "output" }];
  }
  return output.map((line) => ({ text: line, type: "output" as const }));
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bootLines, setBootLines] = useState<Line[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleString());
    const timer = setInterval(() => {
      setCurrentDate(new Date().toLocaleString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        const line = BOOT_SEQUENCE[i];
        if (line) {
          setBootLines((prev) => [...prev, line]);
        }
        i++;
      } else {
        clearInterval(interval);
        setBootDone(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, bootLines]);

  const executeCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      if (trimmed === "clear") {
        setHistory([]);
        setCurrentInput("");
        setHistoryIndex(-1);
        return;
      }

      const output = processCommand(trimmed);
      setHistory((prev) => [...prev, { command: trimmed, output }]);
      setInputHistory((prev) => [...prev, trimmed]);
      setCurrentInput("");
      setHistoryIndex(-1);
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length === 0) return;
      const newIndex =
        historyIndex === -1
          ? inputHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setCurrentInput(inputHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= inputHistory.length) {
        setHistoryIndex(-1);
        setCurrentInput("");
      } else {
        setHistoryIndex(newIndex);
        setCurrentInput(inputHistory[newIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = currentInput.trim().toLowerCase();
      if (!partial) return;
      const matches = Object.keys(COMMANDS).filter((c) =>
        c.startsWith(partial)
      );
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      } else if (matches.length > 1) {
        const entries: HistoryEntry = {
          command: currentInput,
          output: [{ text: matches.join("  "), type: "system" }],
        };
        setHistory((prev) => [...prev, entries]);
      }
    }
  };

  const { title, version, promptUser, promptHost } = TERMINAL_CONFIG;

  return (
    <div
      className="w-full max-w-6xl mx-auto border border-[#333] rounded-lg overflow-hidden shadow-2xl shadow-[#00ff41]/5"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a2e] border-b border-[#333] select-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex-1 text-center hidden sm:block">
          <span
            className="text-sm text-[#aaa] tracking-wider"
            style={{ fontFamily: "var(--font-terminal)" }}
          >
            {title}
          </span>
        </div>
        <div
          className="flex items-center gap-2 text-xs ml-auto"
          style={{ fontFamily: "var(--font-terminal)" }}
        >
          <a
            href="https://github.com/AmarnathSooraj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff69b4] hover:text-white transition-colors"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/amarnathps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff69b4] hover:text-white transition-colors"
            title="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/amarnathsooraj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff69b4] hover:text-white transition-colors"
            title="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <span className="text-[#555]">|</span>
          <a
            href="/amarnathps_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff41] hover:text-white transition-colors no-underline px-2 py-0.5 text-xs sm:text-sm border border-[#00ff41]/40 hover:border-[#00ff41] rounded"
          >
            resume
          </a>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="h-[85vh] min-h-[500px] max-h-[900px] overflow-y-auto p-4 bg-[#0a0a0a] terminal-scrollbar"
        style={{ fontFamily: "var(--font-terminal)" }}
      >
        {bootLines.filter(Boolean).map((line, i) => (
          <div
            key={`boot-${i}`}
            className={`whitespace-pre-wrap ${
              line.type === "ascii"
                ? "text-[#00ff41]"
                : line.type === "system"
                  ? "text-[#66b3ff]"
                  : line.type === "error"
                    ? "text-[#ff3355]"
                    : "text-[#ff69b4]"
            }`}
            style={{
              fontSize: line.type === "ascii" ? "clamp(2.25rem,10vw,4rem)" : "clamp(0.8125rem,2.5vw,1.125rem)",
              lineHeight: line.type === "ascii" ? "1.2" : "1.5",
            }}
          >
            {renderText(line.text || "\u00A0")}
          </div>
        ))}

        {history.map((entry, i) => (
          <div key={`cmd-${i}`}>
            <div className="flex items-baseline gap-2">
              <span
                className="text-[#ff69b4] shrink-0"
                style={{ fontSize: "clamp(0.8125rem,2.5vw,1.125rem)" }}
              >
                <span className="text-[#66ff99]">{promptUser}</span>
                <span className="text-[#666]">@</span>
                <span className="text-[#ffb347]">{promptHost}</span>
                <span className="text-[#666]">:~$</span>
              </span>
              <span className="text-white" style={{ fontSize: "clamp(0.8125rem,2.5vw,1.125rem)" }}>
                {entry.command}
              </span>
            </div>
            {entry.output.map((line, j) => (
              line.type === "form" ? (
                <ContactForm key={`form-${i}-${j}`} />
              ) : line.type === "github" ? (
                <GithubContributions key={`github-${i}-${j}`} />
              ) : (
              <div
                key={`out-${i}-${j}`}
                className={`whitespace-pre-wrap ${
                  line.type === "ascii"
                    ? "text-[#00ff41]"
                    : line.type === "error"
                      ? "text-[#ff3355]"
                      : line.type === "system"
                        ? "text-[#66b3ff]"
                        : "text-[#ff69b4]"
                }`}
                style={{
                  fontSize: line.type === "ascii" ? "clamp(2.25rem,10vw,4rem)" : "clamp(0.8125rem,2.5vw,1.125rem)",
                  lineHeight: line.type === "ascii" ? "1.2" : "1.5",
                }}
              >
                {renderText(line.text || "\u00A0")}
              </div>
              )
            ))}
          </div>
        ))}

        {bootDone && (
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className="text-[#ff69b4] shrink-0 whitespace-nowrap"
              style={{ fontSize: "1.125rem" }}
            >
              <span className="text-[#66ff99]">{promptUser}</span>
              <span className="text-[#555]">@</span>
              <span className="text-[#ffb347]">{promptHost}</span>
              <span className="text-[#555]">:~$</span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white caret-[#00ff41]"
              style={{
                fontSize: "clamp(0.8125rem,2.5vw,1.125rem)",
                fontFamily: "var(--font-terminal)",
              }}
              spellCheck={false}
              autoComplete="off"
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-1.5 bg-[#111] border-t border-[#333] text-[10px] text-[#666] select-none">
        <span>{version}</span>
        <span>{currentDate}</span>
      </div>
    </div>
  );
}
