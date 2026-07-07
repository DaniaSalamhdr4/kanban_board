import { IsMongoId, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateProjectMemberDto {
  @IsMongoId()
  userId!: string;

  @IsOptional()
  @IsEnum(['OWNER', 'MEMBER'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  canViewAllBoards?: boolean;
}
