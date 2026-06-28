import { ABOUT } from "./about";
import { EDUCATION } from "./education";
import { ASCII_LOGO } from "./ascii";

export const COMMAND_HELP: Record<string, string> = {
  about: "About me",
  education: "Education",
  contact: "Contact information",
  whoami: "Display current user",
  date: "Show current date & time",
  clear: "Clear terminal",
  help: "Show this help",
  ls: "List directory contents",
  banner: "Show ASCII logo",
};

export const COMMANDS: Record<string, string | string[]> = {
  help: [
    "Available commands:",
    "",
    ...Object.entries(COMMAND_HELP).map(
      ([cmd, desc]) => `  ${cmd.padEnd(14)} - ${desc}`
    ),
  ],
  about: ABOUT,
  whoami: "amarnath",
  education: EDUCATION,
  contact: [],
  date: [],
  clear: [],
  ls: ["about/", "education/", "contact/"],
  banner: ASCII_LOGO,
};
