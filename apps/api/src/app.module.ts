import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { GuestsModule } from "./guests/guests.module";

@Module({
  imports: [
    // Loads apps/api/.env into process.env, globally available.
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    GuestsModule,
  ],
})
export class AppModule {}
