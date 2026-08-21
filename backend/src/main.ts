import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedIfEmpty } from './prisma/seed.data';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seed the database on boot if it's empty (idempotent — skips when data
  // already exists). Runs from compiled JS, so no ts-node is needed in prod.
  try {
    await seedIfEmpty(app.get(PrismaService));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Seed on boot failed (continuing):', err);
  }

  app.setGlobalPrefix('api');

  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Taskly API running on http://localhost:${port}/api`);
}
void bootstrap();
