import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { GuestsService } from "./guests.service";
import { CreateGuestDto } from "./dto/create-guest.dto";
import { UpdateGuestDto } from "./dto/update-guest.dto";

@Controller("guests")
export class GuestsController {
  constructor(private readonly guests: GuestsService) {}

  /** Admin: create a new invitee + auto-generate their invite link. */
  @Post()
  create(@Body() dto: CreateGuestDto) {
    return this.guests.create(dto);
  }

  /** Admin: list every invitee (newest first). */
  @Get()
  findAll() {
    return this.guests.findAll();
  }

  /** Public: fetch a single invitee by their token for the invite page. */
  @Get(":token")
  findByToken(@Param("token") token: string) {
    return this.guests.findByToken(token);
  }

  /** Admin: edit an invitee's name / scope (token stays stable). */
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateGuestDto) {
    return this.guests.update(id, dto);
  }

  /** Admin: delete an invitee. */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.guests.remove(id);
  }
}
