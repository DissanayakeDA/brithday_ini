import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Restrict CORS to the configured frontend origin(s). Falls back to "*"
  // only when nothing is configured (handy for first-run/dev).
  const origins = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(",").map((o) => o.trim())
    : "*";
  app.enableCors({ origin: origins });

  // Validate + sanitise all incoming DTOs. Unknown properties are rejected
  // so the client gets a clear error instead of silently ignored fields.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🎉 Birthday API running on http://localhost:${port}`);
}

void bootstrap();
