import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** WCAG-based contrast: returns "#FFFFFF" for dark bg, "#111827" for light bg */
export function getContrastColor(hex: string): "#FFFFFF" | "#111827" {
  const h = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const [rs, gs, bs] = [r, g, b].map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  const L = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  return L > 0.4 ? "#111827" : "#FFFFFF";
}

export function isLightColor(hex: string): boolean {
  return getContrastColor(hex) === "#111827";
}
