import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }
    console.log('USER:', req.user);
    const ownerId = req.user.sub;

    return this.projectsService.create(createProjectDto, ownerId);
  }

  @Get()
  findAll(@Req() req) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }
    return this.projectsService.findAll();
  }
  @Get(':projectId')
  findOne(@Param('projectId') projectId: string, @Req() req) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }
    return this.projectsService.findOne(projectId);
  }
  @Patch(':projectId')
  update(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req,
  ) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }
    return this.projectsService.update(projectId, updateProjectDto);
  }
  @Delete(':projectId')
  remove(@Param('projectId') projectId: string, @Req() req) {
    if (req.user.role !== 'OWNER') {
      throw new ForbiddenException('Only owner can perform this action');
    }
    return this.projectsService.remove(projectId);
  }
}
