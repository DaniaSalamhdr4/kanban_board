import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ProjectMembersService } from './project-members.service';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';

@Controller('projects/:projectId/members')
@UseGuards(JwtAuthGuard)
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createProjectMemberDto: CreateProjectMemberDto,
    @Req() req,
  ) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }

    return this.projectMembersService.create(projectId, createProjectMemberDto);
  }

  @Get()
  findAll(@Param('projectId') projectId: string, @Req() req) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }

    return this.projectMembersService.findAll(projectId);
  }

  @Patch(':memberId')
  update(
    @Param('memberId') memberId: string,
    @Body() updateProjectMemberDto: UpdateProjectMemberDto,
    @Req() req,
  ) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }

    return this.projectMembersService.update(memberId, updateProjectMemberDto);
  }

  @Delete(':memberId')
  remove(@Param('memberId') memberId: string, @Req() req) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }

    return this.projectMembersService.remove(memberId);
  }
}
