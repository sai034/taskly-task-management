import { PrismaClient } from '@prisma/client';
import { seedIfEmpty } from '../src/prisma/seed.data';

const prisma = new PrismaClient();

seedIfEmpty(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
