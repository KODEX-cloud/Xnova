import { Fragment } from "react";
import { prisma } from "@/lib/prisma";
import { getContrastColor } from "@/lib/utils/contrast";
import { DESIGN_KEYS } from "@/lib/design-keys";

export default async function DynamicStyles() {
  let settings: Record<string, string> = {};
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: DESIGN_KEYS } },
    });
    rows.forEach((r) => {
      settings[r.key.replace("design.", "")] = r.value || "";
    });
  } catch {
    // DB not ready — use defaults
  }

  // ── Token resolution with smart fallbacks ────────────────────────────────

  const primary   = settings.colorPrimary   || "#F97316";
  const secondary = settings.colorSecondary || "#FB923C";
  const accent    = settings.colorAccent    || "#FBBF24";
  const text      = settings.colorText      || "#1F2937";
  const bg        = settings.colorBg        || "#FFFFFF";
  const heading   = settings.colorHeading   || "#111827";
  const sectionAlt = settings.colorSectionAlt || "#F9FAFB";
  const radius    = settings.borderRadius   || "12px";
  const font      = settings.fontFamily     || "'Inter', sans-serif";
  const shadowStr = settings.shadowStrength || "medium";

  // Buttons — fall back to primary if not customised
  const btn        = settings.colorButton     || primary;
  const btnText    = settings.colorButtonText || getContrastColor(btn);
  const btnHover   = settings.colorButtonHover || secondary;

  // Cards
  const card       = settings.colorCard       || bg;
  const cardBorder = settings.colorCardBorder || "#E5E7EB";

  // Navigation
  const navBg   = settings.colorNavBg   || "#FFFFFF";
  const navText = settings.colorNavText || "#1F2937";
  const navHover = settings.colorNavHover || primary;

  // Footer
  const footerBg      = settings.colorFooterBg      || "#F9FAFB";
  const footerText    = settings.colorFooterText    || "#6B7280";
  const footerHeading = settings.colorFooterHeading || "#1F2937";
  const footerHover   = settings.colorFooterHover   || primary;

  // Hero, Overlays & Spacing
  const heroStyle     = settings.heroStyle          || "gradient";
  const overlayOpacity = settings.overlayOpacity     || "30";
  const spacingMain   = settings.spacingMain        || "80px";

  // Auto-contrast helpers (server-computed)
  const onPrimary   = getContrastColor(primary);
  const onSecondary = getContrastColor(secondary);
  const onBg        = getContrastColor(bg);
  const onCard      = getContrastColor(card);
  const onNav       = getContrastColor(navBg);
  const onBtn       = getContrastColor(btn);
  const onFooter    = getContrastColor(footerBg);
  const onSectionAlt = getContrastColor(sectionAlt);

  const defaultTheme    = settings.defaultTheme    || "light";
  const animationsEnabled = settings.animationsEnabled !== "false";

  const shadowMap: Record<string, string> = {
    none:   "none",
    light:  "0 2px 8px rgba(0,0,0,0.06)",
    medium: "0 4px 20px rgba(0,0,0,0.10)",
    heavy:  "0 8px 40px rgba(0,0,0,0.18)",
  };
  const shadow = shadowMap[shadowStr] || shadowMap.medium;

  const css = `
:root {
  /* ── Brand ──────────────────────────────── */
  --nova-primary:      ${primary};
  --nova-secondary:    ${secondary};
  --nova-accent:       ${accent};

  /* ── Text & Backgrounds ─────────────────── */
  --nova-text:         ${text};
  --nova-heading:      ${heading};
  --nova-bg:           ${bg};
  --nova-section-alt:  ${sectionAlt};

  /* ── Buttons ────────────────────────────── */
  --nova-btn:          ${btn};
  --nova-btn-text:     ${btnText};
  --nova-btn-hover:    ${btnHover};

  /* ── Cards ──────────────────────────────── */
  --nova-card:         ${card};
  --nova-card-border:  ${cardBorder};
  --nova-shadow:       ${shadow};

  /* ── Navigation ─────────────────────────── */
  --nova-nav-bg:       ${navBg};
  --nova-nav-text:     ${navText};
  --nova-nav-hover:    ${navHover};

  /* ── Footer ─────────────────────────────── */
  --nova-footer-bg:      ${footerBg};
  --nova-footer-text:    ${footerText};
  --nova-footer-heading: ${footerHeading};
  --nova-footer-hover:   ${footerHover};

  /* ── Hero Style & Overlays ───────────────── */
  --nova-hero-style:     ${heroStyle};
  --nova-overlay-opacity: ${Number(overlayOpacity) / 100};

  /* ── Spacing ─────────────────────────────── */
  --nova-spacing-main:   ${spacingMain};

  /* ── Shape & Font ───────────────────────── */
  --nova-radius:       ${radius};
  --nova-font:         ${font};

  /* ── Auto-contrast helpers ──────────────── */
  --nova-on-primary:   ${onPrimary};
  --nova-on-secondary: ${onSecondary};
  --nova-on-bg:        ${onBg};
  --nova-on-card:      ${onCard};
  --nova-on-nav:       ${onNav};
  --nova-on-btn:       ${onBtn};
  --nova-on-footer:    ${onFooter};
  --nova-on-section-alt: ${onSectionAlt};
}


/* ── CRITICAL: Body background & text ────────────────────────────────────── */
body {
  background-color: var(--nova-bg) !important;
  color:            var(--nova-text) !important;
  font-family:      var(--nova-font) !important;
}

/* ── PREMIUM LIGHT THEME FOR ADMIN BACKEND ────────────────────────────────── */
.admin-shell {
  background-color: #F3F4F6 !important;
  color: #1F2937 !important;
}

/* Base text elements */
.admin-shell p {
  color: #4B5563 !important;
}
.admin-shell label {
  color: #374151 !important;
}

/* Headings in light admin shell */
.admin-shell h1, .admin-shell h2, .admin-shell h3,
.admin-shell h4, .admin-shell h5, .admin-shell h6 {
  color: #111827 !important;
}

/* Sidebar styling override */
.admin-shell aside {
  background-color: #FFFFFF !important;
  border-right: 1px solid #E5E7EB !important;
}
.admin-shell aside p {
  color: #9CA3AF !important; /* Sidebar sections */
}
.admin-shell aside a, .admin-shell aside button {
  color: #4B5563 !important;
}
.admin-shell aside a:hover, .admin-shell aside button:hover {
  background-color: #F3F4F6 !important;
  color: #111827 !important;
}
.admin-shell aside a[class*="bg-nova-red/15"] {
  background-color: rgba(249, 115, 22, 0.08) !important;
  color: var(--nova-primary) !important;
}
.admin-shell aside div, .admin-shell aside nav {
  border-color: #E5E7EB !important;
}

/* Header styling override */
.admin-shell header {
  background-color: #FFFFFF !important;
  border-bottom: 1px solid #E5E7EB !important;
}
.admin-shell header span, .admin-shell header button {
  color: #4B5563 !important;
}
.admin-shell header span[class*="text-white"] {
  color: #111827 !important;
}
.admin-shell header div[class*="border-white/10"],
.admin-shell header div[class*="border-l"] {
  border-color: #E5E7EB !important;
}

/* Forms - fields styling */
.admin-shell input[type="text"],
.admin-shell input[type="number"],
.admin-shell input[type="email"],
.admin-shell input[type="password"],
.admin-shell select,
.admin-shell textarea {
  background-color: #FFFFFF !important;
  border: 1px solid #D1D5DB !important;
  color: #111827 !important;
}
.admin-shell input[type="text"]:focus,
.admin-shell input[type="number"]:focus,
.admin-shell select:focus,
.admin-shell textarea:focus {
  border-color: var(--nova-primary) !important;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--nova-primary) 20%, transparent) !important;
}
.admin-shell input::placeholder,
.admin-shell textarea::placeholder {
  color: #9CA3AF !important;
}

/* Hardcoded dark cards bg-[#111827] and bg-white/[0.02] rewritten to light card panels */
.admin-shell .bg-\[\#111827\],
.admin-shell div[class*="bg-[#111827]"],
.admin-shell .bg-white\/\[0\.02\],
.admin-shell .bg-white\/\[0\.03\],
.admin-shell .bg-white\/5,
.admin-shell div[class*="bg-white/5"] {
  background-color: #FFFFFF !important;
  border-color: #E5E7EB !important;
}
.admin-shell div[class*="bg-[#111827]"] {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02) !important;
  border: 1px solid #E5E7EB !important;
  border-radius: var(--nova-radius) !important;
}

/* Borders globally */
.admin-shell *[class*="border-white/5"],
.admin-shell *[class*="border-white/10"],
.admin-shell *[class*="border-white/15"],
.admin-shell *[class*="border-b"],
.admin-shell *[class*="border-t"] {
  border-color: #E5E7EB !important;
}

/* Hardcoded white text overrides in cards and details */
.admin-shell div[class*="text-white"],
.admin-shell span[class*="text-white"],
.admin-shell p[class*="text-white"],
.admin-shell button[class*="text-white"] {
  color: #1F2937 !important;
}
/* Allow red text, warnings, green and brand colors to pass through */
.admin-shell .text-nova-red,
.admin-shell .text-red-400,
.admin-shell .text-green-400,
.admin-shell button[class*="bg-nova-red"] * {
  color: inherit !important;
}
/* Ensure the standard button text color remains light (white on red button) */
.admin-shell button[class*="bg-nova-red"],
.admin-shell a[class*="bg-nova-red"],
.admin-shell label[class*="bg-nova-red"] {
  color: #FFFFFF !important;
}
.admin-shell button[class*="bg-nova-red"] *,
.admin-shell a[class*="bg-nova-red"] * {
  color: #FFFFFF !important;
}

/* Tables in admin */
.admin-shell table {
  background-color: #FFFFFF !important;
}
.admin-shell table th {
  background-color: #F9FAFB !important;
  color: #374151 !important;
  border-bottom: 1px solid #E5E7EB !important;
}
.admin-shell table td {
  border-bottom: 1px solid #E5E7EB !important;
  color: #4B5563 !important;
}
.admin-shell table tr:hover {
  background-color: #F9FAFB !important;
}
.admin-shell table span, .admin-shell table p {
  color: inherit !important;
}

/* Specific details fixes */
.admin-shell p[class*="text-white/40"],
.admin-shell p[class*="text-white/30"],
.admin-shell p[class*="text-white/20"] {
  color: #9CA3AF !important;
}
.admin-shell span[class*="text-white/"] {
  color: #6B7280 !important;
}
.admin-shell div[class*="bg-white/10"],
.admin-shell button[class*="bg-white/5"] {
  background-color: #F3F4F6 !important;
  border-color: #E5E7EB !important;
}
.admin-shell button[class*="bg-white/5"]:hover {
  background-color: #E5E7EB !important;
}
.admin-shell select option {
  background-color: #FFFFFF !important;
  color: #111827 !important;
}

/* Admin headings stay white */
.admin-shell h1, .admin-shell h2, .admin-shell h3,
.admin-shell h4, .admin-shell h5, .admin-shell h6 {
  color: inherit !important;
}

/* ── Headings ─────────────────────────────────────────────────────────────── */
h1, h2, h3, h4, h5, h6 {
  color: var(--nova-heading) !important;
}
/* Admin headings stay white */
.admin-shell h1, .admin-shell h2, .admin-shell h3,
.admin-shell h4, .admin-shell h5, .admin-shell h6 {
  color: inherit !important;
}

/* ── Primary (nova-red) overrides ─────────────────────────────────────────── */
.bg-nova-red                   { background-color: var(--nova-primary)   !important; }
.text-nova-red                 { color:            var(--nova-primary)   !important; }
.border-nova-red               { border-color:     var(--nova-primary)   !important; }
.from-nova-red                 { --tw-gradient-from: var(--nova-primary) !important; }
.to-nova-red                   { --tw-gradient-to:   var(--nova-primary) !important; }
.hover\\:bg-nova-red:hover     { background-color: var(--nova-primary)   !important; }
.hover\\:text-nova-red:hover   { color:            var(--nova-primary)   !important; }
.hover\\:border-nova-red:hover { border-color:     var(--nova-primary)   !important; }
.shadow-nova-red\\/30          { --tw-shadow-color: color-mix(in srgb, var(--nova-primary) 30%, transparent) !important; }
.ring-nova-red\\/50            { --tw-ring-color: color-mix(in srgb, var(--nova-primary) 50%, transparent) !important; }

/* ── Secondary (nova-orange) overrides ───────────────────────────────────── */
.bg-nova-orange                { background-color: var(--nova-secondary)  !important; }
.text-nova-orange              { color:            var(--nova-secondary)  !important; }
.border-nova-orange            { border-color:     var(--nova-secondary)  !important; }
.from-nova-orange              { --tw-gradient-from: var(--nova-secondary) !important; }
.to-nova-orange                { --tw-gradient-to:   var(--nova-secondary) !important; }
.hover\\:text-nova-orange:hover { color:           var(--nova-secondary)  !important; }

/* ── Accent ───────────────────────────────────────────────────────────────── */
.text-nova-yellow              { color:            var(--nova-accent) !important; }
.bg-nova-yellow                { background-color: var(--nova-accent) !important; }

/* ── Gradient text ────────────────────────────────────────────────────────── */
.gradient-text-nova {
  background: linear-gradient(135deg, var(--nova-primary), var(--nova-secondary), var(--nova-accent)) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

/* ── Section label pill ───────────────────────────────────────────────────── */
.section-label {
  background-color: color-mix(in srgb, var(--nova-primary) 10%, transparent) !important;
  color:            var(--nova-primary) !important;
  border-color:     color-mix(in srgb, var(--nova-primary) 20%, transparent) !important;
}

/* ── Orange-tinted helpers (shift with primary color) ─────────────────────── */
.bg-orange-50        { background-color: color-mix(in srgb, var(--nova-primary) 6%,  white) !important; }
.bg-orange-100       { background-color: color-mix(in srgb, var(--nova-primary) 12%, white) !important; }
.hover\\:bg-orange-50:hover  { background-color: color-mix(in srgb, var(--nova-primary) 6%,  white) !important; }
.hover\\:bg-orange-100:hover { background-color: color-mix(in srgb, var(--nova-primary) 12%, white) !important; }
.border-orange-200   { border-color: color-mix(in srgb, var(--nova-primary) 20%, white) !important; }
.text-orange-600     { color: color-mix(in srgb, var(--nova-primary) 90%, black) !important; }
.bg-nova-red\\/10   { background-color: color-mix(in srgb, var(--nova-primary) 10%, transparent) !important; }
.bg-nova-red\\/15   { background-color: color-mix(in srgb, var(--nova-primary) 15%, transparent) !important; }

/* ── Navigation dynamic colors ────────────────────────────────────────────── */
.nova-nav {
  background-color: var(--nova-nav-bg) !important;
}
.nova-nav a, .nova-nav button {
  color: var(--nova-nav-text) !important;
}
.nova-nav a:hover, .nova-nav button:hover {
  color: var(--nova-nav-hover) !important;
}

/* ── Button dynamic colors ────────────────────────────────────────────────── */
.nova-btn {
  background-color: var(--nova-btn) !important;
  color:            var(--nova-btn-text) !important;
  border-radius:    var(--nova-radius) !important;
}
.nova-btn:hover {
  background-color: var(--nova-btn-hover) !important;
}

/* ── Card dynamic colors ──────────────────────────────────────────────────── */
.nova-card, .cms-card {
  background-color: var(--nova-card) !important;
  border-color:     var(--nova-card-border) !important;
  border-radius:    var(--nova-radius) !important;
  box-shadow:       var(--nova-shadow) !important;
}

/* ── Section alternate background ─────────────────────────────────────────── */
.bg-gray-50    { background-color: var(--nova-section-alt) !important; }
.bg-gray-100   { background-color: color-mix(in srgb, var(--nova-section-alt) 80%, #e5e7eb) !important; }

/* ── Footer dynamic colors & contrast overrides ────────────────────────────── */
footer, footer.bg-gray-50 {
  background-color: var(--nova-footer-bg) !important;
  color:            var(--nova-footer-text) !important;
  border-color:     color-mix(in srgb, var(--nova-footer-text) 15%, transparent) !important;
}
footer h3, footer h4 {
  color: var(--nova-footer-heading) !important;
}
footer a, footer p, footer span, footer div {
  color: var(--nova-footer-text) !important;
}
footer a:hover {
  color: var(--nova-footer-hover) !important;
}
footer .bg-white {
  background-color: color-mix(in srgb, var(--nova-footer-bg) 95%, black) !important;
  border-color:     color-mix(in srgb, var(--nova-footer-text) 10%, transparent) !important;
}

/* ── Hero section style & overlay dynamic overrides ────────────────────────── */
body.hero-flat canvas { display: none !important; }
body.hero-gradient canvas { display: none !important; }

body.hero-flat #hero, body.hero-flat .relative.w-full.h-screen {
  background: var(--nova-bg) !important;
}
body.hero-gradient #hero, body.hero-gradient .relative.w-full.h-screen {
  background: linear-gradient(135deg, var(--nova-bg), var(--nova-primary)15) !important;
}

/* Overlay intensity dynamic override */
.absolute.inset-0.bg-nova-darker\\/40,
.absolute.inset-0.bg-black\\/70,
.absolute.inset-0.bg-black\\/60 {
  background-color: rgba(5, 8, 15, var(--nova-overlay-opacity)) !important;
}

/* ── Spacing main vertical rhythm overrides ────────────────────────────────── */
.py-20, .lg\\:py-28 {
  padding-top:    var(--nova-spacing-main) !important;
  padding-bottom: var(--nova-spacing-main) !important;
}
.py-16 {
  padding-top:    calc(var(--nova-spacing-main) * 0.8) !important;
  padding-bottom: calc(var(--nova-spacing-main) * 0.8) !important;
}
.gap-8 {
  gap: var(--nova-spacing-main) !important;
}
.gap-6 {
  gap: calc(var(--nova-spacing-main) * 0.75) !important;
}

/* ── Auto-contrast safety overrides (prevent invisible text) ───────────────── */
.nova-card {
  color: var(--nova-on-card) !important;
}
.nova-btn {
  color: var(--nova-on-btn) !important;
}
.bg-gray-50, .bg-gray-50 p, .bg-gray-50 span, .bg-gray-50 div {
  color: var(--nova-on-section-alt) !important;
}
.bg-gray-50 h1, .bg-gray-50 h2, .bg-gray-50 h3, .bg-gray-50 h4 {
  color: var(--nova-heading) !important;
}

[style*="background-color: #fff"],
[style*="background-color: #ffffff"],
[style*="background-color: white"],
[style*="background: white"],
[style*="background: #fff"] {
  color: var(--nova-text);
}


/* ── DARK MODE ─────────────────────────────────────────────────────────────── */
html.dark {
  --nova-bg:           #0D1117;
  --nova-text:         #F3F4F6;
  --nova-heading:      #FFFFFF;
  --nova-section-alt:  #111827;
  --nova-card:         #1F2937;
  --nova-card-border:  rgba(255,255,255,0.08);
  --nova-nav-bg:       #0D1117;
  --nova-nav-text:     #F3F4F6;
  --nova-nav-hover:    var(--nova-primary);
  --nova-shadow:       0 4px 24px rgba(0,0,0,0.4);
}

html.dark body {
  background-color: #0D1117 !important;
  color: #F3F4F6 !important;
}

html.dark h1, html.dark h2, html.dark h3,
html.dark h4, html.dark h5, html.dark h6 {
  color: #FFFFFF !important;
}

html.dark .bg-white {
  background-color: #1F2937 !important;
}

html.dark .bg-gray-50 {
  background-color: #111827 !important;
}

html.dark .bg-gray-100 {
  background-color: #1F2937 !important;
}

html.dark .text-gray-900 { color: #F9FAFB !important; }
html.dark .text-gray-800 { color: #F3F4F6 !important; }
html.dark .text-gray-700 { color: #E5E7EB !important; }
html.dark .text-gray-600 { color: #D1D5DB !important; }
html.dark .text-gray-500 { color: #9CA3AF !important; }
html.dark .text-gray-400 { color: #6B7280 !important; }

html.dark .border-gray-100 { border-color: rgba(255,255,255,0.06) !important; }
html.dark .border-gray-200 { border-color: rgba(255,255,255,0.10) !important; }

html.dark .shadow-sm  { box-shadow: 0 1px 4px rgba(0,0,0,0.3)  !important; }
html.dark .shadow-md  { box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important; }
html.dark .shadow-lg  { box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important; }
html.dark .shadow-xl  { box-shadow: 0 16px 48px rgba(0,0,0,0.5) !important; }
html.dark .shadow-2xl { box-shadow: 0 24px 64px rgba(0,0,0,0.6) !important; }

/* Navbar dark */
html.dark header.fixed {
  background-color: rgba(13,17,23,0.95) !important;
  border-color: rgba(255,255,255,0.06) !important;
}

/* Cards dark */
html.dark .nova-card, html.dark .cms-card {
  background-color: #1F2937 !important;
  border-color: rgba(255,255,255,0.08) !important;
}

/* Mobile panel dark */
html.dark .bg-white.border-l {
  background-color: #111827 !important;
  border-color: rgba(255,255,255,0.06) !important;
}

/* Admin shell remains light even if page html is dark */
html.dark .admin-shell {
  background-color: #F3F4F6 !important;
  color: #1F2937 !important;
}

/* ── ANIMATIONS KILL SWITCH ────────────────────────────────────────────────── */
body.no-animations *,
body.no-animations *::before,
body.no-animations *::after {
  animation-duration: 0.001ms !important;
  animation-delay: 0ms !important;
  transition-duration: 0.001ms !important;
  transition-delay: 0ms !important;
}
`.trim();

  // Script: apply default theme if user has no preference stored yet
  const themeScript = `(function(){if(!localStorage.getItem('nova-theme')){var d=${JSON.stringify(defaultTheme)};if(d==='dark'||d==='system'){var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var apply=d==='dark'||prefersDark;document.documentElement.classList.toggle('dark',apply);document.documentElement.classList.toggle('light',!apply);}}})();`;

  // Script: apply body hero style class
  const heroScript = `(function(){document.body.className = document.body.className.replace(/\\bhero-\\w+\\b/g, '') + ' hero-${heroStyle}';})();`;

  // Script: disable animations if turned off in admin
  const animScript = animationsEnabled ? "" : `document.body.classList.add('no-animations');`;

  return (
    <Fragment>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script dangerouslySetInnerHTML={{ __html: heroScript }} />
      {!animationsEnabled && <script dangerouslySetInnerHTML={{ __html: animScript }} />}
    </Fragment>
  );
}
