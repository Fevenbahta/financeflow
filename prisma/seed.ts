import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@financeflow.com",
      monthlyIncome: 0, // optional but explicit
    },
  });

  console.log("🌱 Seed data inserted");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());