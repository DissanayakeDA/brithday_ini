import { Transform } from "class-transformer";
import { IsIn, IsString, MaxLength, MinLength } from "class-validator";
import { INVITATION_SCOPES, type InvitationScope } from "@bday/shared";

export class CreateGuestDto {
  @IsString({ message: "Guest name is required." })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(1, { message: "Guest name cannot be empty." })
  @MaxLength(80, { message: "Guest name is too long (max 80 characters)." })
  name!: string;

  @IsIn(INVITATION_SCOPES, {
    message: "Invitation scope must be one of: single, couple, family.",
  })
  invitationScope!: InvitationScope;
}
