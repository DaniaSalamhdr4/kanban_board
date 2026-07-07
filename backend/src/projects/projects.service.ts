import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, ownerId: string) {
    const project = new this.projectModel({
      ...createProjectDto,
      ownerId,
    });

    return project.save();
  }

  async findAll() {
    return this.projectModel.find();
  }

  async findOne(projectId: string) {
    const project = await this.projectModel.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(projectId: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel.findByIdAndUpdate(
      projectId,
      updateProjectDto,
      { new: true },
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async remove(projectId: string) {
    const project = await this.projectModel.findByIdAndDelete(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      message: 'Project deleted successfully',
    };
  }
}
