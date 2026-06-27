import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "red" | "orange" | "blue" | "green" | "purple";
}

const colorMap = {
  red: "bg-nova-red/10 text-nova-red",
  orange: "bg-nova-orange/10 text-nova-orange",
  blue: "bg-blue-500/10 text-blue-400",
  green: "bg-emerald-500/10 text-emerald-400",
  purple: "bg-purple-500/10 text-purple-400",
};

export default function StatCard({ title, value, sub, icon: Icon, trend, color = "red" }: StatCardProps) {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-white/30 text-xs mt-0.5">{sub}</p>}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[color])}>
          <Icon size={18} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
          <span className={cn("text-xs font-medium", trend.value >= 0 ? "text-emerald-400" : "text-red-400")}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-white/30 text-xs">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
