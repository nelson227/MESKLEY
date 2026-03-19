import { prisma } from "./lib/prisma.js";
import { hashPassword } from "./lib/auth.js";
import { generateReference } from "./lib/utils.js";

async function seed() {
  // ── Admin ──
  const email = process.env.ADMIN_EMAIL || "adminmeskley@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "Admin2026!";

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: "Admin MESKLEY", role: "super_admin" },
    create: {
      email,
      passwordHash,
      name: "Admin MESKLEY",
      role: "super_admin",
    },
  });

  const oldAdmin = await prisma.adminUser.findUnique({ where: { email: "admin@meskley-location.com" } });
  if (oldAdmin) {
    await prisma.adminUser.delete({ where: { email: "admin@meskley-location.com" } });
  }
  console.log("✓ Admin seed terminé");

  // ── Logements fictifs ──
  const existingCount = await prisma.listing.count();
  if (existingCount > 0) {
    console.log(`✓ ${existingCount} logement(s) déjà en base, seed logements ignoré.`);
    return;
  }

  const listings = [
    {
      reference: generateReference(),
      title: "Appartement lumineux au Plateau Mont-Royal",
      description: "Superbe appartement de 3½ rénové avec goût, situé au cœur du Plateau Mont-Royal. Planchers de bois franc, grande cuisine ouverte avec îlot, salle de bain moderne. À quelques pas du parc La Fontaine, des restaurants et du métro Mont-Royal. Idéal pour un couple ou un jeune professionnel.",
      type: "appartement" as const,
      price: 1450,
      deposit: 1450,
      charges: 85,
      chargesIncluded: false,
      surface: 65,
      rooms: 4,
      bedrooms: 1,
      bathrooms: 1,
      floor: 3,
      furnished: false,
      availableDate: new Date("2026-04-01"),
      status: "disponible" as const,
      address: "4521 Rue Saint-Denis",
      city: "Montréal",
      neighborhood: "Plateau Mont-Royal",
      latitude: 45.5225,
      longitude: -73.5685,
      photos: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
      ],
      videos: [],
      features: ["wifi", "laveuse_secheuse", "climatisation", "rangement", "balcon"],
      messengerLink: "",
    },
    {
      reference: generateReference(),
      title: "Studio moderne à Griffintown",
      description: "Magnifique studio entièrement meublé dans une tour récente de Griffintown. Cuisine équipée avec électroménagers neufs, grande fenestration offrant une vue imprenable sur le centre-ville. Gym, piscine sur le toit et terrasse commune inclus. Proche du marché Atwater et du canal de Lachine.",
      type: "studio" as const,
      price: 1200,
      deposit: 1200,
      charges: 150,
      chargesIncluded: true,
      surface: 38,
      rooms: 2,
      bedrooms: 0,
      bathrooms: 1,
      floor: 12,
      furnished: true,
      availableDate: new Date("2026-04-15"),
      status: "disponible" as const,
      address: "1500 Rue des Bassins",
      city: "Montréal",
      neighborhood: "Griffintown",
      latitude: 45.4896,
      longitude: -73.5631,
      photos: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80",
        "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=1200&q=80",
      ],
      videos: [],
      features: ["wifi", "climatisation", "gym", "piscine", "ascenseur", "parking"],
      messengerLink: "",
    },
    {
      reference: generateReference(),
      title: "Grande maison familiale à Rosemont",
      description: "Charmante maison de ville de 5½ dans le quartier familial de Rosemont–La Petite-Patrie. Trois chambres spacieuses, salon double, cour arrière clôturée avec cabanon. Cuisine rénovée, sous-sol aménagé. Proche des écoles, parcs et du métro Rosemont. Parfaite pour une famille.",
      type: "maison" as const,
      price: 2100,
      deposit: 2100,
      charges: 0,
      chargesIncluded: false,
      surface: 120,
      rooms: 7,
      bedrooms: 3,
      bathrooms: 2,
      floor: null,
      furnished: false,
      availableDate: new Date("2026-05-01"),
      status: "disponible" as const,
      address: "6200 Rue de Bordeaux",
      city: "Montréal",
      neighborhood: "Rosemont–La Petite-Patrie",
      latitude: 45.5430,
      longitude: -73.5700,
      photos: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      ],
      videos: [],
      features: ["wifi", "laveuse_secheuse", "rangement", "balcon", "parking", "cour"],
      messengerLink: "",
    },
    {
      reference: generateReference(),
      title: "Duplex rénové au Vieux-Rosemont",
      description: "Superbe duplex supérieur entièrement rénové. Deux chambres fermées, bureau, grande terrasse privée sur le toit avec vue panoramique. Cuisine contemporaine avec comptoirs en quartz, salle de bain avec douche à l'italienne. Stationnement inclus. Quartier tranquille et verdoyant, proche des commerces de la rue Masson.",
      type: "duplex" as const,
      price: 1750,
      deposit: 1750,
      charges: 60,
      chargesIncluded: false,
      surface: 95,
      rooms: 6,
      bedrooms: 2,
      bathrooms: 1,
      floor: 2,
      furnished: false,
      availableDate: new Date("2026-04-15"),
      status: "reserve" as const,
      address: "2845 Rue Masson",
      city: "Montréal",
      neighborhood: "Rosemont–La Petite-Patrie",
      latitude: 45.5390,
      longitude: -73.5780,
      photos: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
      ],
      videos: [],
      features: ["wifi", "climatisation", "laveuse_secheuse", "rangement", "terrasse", "parking"],
      messengerLink: "",
    },
  ];

  for (const data of listings) {
    await prisma.listing.create({ data });
  }

  console.log(`✓ ${listings.length} logements fictifs créés`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
