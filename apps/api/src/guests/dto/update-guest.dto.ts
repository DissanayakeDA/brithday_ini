import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { INVITATION_SCOPES, type InvitationScope } from "@bday/shared";

export class UpdateGuestDto {
  @IsOptional()
  @IsString({ message: "Guest name must be text." })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(1, { message: "Guest name cannot be empty." })
  @MaxLength(80, { message: "Guest name is too long (max 80 characters)." })
  name?: string;

  @IsOptional()
  @IsIn(INVITATION_SCOPES, {
    message: "Invitation scope must be one of: single, couple, family.",
  })
  invitationScope?: InvitationScope;
}
