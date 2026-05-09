import {
  Key, Layers, Wrench, Home, Building2,
  Clock, Shield, Star, Truck, Headphones,
  CheckCircle, Users, BarChart3, Zap, MapPin, Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceAvantage {
  titre: string;
  texte: string;
  icon: LucideIcon;
}

export interface ServiceData {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  features: string[];
  avantages: ServiceAvantage[];
  tag: string;
  tagColor: string;
  gradient: string;
  iconBg: string;
  icon: LucideIcon;
  category: "automobile" | "immobilier";
  cta: string;
  whatsappText: string;
}

export const SERVICES: ServiceData[] = [
  {
    id: "location-voiture",
    title: "Location de Voiture",
    subtitle: "Courte & longue durée, avec ou sans chauffeur",
    shortDescription: "Louez les plus belles voitures d'Abidjan. BMW, Mercedes, Range Rover — courte durée, longue durée ou avec chauffeur dédié.",
    description: `NOVA met à votre disposition une flotte de véhicules premium pour tous vos besoins de mobilité à Abidjan et en Côte d'Ivoire.

Que ce soit pour un déplacement professionnel, un événement spécial, un transfert aéroport ou simplement pour profiter d'une voiture de prestige, notre équipe vous accompagne avec professionnalisme et discrétion.

Nous proposons des formules flexibles : à la journée, à la semaine ou au mois. Tous nos véhicules sont récents, entretenus et assurés. La livraison à domicile est incluse sur Abidjan.`,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
      "https://images.unsplash.com/photo-1548703531-fd3f26c7f1ab?w=800&q=80",
    ],
    features: [
      "Livraison à domicile incluse",
      "Assurance tous risques",
      "Assistance 24h/24",
      "Sans dépôt de garantie",
      "Kilométrage illimité",
      "Chauffeur disponible sur demande",
    ],
    avantages: [
      { titre: "Flotte premium", texte: "BMW, Mercedes, Range Rover, Porsche — des véhicules entretenus au quotidien.", icon: Star },
      { titre: "Disponible 24h/24", texte: "Réservez à tout moment, nous intervenons rapidement sur Abidjan.", icon: Clock },
      { titre: "Assurance complète", texte: "Tous nos véhicules sont couverts tous risques pour votre tranquillité.", icon: Shield },
      { titre: "Livraison rapide", texte: "Votre voiture livrée où vous êtes dans l'heure sur Abidjan.", icon: Truck },
    ],
    tag: "Populaire",
    tagColor: "bg-nova-red/15 text-nova-red border-nova-red/20",
    gradient: "from-nova-red/20 via-nova-red/5 to-transparent",
    iconBg: "bg-nova-red",
    icon: Key,
    category: "automobile",
    cta: "Réserver une voiture",
    whatsappText: "Bonjour, je souhaite louer une voiture chez NOVA. Pouvez-vous me donner plus d'informations ?",
  },
  {
    id: "flotte",
    title: "Gestion de Flotte",
    subtitle: "Solutions complètes pour entreprises",
    shortDescription: "Confiez la gestion de votre flotte de véhicules à NOVA. Suivi, maintenance, optimisation des coûts — nous gérons tout pour vous.",
    description: `NOVA propose une solution clé en main pour la gestion de flottes de véhicules d'entreprise en Côte d'Ivoire.

Notre équipe d'experts prend en charge l'intégralité de la gestion de vos véhicules : suivi en temps réel par GPS, planification des maintenances, gestion des sinistres, renouvellement du parc et rapports mensuels détaillés.

Nous accompagnons les PME, les grandes entreprises et les institutions internationales avec des contrats sur mesure. Notre objectif : réduire vos coûts opérationnels tout en maximisant la disponibilité de vos véhicules.`,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    ],
    features: [
      "Suivi GPS en temps réel",
      "Maintenance préventive planifiée",
      "Rapports mensuels détaillés",
      "Gestion des sinistres incluse",
      "Renouvellement du parc",
      "Tableau de bord digital",
    ],
    avantages: [
      { titre: "Réduction des coûts", texte: "Jusqu'à 30% d'économies grâce à l'optimisation intelligente de votre flotte.", icon: BarChart3 },
      { titre: "Suivi en temps réel", texte: "Localisation GPS et alertes instantanées sur chaque véhicule de votre flotte.", icon: MapPin },
      { titre: "Équipe dédiée", texte: "Un gestionnaire NOVA attitré pour votre compte, joignable à tout moment.", icon: Users },
      { titre: "Rapports mensuels", texte: "Analyses détaillées des dépenses, kilométrages et performances de votre flotte.", icon: BarChart3 },
    ],
    tag: "Entreprise",
    tagColor: "bg-nova-orange/15 text-nova-orange border-nova-orange/20",
    gradient: "from-nova-orange/20 via-nova-orange/5 to-transparent",
    iconBg: "bg-nova-orange",
    icon: Layers,
    category: "automobile",
    cta: "Demander un devis",
    whatsappText: "Bonjour, je souhaite en savoir plus sur la gestion de flotte chez NOVA pour mon entreprise.",
  },
  {
    id: "pieces-auto",
    title: "Vente de Pièces Auto",
    subtitle: "Pièces neuves & d'occasion certifiées",
    shortDescription: "Pièces automobiles neuves et d'occasion pour toutes les marques. Certification qualité, livraison rapide sur Abidjan.",
    description: `NOVA dispose d'un stock important de pièces automobiles pour toutes les grandes marques : Toyota, Mercedes, BMW, Range Rover, Honda, Nissan et bien d'autres.

Que vous soyez un particulier ou un garage professionnel, nous vous fournissons des pièces d'origine ou de qualité équivalente, testées et certifiées.

Notre équipe technique peut vous aider à identifier la pièce exacte dont vous avez besoin. Nous proposons aussi des services d'import de pièces spécifiques introuvables localement, avec des délais compétitifs depuis l'Europe, la Chine et les États-Unis.`,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1609752436086-f0ea5f972e4e?w=800&q=80",
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80",
    ],
    features: [
      "Pièces neuves et d'occasion",
      "Certifiées et testées",
      "Toutes marques disponibles",
      "Import sur commande",
      "Garantie qualité",
      "Livraison rapide",
    ],
    avantages: [
      { titre: "Stock disponible", texte: "Plus de 5 000 références en stock pour toutes les grandes marques.", icon: Package },
      { titre: "Qualité certifiée", texte: "Chaque pièce est vérifiée et testée avant expédition.", icon: CheckCircle },
      { titre: "Import rapide", texte: "Commande de pièces introuvables localement depuis l'Europe en 7 à 14 jours.", icon: Truck },
      { titre: "Support technique", texte: "Nos experts vous aident à identifier la bonne pièce pour votre véhicule.", icon: Headphones },
    ],
    tag: "Rapide",
    tagColor: "bg-nova-yellow/15 text-nova-yellow border-nova-yellow/20",
    gradient: "from-nova-yellow/20 via-nova-yellow/5 to-transparent",
    iconBg: "bg-nova-yellow",
    icon: Wrench,
    category: "automobile",
    cta: "Commander une pièce",
    whatsappText: "Bonjour, je cherche une pièce auto chez NOVA. Pouvez-vous m'aider à trouver ce qu'il me faut ?",
  },
  {
    id: "achat-vente-immo",
    title: "Achat & Vente Immobilier",
    subtitle: "Expertise & accompagnement complet",
    shortDescription: "NOVA vous accompagne dans l'achat ou la vente de votre bien immobilier. Expertise du marché, négociation, juridique — tout est pris en charge.",
    description: `NOVA vous accompagne à chaque étape de votre projet immobilier, que vous soyez acheteur ou vendeur.

Pour les acheteurs : nous identifions les meilleures opportunités selon vos critères, négocions les prix, coordinons les visites et gérons toutes les formalités administratives et juridiques jusqu'à la signature chez le notaire.

Pour les vendeurs : nous estimons votre bien gratuitement, le valorisons avec des photos professionnelles, diffusons votre annonce sur tous nos canaux et gérons les contacts avec les acheteurs potentiels jusqu'à la vente.

Notre connaissance approfondie du marché immobilier abidjanais nous permet de vous conseiller sur les meilleures opportunités et les prix justes.`,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    features: [
      "Estimation gratuite",
      "Photos professionnelles",
      "Diffusion multi-canaux",
      "Négociation incluse",
      "Accompagnement notarial",
      "Zéro stress garanti",
    ],
    avantages: [
      { titre: "Expertise locale", texte: "10 ans d'expérience du marché immobilier abidjanais et ivoirien.", icon: Star },
      { titre: "Photos pro offertes", texte: "Séance photo professionnelle incluse pour valoriser votre bien au maximum.", icon: Zap },
      { titre: "Réseau d'acheteurs", texte: "Plus de 2 000 acheteurs actifs dans notre base de données.", icon: Users },
      { titre: "Suivi juridique", texte: "Notre partenaire notarial sécurise chaque transaction de A à Z.", icon: Shield },
    ],
    tag: "Exclusif",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500",
    icon: Home,
    category: "immobilier",
    cta: "Estimer mon bien",
    whatsappText: "Bonjour, je souhaite vendre ou acheter un bien immobilier avec NOVA. Pouvez-vous m'accompagner ?",
  },
  {
    id: "location-immo",
    title: "Location Immobilier",
    subtitle: "Gestion locative clé en main",
    shortDescription: "Confiez la location de votre bien à NOVA. Recherche de locataires, gestion des loyers et entretien — nous gérons tout à votre place.",
    description: `NOVA prend en charge la gestion locative complète de votre bien immobilier à Abidjan et en Côte d'Ivoire.

Pour les propriétaires : nous trouvons des locataires sérieux et solvables, rédigeons les contrats, collectons les loyers, gérons les éventuels litiges et coordonnons les travaux d'entretien. Vous percevez votre loyer en toute tranquillité.

Pour les locataires : nous vous proposons une sélection de biens correspondant exactement à vos critères — maisons, villas, appartements ou studios meublés. Notre équipe vous accompagne de la visite à la remise des clés.

Nous gérons actuellement plus de 150 biens locatifs à Abidjan avec un taux d'occupation supérieur à 95%.`,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    ],
    features: [
      "Recherche de locataires",
      "Vérification de solvabilité",
      "Rédaction des contrats",
      "Collecte des loyers",
      "Gestion des litiges",
      "Coordination des travaux",
    ],
    avantages: [
      { titre: "Zéro tracas", texte: "Nous gérons tout de A à Z — vous n'avez qu'à percevoir votre loyer.", icon: Shield },
      { titre: "95% d'occupation", texte: "Notre portefeuille de locataires qualifiés minimise les vacances locatives.", icon: BarChart3 },
      { titre: "Paiement garanti", texte: "Option loyers garantis disponible — payés même en cas d'impayé.", icon: CheckCircle },
      { titre: "Suivi mensuel", texte: "Rapport détaillé chaque mois sur l'état de votre bien et les paiements.", icon: Headphones },
    ],
    tag: "Clé en main",
    tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500",
    icon: Building2,
    category: "immobilier",
    cta: "Confier mon bien",
    whatsappText: "Bonjour, je souhaite confier la gestion locative de mon bien à NOVA. Pouvez-vous me contacter ?",
  },
];

export function getService(id: string): ServiceData | undefined {
  return SERVICES.find(s => s.id === id);
}

export function getServicesByCategory(category: "automobile" | "immobilier"): ServiceData[] {
  return SERVICES.filter(s => s.category === category);
}
