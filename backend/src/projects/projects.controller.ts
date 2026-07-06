import {
  Body,
  Controller,
  Delete,
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
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @UseGuards(JwtAuthGuard)
  @Roles('OWNER')
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    console.log('USER:', req.user);
    const ownerId = req.user.sub;

    return this.projectsService.create(createProjectDto, ownerId);
  }
  @Roles('OWNER')
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }
  @Roles('OWNER')
  @Get(':projectId')
  findOne(@Param('projectId') projectId: string) {
    return this.projectsService.findOne(projectId);
  }
  @Roles('OWNER')
  @Patch(':projectId')
  update(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(projectId, updateProjectDto);
  }
  @Roles('OWNER')
  @Delete(':projectId')
  remove(@Param('projectId') projectId: string) {
    return this.projectsService.remove(projectId);
  }
}
