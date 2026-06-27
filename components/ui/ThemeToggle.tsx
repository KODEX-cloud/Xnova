"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "full";
  className?: string;
}

export default function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, resolved, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options: { value: typeof theme; label: string; Icon: typeof Sun }[] = [
    { value: "light",  label: "Clair",    Icon: Sun },
    { value: "dark",   label: "Sombre",   Icon: Moon },
    { value: "system", label: "Système",  Icon: Monitor },
  ];

  const CurrentIcon = resolved === "dark" ? Moon : Sun;

  if (variant === "full") {
    return (
      <div className={cn("flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10", className)}>
        {options.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              theme === value
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white/70"
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Changer le thème"
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200",
          "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
          "dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5"
        )}
      >
        <CurrentIcon size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-[#1F2937] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                theme === value
                  ? "text-nova-red dark:text-nova-orange bg-orange-50 dark:bg-white/5 font-semibold"
                  : "text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
