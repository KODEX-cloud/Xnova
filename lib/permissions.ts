export const ROLE_LEVELS: Record<string, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  EDITOR: 3,
  AGENT_AUTO: 2,
  AGENT_IMMO: 1,
  USER: 0,
};

export type Role = keyof typeof ROLE_LEVELS;

export const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "Super Admin", color: "text-purple-400 bg-purple-400/10" },
  ADMIN: { label: "Administrateur", color: "text-nova-red bg-nova-red/10" },
  EDITOR: { label: "Éditeur", color: "text-blue-400 bg-blue-400/10" },
  AGENT_AUTO: { label: "Agent Auto", color: "text-orange-400 bg-orange-400/10" },
  AGENT_IMMO: { label: "Agent Immo", color: "text-emerald-400 bg-emerald-400/10" },
  USER: { label: "Utilisateur", color: "text-white/40 bg-white/5" },
};

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AGENT_AUTO", "AGENT_IMMO"];

/** Returns true if userRole has at least the permissions of minRole */
export function hasPermission(userRole: string, minRole: string): boolean {
  return (ROLE_LEVELS[userRole] ?? 0) >= (ROLE_LEVELS[minRole] ?? 0);
}

/** Check if a user can access the admin panel at all */
export function canAccessAdmin(role: string): boolean {
  return ADMIN_ROLES.includes(role);
}
