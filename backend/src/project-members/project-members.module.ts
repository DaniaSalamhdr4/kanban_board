import { Module } from '@nestjs/common';
import { ProjectMembersController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectMember,
  ProjectMemberSchema,
} from './schemas/project-member.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProjectMember.name,
        schema: ProjectMemberSchema,
      },

      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [ProjectMembersController],
  providers: [ProjectMembersService],
})
export class ProjectMembersModule {}
