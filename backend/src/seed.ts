import { prisma } from "./lib/prisma.js";
import { hashPassword } from "./lib/auth.js";

async function seed() {
  const existing = await prisma.adminUser.findUnique({ where: { email: "admin@meskley-location.com" } });
  if (existing) {
    console.log("Admin déjà existant, seed ignoré.");
    return;
  }

  const passwordHash = await hashPassword("Admin123!");
  await prisma.adminUser.create({
    data: {
      email: "admin@meskley-location.com",
      passwordHash,
      name: "Admin MESKLEY",
      role: "super_admin",
    },
  });

  console.log("✓ Admin créé : admin@meskley-location.com / Admin123!");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
