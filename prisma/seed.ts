import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@taxlegit.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash, // password reset allowed on reseed
      role: Role.ADMIN,
    },
    create: {
      email,
      name: "Taxlegit Admin",
      role: Role.ADMIN,
      passwordHash,
    },
  });

  console.log("✅ Admin user seeded:", email);
}

seedAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
