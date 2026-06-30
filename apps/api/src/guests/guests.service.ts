import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Guest as GuestRow } from "@prisma/client";
import type { Guest, InvitationScope } from "@bday/shared";
import { PrismaService } from "../prisma/prisma.service";
import { generateToken } from "../common/token.util";
import { CreateGuestDto } from "./dto/create-guest.dto";
import { UpdateGuestDto } from "./dto/update-guest.dto";

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  private get siteUrl(): string {
    return (process.env.PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  }

  /** Map a DB row into the shared `Guest` shape (adds the derived formUrl). */
  private toGuest(row: GuestRow): Guest {
    return {
      id: row.id,
      name: row.name,
      token: row.token,
      invitationScope: row.invitationScope as InvitationScope,
      formUrl: `${this.siteUrl}/invite/${row.token}`,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async create(dto: CreateGuestDto): Promise<Guest> {
    // Retry a handful of times in the (rare) event of a token collision; the
    // unique constraint on `token` makes this safe under concurrency.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const token = generateToken(dto.name, dto.invitationScope);
      try {
        const row = await this.prisma.guest.create({
          data: {
            name: dto.name,
            invitationScope: dto.invitationScope,
            token,
          },
        });
        return this.toGuest(row);
      } catch (error: any) {
        if (error?.code === "P2002") continue; // duplicate token -> regenerate
        throw error;
      }
    }
    throw new ConflictException(
      "Could not generate a unique invitation link. Please try again.",
    );
  }

  async findAll(): Promise<Guest[]> {
    const rows = await this.prisma.guest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => this.toGuest(row));
  }

  async findByToken(token: string): Promise<Guest> {
    const row = await this.prisma.guest.findUnique({ where: { token } });
    if (!row) {
      throw new NotFoundException("This invitation could not be found.");
    }
    return this.toGuest(row);
  }

  async update(id: string, dto: UpdateGuestDto): Promise<Guest> {
    await this.ensureExists(id);
    const row = await this.prisma.guest.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.invitationScope !== undefined
          ? { invitationScope: dto.invitationScope }
          : {}),
      },
    });
    return this.toGuest(row);
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.ensureExists(id);
    await this.prisma.guest.delete({ where: { id } });
    return { id };
  }

  private async ensureExists(id: string): Promise<void> {
    const row = await this.prisma.guest.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException("Guest not found.");
    }
  }
}
