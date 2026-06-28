import { ASCII_LOGO } from "./ascii";
import type { Line } from "./types";

export const WELCOME_MSG = "Welcome to my terminal portfolio. Type 'help' to get started.";

export const BOOT_SEQUENCE: Line[] = [
  { text: "PORTFOLIO v1.0.0", type: "system" },
  { text: "Copyright (c) 2024 Amarnath", type: "system" },
  { text: "", type: "output" },
  { text: "Initializing kernel modules...", type: "system" },
  { text: "Loading user profile... OK", type: "system" },
  { text: "Establishing connection... OK", type: "system" },
  { text: "", type: "output" },
  { text: ASCII_LOGO, type: "ascii" },
  { text: "", type: "output" },
  { text: WELCOME_MSG, type: "system" },
  { text: "", type: "output" },
  { text: "Available sections:", type: "system" },
  { text: "  about     education     contact", type: "output" },
  { text: "", type: "output" },
  { text: "Type 'help' to see all commands.", type: "system" },
  { text: "", type: "output" },
];
