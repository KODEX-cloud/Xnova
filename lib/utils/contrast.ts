/**
 * Returns '#FFFFFF' or '#111827' for maximum readability on the given bg hex color.
 * Uses the WCAG relative luminance formula.
 */
export function getContrastColor(hex: string): "#FFFFFF" | "#111827" {
  const clean = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // WCAG luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#111827" : "#FFFFFF";
}

/** Returns true if the hex color is "light" (luminance > 0.5). */
export function isLightColor(hex: string): boolean {
  return getContrastColor(hex) === "#111827";
}
