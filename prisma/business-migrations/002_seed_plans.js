/**
 * Business Migration 002 — Seed subscription plans config
 * Ensures plan metadata is present in SiteSetting.
 */

async function up(prisma) {
  const plans = [
    { key: "plan.FREE.name",        value: "Gratuit" },
    { key: "plan.FREE.price",       value: "0" },
    { key: "plan.FREE.maxListings", value: "3" },
    { key: "plan.STARTER.name",     value: "Starter" },
    { key: "plan.STARTER.price",    value: "9900" },
    { key: "plan.STARTER.maxListings", value: "10" },
    { key: "plan.BUSINESS.name",    value: "Business" },
    { key: "plan.BUSINESS.price",   value: "29900" },
    { key: "plan.BUSINESS.maxListings", value: "50" },
    { key: "plan.PREMIUM.name",     value: "Premium" },
    { key: "plan.PREMIUM.price",    value: "59900" },
    { key: "plan.PREMIUM.maxListings", value: "-1" },
    { key: "plan.ENTERPRISE.name",  value: "Enterprise" },
    { key: "plan.ENTERPRISE.price", value: "0" },
    { key: "plan.ENTERPRISE.maxListings", value: "-1" },
  ];

  for (const { key, value } of plans) {
    await prisma.siteSetting.upsert({
      where:  { key },
      update: {},
      create: { key, value },
    });
  }

  console.log(`  [002] Seeded ${plans.length} plan settings`);
}

module.exports = { up };