import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NOVA database...\n");

  // ── Admin User ─────────────────────────────────────────────────────────────
  const password = await bcrypt.hash("Nova2026@Admin", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nova.ci" },
    update: {},
    create: {
      email: "admin@nova.ci",
      password,
      name: "Admin NOVA",
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(`✅ Admin créé : ${admin.email}  /  mot de passe : Nova2026@Admin`);

  // ── Site Settings ──────────────────────────────────────────────────────────
  const settings = [
    { key: "siteName",        value: "NOVA Marketplace" },
    { key: "tagline",         value: "Votre Partenaire Premium en Automobile & Immobilier en Côte d'Ivoire" },
    { key: "siteUrl",         value: "https://nova.ci" },
    { key: "heroTitle",       value: "Votre Partenaire Premium CI" },
    { key: "heroSubtitle",    value: "Découvrez les meilleures voitures et propriétés d'Abidjan. NOVA vous connecte aux offres les plus exclusives en automobile et immobilier en Côte d'Ivoire." },
    { key: "heroImage",       value: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80" },
    { key: "phone",           value: "+225 07 00 00 00 00" },
    { key: "email",           value: "contact@nova.ci" },
    { key: "address",         value: "Cocody, Abidjan, Côte d'Ivoire" },
    { key: "whatsapp",        value: "+225 07 00 00 00 00" },
    { key: "facebook",        value: "https://facebook.com/novaci" },
    { key: "instagram",       value: "https://instagram.com/nova.ci" },
    { key: "seoTitle",        value: "NOVA — Automobile & Immobilier en Côte d'Ivoire" },
    { key: "metaDescription", value: "NOVA est la marketplace #1 pour l'achat, la vente et la location de voitures et biens immobiliers en Côte d'Ivoire. Découvrez +2000 annonces à Abidjan." },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }
  console.log(`✅ ${settings.length} paramètres du site configurés`);

  // ── Automobiles ────────────────────────────────────────────────────────────
  const cars = [
    {
      title: "BMW Série 5 M Sport 2023",
      slug: "bmw-serie-5-m-sport-2023-" + Date.now(),
      brand: "BMW", model: "Série 5", year: 2023, mileage: 15000,
      price: 28500000, priceType: "SALE", fuel: "Essence",
      transmission: "Automatique", color: "Noir", condition: "USED",
      city: "Cocody", location: "Angré, Abidjan",
      images: JSON.stringify(["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"]),
      description: "Superbe BMW Série 5 M Sport en excellent état. Carrosserie impeccable, intérieur cuir, toit ouvrant, GPS intégré.",
      badge: "Premium", status: "ACTIVE", featured: true,
      seoTitle: "BMW Série 5 M Sport 2023 à vendre à Abidjan",
      metaDescription: "Achetez cette BMW Série 5 M Sport 2023 à Cocody Abidjan.",
    },
    {
      title: "Mercedes-Benz Classe C AMG 2023",
      slug: "mercedes-classe-c-amg-2023-" + (Date.now() + 1),
      brand: "Mercedes-Benz", model: "Classe C", year: 2023, mileage: 8000,
      price: 32000000, priceType: "SALE", fuel: "Essence",
      transmission: "Automatique", color: "Blanc", condition: "USED",
      city: "Plateau", location: "Plateau, Abidjan",
      images: JSON.stringify(["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80"]),
      description: "Mercedes AMG Line 2023, quasi neuve. Finition premium, système audio Burmester, caméra 360°.",
      badge: "Neuf", status: "ACTIVE", featured: true,
      seoTitle: "Mercedes Classe C AMG 2023 Abidjan",
      metaDescription: "Mercedes-Benz Classe C AMG 2023 disponible au Plateau Abidjan.",
    },
    {
      title: "Toyota Land Prado 2023",
      slug: "toyota-land-prado-2023-" + (Date.now() + 2),
      brand: "Toyota", model: "Land Prado", year: 2023, mileage: 12000,
      price: 35000000, priceType: "SALE", fuel: "Diesel",
      transmission: "Automatique", color: "Gris", condition: "USED",
      city: "Marcory", location: "Marcory, Abidjan",
      images: JSON.stringify(["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80"]),
      description: "Toyota Land Prado GX en parfait état. 7 places, 4x4, idéal pour les routes de CI.",
      badge: "4x4", status: "ACTIVE", featured: true,
      seoTitle: "Toyota Land Prado 2023 à vendre Abidjan",
      metaDescription: "Toyota Land Prado 2023 diesel automatique disponible à Marcory.",
    },
    {
      title: "Range Rover Sport HSE 2024",
      slug: "range-rover-sport-hse-2024-" + (Date.now() + 3),
      brand: "Land Rover", model: "Range Rover Sport", year: 2024, mileage: 5000,
      price: 55000000, priceType: "SALE", fuel: "Diesel",
      transmission: "Automatique", color: "Noir", condition: "USED",
      city: "Cocody", location: "Riviera 3, Cocody",
      images: JSON.stringify(["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"]),
      description: "Range Rover Sport HSE 2024, le summum du luxe SUV. Intérieur Windsor leather, panoramique.",
      badge: "Luxe", status: "ACTIVE", featured: true,
      seoTitle: "Range Rover Sport HSE 2024 Abidjan",
      metaDescription: "Range Rover Sport HSE 2024 disponible à Cocody Riviera.",
    },
    {
      title: "Porsche Cayenne GTS 2022",
      slug: "porsche-cayenne-gts-2022-" + (Date.now() + 4),
      brand: "Porsche", model: "Cayenne", year: 2022, mileage: 22000,
      price: 68000000, priceType: "SALE", fuel: "Essence",
      transmission: "Automatique", color: "Rouge", condition: "USED",
      city: "Cocody", location: "Cocody 2 Plateaux",
      images: JSON.stringify(["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"]),
      description: "Porsche Cayenne GTS V8, performances exceptionnelles. Jantes 21'', Sport Chrono.",
      badge: "Rare", status: "ACTIVE", featured: false,
      seoTitle: "Porsche Cayenne GTS 2022 Abidjan",
      metaDescription: "Porsche Cayenne GTS 2022 disponible aux 2 Plateaux Abidjan.",
    },
    {
      title: "Toyota Corolla 2022",
      slug: "toyota-corolla-2022-" + (Date.now() + 5),
      brand: "Toyota", model: "Corolla", year: 2022, mileage: 35000,
      price: 12500000, priceType: "SALE", fuel: "Essence",
      transmission: "Automatique", color: "Blanc", condition: "USED",
      city: "Yopougon", location: "Yopougon, Abidjan",
      images: JSON.stringify(["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80"]),
      description: "Toyota Corolla 2022 en très bon état. Économique, fiable, parfaite pour la ville.",
      badge: "Bon plan", status: "ACTIVE", featured: false,
      seoTitle: "Toyota Corolla 2022 Yopougon",
      metaDescription: "Toyota Corolla 2022 à vendre à Yopougon Abidjan.",
    },
    {
      title: "Mercedes Classe E Location",
      slug: "mercedes-classe-e-location-" + (Date.now() + 6),
      brand: "Mercedes-Benz", model: "Classe E", year: 2023, mileage: 45000,
      price: 150000, priceType: "RENT", fuel: "Essence",
      transmission: "Automatique", color: "Noir", condition: "USED",
      city: "Abidjan", location: "Plateau, Abidjan",
      images: JSON.stringify(["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"]),
      description: "Location Mercedes Classe E avec ou sans chauffeur. Idéal pour événements, déplacements professionnels.",
      badge: "Location", status: "ACTIVE", featured: false,
      seoTitle: "Location Mercedes Classe E Abidjan",
      metaDescription: "Louez une Mercedes Classe E à Abidjan.",
    },
  ];

  for (const car of cars) {
    await prisma.car.upsert({
      where: { slug: car.slug },
      update: {},
      create: car as any,
    });
  }
  console.log(`✅ ${cars.length} voitures créées`);

  // ── Properties ─────────────────────────────────────────────────────────────
  const properties = [
    {
      title: "Villa 5 Chambres à Cocody Riviera",
      slug: "villa-5-chambres-cocody-riviera-" + Date.now(),
      type: "VILLA", price: 180000000, priceType: "SALE",
      bedrooms: 5, bathrooms: 3, surface: 320, land: 600,
      city: "Cocody", district: "Riviera 3", location: "Riviera 3, Cocody",
      images: JSON.stringify(["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"]),
      amenities: JSON.stringify(["Piscine", "Jardin", "Garage", "Sécurité 24h", "Cuisine équipée"]),
      description: "Magnifique villa moderne 5 chambres en duplex. Piscine, jardin paysager, garage 2 voitures, sécurité 24h. Finitions haut de gamme.",
      badge: "Coup de cœur", status: "ACTIVE", featured: true,
      seoTitle: "Villa 5 chambres à Cocody Riviera — NOVA",
      metaDescription: "Villa moderne 5 chambres avec piscine à Cocody Riviera Abidjan.",
    },
    {
      title: "Appartement 3 pièces au Plateau",
      slug: "appartement-3-pieces-plateau-" + (Date.now() + 1),
      type: "APARTMENT", price: 1800000, priceType: "RENT",
      bedrooms: 3, bathrooms: 2, surface: 120, land: null,
      city: "Plateau", district: "Plateau", location: "Centre commercial, Plateau",
      images: JSON.stringify(["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]),
      amenities: JSON.stringify(["Gardien", "Ascenseur", "Parking", "Climatisation"]),
      description: "Bel appartement 3 pièces au cœur du Plateau. Vue sur la lagune, parking sécurisé, proche de tous commerces.",
      badge: "Disponible", status: "ACTIVE", featured: true,
      seoTitle: "Location appartement 3 pièces au Plateau Abidjan",
      metaDescription: "Location appartement 3 pièces 120m² au Plateau Abidjan.",
    },
    {
      title: "Terrain Viabilisé à Yopougon",
      slug: "terrain-viabilise-yopougon-" + (Date.now() + 2),
      type: "LAND", price: 25000000, priceType: "SALE",
      bedrooms: null, bathrooms: null, surface: 500, land: 500,
      city: "Yopougon", district: "Yopougon Attié", location: "Yopougon Attié",
      images: JSON.stringify(["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"]),
      amenities: JSON.stringify(["Titre foncier", "Eau", "Électricité", "Voie bitumée"]),
      description: "Terrain viabilisé 500m² avec titre foncier. Eau et électricité disponibles. Idéal construction villa.",
      badge: "TF disponible", status: "ACTIVE", featured: true,
      seoTitle: "Terrain à vendre Yopougon Abidjan",
      metaDescription: "Terrain 500m² viabilisé avec titre foncier à Yopougon Abidjan.",
    },
    {
      title: "Studio Meublé à Marcory",
      slug: "studio-meuble-marcory-" + (Date.now() + 3),
      type: "STUDIO", price: 350000, priceType: "RENT",
      bedrooms: 1, bathrooms: 1, surface: 35, land: null,
      city: "Marcory", district: "Zone 4", location: "Zone 4, Marcory",
      images: JSON.stringify(["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"]),
      amenities: JSON.stringify(["Meublé", "Climatisé", "WiFi", "Eau chaude", "Cuisine équipée"]),
      description: "Studio entièrement meublé et équipé. Climatisé, WiFi inclus, cuisine équipée, idéal pour étudiant ou professionnel.",
      badge: "Tout équipé", status: "ACTIVE", featured: true,
      seoTitle: "Location studio meublé Marcory Abidjan",
      metaDescription: "Studio meublé 35m² à Marcory Zone 4 Abidjan.",
    },
    {
      title: "Maison 4 Chambres à Cocody",
      slug: "maison-4-chambres-cocody-" + (Date.now() + 4),
      type: "HOUSE", price: 95000000, priceType: "SALE",
      bedrooms: 4, bathrooms: 2, surface: 200, land: 350,
      city: "Cocody", district: "Angré", location: "Angré, Cocody",
      images: JSON.stringify(["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"]),
      amenities: JSON.stringify(["Jardin", "Garage", "Gardien", "Groupe électrogène"]),
      description: "Belle maison 4 chambres à Angré. Jardin arboré, garage, quartier calme et sécurisé.",
      badge: "Nouveau", status: "ACTIVE", featured: true,
      seoTitle: "Maison 4 chambres à vendre Cocody Angré",
      metaDescription: "Maison 4 chambres 200m² à vendre à Angré Cocody Abidjan.",
    },
    {
      title: "Villa de Prestige à Cocody 2 Plateaux",
      slug: "villa-prestige-cocody-2-plateaux-" + (Date.now() + 5),
      type: "VILLA", price: 350000000, priceType: "SALE",
      bedrooms: 6, bathrooms: 5, surface: 500, land: 1200,
      city: "Cocody", district: "2 Plateaux", location: "Vallons 7ème tranche, 2 Plateaux",
      images: JSON.stringify(["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"]),
      amenities: JSON.stringify(["Piscine olimpique", "Salle de sport", "Home cinéma", "Dépendance", "5 garages"]),
      description: "Villa d'exception aux 2 Plateaux Vallons. Architecture contemporaine, matériaux nobles importés d'Europe.",
      badge: "Exceptionnel", status: "ACTIVE", featured: false,
      seoTitle: "Villa de prestige 2 Plateaux Cocody",
      metaDescription: "Villa de luxe 6 chambres aux 2 Plateaux Cocody Abidjan.",
    },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: prop as any,
    });
  }
  console.log(`✅ ${properties.length} biens immobiliers créés`);

  // ── Blog Posts ──────────────────────────────────────────────────────────────
  const posts = [
    {
      title: "Comment choisir sa voiture d'occasion en Côte d'Ivoire ?",
      slug: "comment-choisir-voiture-occasion-cote-ivoire-" + Date.now(),
      category: "Guide d'achat", author: "Équipe NOVA", readTime: 7, status: "PUBLISHED",
      publishedAt: new Date(),
      excerpt: "Acheter une voiture d'occasion à Abidjan peut être risqué si vous ne savez pas quoi vérifier. Voici notre guide complet.",
      content: "<h2>1. Vérifiez l'historique du véhicule</h2><p>Demandez toujours les documents du véhicule : carte grise, historique d'entretien, rapport d'inspection. Un véhicule importé doit avoir son dédouanement en règle.</p><h2>2. Faites inspecter le moteur</h2><p>Un mécanicien de confiance peut détecter des problèmes cachés. Ne négligez pas cette étape, même si le vendeur semble honnête.</p><h2>3. Testez la voiture sur route</h2><p>Un essai de 30 minutes minimum vous permettra de détecter les problèmes de direction, freinage et transmission.</p>",
      coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      tags: JSON.stringify(["voiture", "occasion", "guide", "achat"]),
      seoTitle: "Guide achat voiture occasion Côte d'Ivoire — NOVA",
      metaDescription: "Nos conseils pour acheter une voiture d'occasion en toute sécurité en Côte d'Ivoire.",
    },
    {
      title: "Investir dans l'immobilier à Abidjan : les quartiers à cibler",
      slug: "investir-immobilier-abidjan-quartiers-" + (Date.now() + 1),
      category: "Immobilier", author: "Équipe NOVA", readTime: 8, status: "PUBLISHED",
      publishedAt: new Date(),
      excerpt: "Abidjan est l'une des villes africaines avec le plus fort potentiel immobilier. Voici les quartiers où investir en 2026.",
      content: "<h2>Cocody : le quartier résidentiel par excellence</h2><p>Cocody reste le quartier le plus prisé d'Abidjan. Les prix y sont élevés mais la valorisation est garantie sur le long terme. Les zones Riviera, Angré et 2 Plateaux sont les plus recherchées.</p><h2>Plateau : le cœur des affaires</h2><p>Le Plateau concentre les bureaux et commerces haut de gamme. Les appartements y sont rares et donc très valorisés.</p><h2>Marcory et Treichville : les quartiers à fort rendement</h2><p>Ces quartiers offrent des rendements locatifs élevés avec des prix d'acquisition plus accessibles.</p>",
      coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      tags: JSON.stringify(["immobilier", "investissement", "Abidjan", "Cocody"]),
      seoTitle: "Investissement immobilier Abidjan 2026 — meilleurs quartiers",
      metaDescription: "Découvrez les meilleurs quartiers d'Abidjan pour investir dans l'immobilier en 2026.",
    },
    {
      title: "NOVA lance son service de location de chauffeurs privés",
      slug: "nova-service-chauffeur-prive-" + (Date.now() + 2),
      category: "Actualité", author: "Équipe NOVA", readTime: 3, status: "PUBLISHED",
      publishedAt: new Date(),
      excerpt: "NOVA élargit ses services avec la mise en place d'une flotte de chauffeurs professionnels disponibles 24h/24 à Abidjan.",
      content: "<p>NOVA est fière d'annoncer le lancement de son service de chauffeurs privés à Abidjan. Disponibles 24h/24 et 7j/7, nos chauffeurs professionnels vous accompagnent dans tous vos déplacements : aéroport, réunions d'affaires, événements.</p><h2>Nos véhicules</h2><p>Mercedes Classe E, BMW Série 5, Range Rover — notre flotte premium garantit votre confort et votre prestige.</p><h2>Comment réserver ?</h2><p>Réservez directement sur notre site ou contactez-nous par WhatsApp. Tarifs à la journée ou à la course.</p>",
      coverImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
      tags: JSON.stringify(["chauffeur", "location", "service", "nouveau"]),
      seoTitle: "Service chauffeur privé Abidjan — NOVA",
      metaDescription: "NOVA lance son service de chauffeurs professionnels à Abidjan.",
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post as any,
    });
  }
  console.log(`✅ ${posts.length} articles de blog créés`);

  // ── Testimonials ───────────────────────────────────────────────────────────
  const testimonials = [
    { name: "Kouadio Jean-Baptiste", role: "Directeur Commercial", company: "TechCorp CI", content: "Grâce à NOVA, j'ai trouvé ma BMW Série 5 en moins d'une semaine. Le processus est simple et les annonces sont fiables. Je recommande vivement !", rating: 5, isActive: true, order: 0, avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Aminata Coulibaly", role: "Chef de projet", company: "Orange CI", content: "J'ai acheté ma villa à Cocody via NOVA. L'équipe est très professionnelle et a su trouver exactement ce que je cherchais. Excellent service !", rating: 5, isActive: true, order: 1, avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Marc Brou", role: "Entrepreneur", company: "Brou & Associates", content: "NOVA m'a aidé à louer mes 3 studios meublés en un mois. La plateforme est moderne et attire de nombreux locataires qualifiés.", rating: 5, isActive: true, order: 2, avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Fatou Diallo", role: "Ingénieure", company: "Eranove", content: "Le service chauffeur de NOVA est exceptionnel ! Toujours ponctuel et véhicule impeccable. Mon choix pour tous mes déplacements professionnels.", rating: 5, isActive: true, order: 3, avatar: "https://i.pravatar.cc/150?img=9" },
    { name: "Yannick Aké", role: "Banquier", company: "SGBCI", content: "J'ai vendu ma Range Rover en 10 jours sur NOVA. Des acheteurs sérieux, une interface intuitive. La meilleure plateforme auto de Côte d'Ivoire.", rating: 5, isActive: true, order: 4, avatar: "https://i.pravatar.cc/150?img=7" },
  ];

  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.upsert({
      where: { id: `seed-testimonial-${i}` },
      update: {},
      create: { id: `seed-testimonial-${i}`, ...t },
    });
  }
  console.log(`✅ ${testimonials.length} témoignages créés`);

  // ── Promotions ─────────────────────────────────────────────────────────────
  await prisma.promotion.upsert({
    where: { id: "seed-promo-1" },
    update: {},
    create: {
      id: "seed-promo-1",
      title: "Offre spéciale Location",
      description: "Louez un véhicule pour 3 jours et bénéficiez du 4ème jour OFFERT. Valable sur toute notre flotte premium.",
      badge: "-25%", bgColor: "from-nova-red to-nova-orange", isActive: true, order: 0,
    },
  });
  await prisma.promotion.upsert({
    where: { id: "seed-promo-2" },
    update: {},
    create: {
      id: "seed-promo-2",
      title: "Gestion de flotte entreprise",
      description: "Confiez la gestion de votre flotte à NOVA. Tarifs préférentiels pour les entreprises de +5 véhicules.",
      badge: "Pro", bgColor: "from-blue-600 to-blue-800", isActive: true, order: 1,
    },
  });
  console.log(`✅ 2 promotions créées`);

  // ── Menu Items ─────────────────────────────────────────────────────────────
  const menuData = [
    { id: "m1", label: "Accueil",          href: "/",           order: 0, isActive: true, parentId: null },
    { id: "m2", label: "Automobile",       href: "#automobile", order: 1, isActive: true, parentId: null },
    { id: "m3", label: "Immobilier",       href: "#immobilier", order: 2, isActive: true, parentId: null },
    { id: "m4", label: "Services",         href: "#services",   order: 3, isActive: true, parentId: null },
    { id: "m5", label: "À propos de nous", href: "#about",      order: 4, isActive: true, parentId: null },
    { id: "m6", label: "Blog & Conseils",  href: "#blog",       order: 5, isActive: true, parentId: null },
    { id: "m7", label: "Contact",          href: "#contact",    order: 6, isActive: true, parentId: null },
    // Sous-menus Automobile
    { id: "m2a", label: "Vente de voitures",     href: "#vente-voitures",  order: 0, isActive: true, parentId: "m2" },
    { id: "m2b", label: "Location de voitures",  href: "#location-voiture",order: 1, isActive: true, parentId: "m2" },
    { id: "m2c", label: "Gestion de flotte",     href: "#flotte",          order: 2, isActive: true, parentId: "m2" },
    { id: "m2d", label: "Vente de pièces auto",  href: "#pieces",          order: 3, isActive: true, parentId: "m2" },
    // Sous-menus Immobilier
    { id: "m3a", label: "Vente de maisons",          href: "#vente-maisons",    order: 0, isActive: true, parentId: "m3" },
    { id: "m3b", label: "Location de maisons",       href: "#location-maisons", order: 1, isActive: true, parentId: "m3" },
    { id: "m3c", label: "Vente de terrains",         href: "#terrains",         order: 2, isActive: true, parentId: "m3" },
    { id: "m3d", label: "Location de studios meublés", href: "#studios",        order: 3, isActive: true, parentId: "m3" },
    // Sous-menus Services
    { id: "m4a", label: "Réservez un chauffeur",  href: "#chauffeur", order: 0, isActive: true, parentId: "m4" },
    { id: "m4b", label: "Réservez un véhicule",   href: "#vehicule",  order: 1, isActive: true, parentId: "m4" },
  ];

  for (const item of menuData) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
  console.log(`✅ ${menuData.length} éléments de menu créés`);

  console.log("\n🎉 Seed terminé avec succès !");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑 Connexion admin :");
  console.log("   URL      : http://localhost:3000/admin");
  console.log("   Email    : admin@nova.ci");
  console.log("   Password : Nova2026@Admin");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => { console.error("❌ Seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
