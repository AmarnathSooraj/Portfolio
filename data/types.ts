export type Line = {
  text: string;
  type: "output" | "system" | "error" | "ascii" | "form" | "github";
};
