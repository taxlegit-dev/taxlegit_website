import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const meta = await prisma.metaData.findMany({
    select: {
      id: true,
      metaBlock: true,
    },
  });

  const broken = meta.filter(
    (m) =>
      m.metaBlock.includes(".webp") ||
      m.metaBlock.includes(".png") ||
      m.metaBlock.includes(".jpg")
  );

  console.log("Possible broken image references in MetaData:");
  console.dir(broken, { depth: null });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
