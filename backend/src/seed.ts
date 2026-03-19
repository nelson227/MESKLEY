import { prisma } from "./lib/prisma.js";
import { hashPassword } from "./lib/auth.js";

async function seed() {
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

  // Supprimer l'ancien admin si différent
  const oldAdmin = await prisma.adminUser.findUnique({ where: { email: "admin@meskley-location.com" } });
  if (oldAdmin) {
    await prisma.adminUser.delete({ where: { email: "admin@meskley-location.com" } });
  }

  console.log("✓ Admin seed terminé");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
