/**
 * Business Migration 001 — Seed CMS defaults
 * Seeds essential SiteSetting values if not present.
 */

async function up(prisma) {
  const defaults = [
    { key: "siteName",     value: "NOVA Marketplace" },
    { key: "phone",        value: "+225 07 00 00 00 00" },
    { key: "email",        value: "contact@nova.ci" },
    { key: "address",      value: "Abidjan, Cote d Ivoire" },
    { key: "nav.logo",     value: "NOVA" },
    { key: "footer.tagline", value: "La marketplace de reference en Cote d Ivoire." },
    { key: "footer.copyright", value: "2026 NOVA Marketplace. Tous droits reserves." },
    { key: "homepage.hero.title",    value: "Trouvez votre voiture ou logement ideal" },
    { key: "homepage.hero.subtitle", value: "Des milliers d annonces verifiees pres de chez vous" },
    { key: "design.primary",         value: "#E63946" },
    { key: "design.secondary",       value: "#F4A261" },
    { key: "design.font-heading",    value: "'Inter', sans-serif" },
    { key: "design.font-body",       value: "'Inter', sans-serif" },
    { key: "design.border-radius",   value: "12px" },
  ];

  for (const { key, value } of defaults) {
    await prisma.siteSetting.upsert({
      where:  { key },
      update: {},
      create: { key, value },
    });
  }

  console.log(`  [001] Seeded ${defaults.length} CMS defaults`);
}

module.exports = { up };