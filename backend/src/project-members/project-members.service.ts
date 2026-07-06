import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectMember } from './schemas/project-member.schema';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectModel(ProjectMember.name)
    private readonly projectMemberModel: Model<ProjectMember>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  //add new member
  async create(
    projectId: string,
    createProjectMemberDto: CreateProjectMemberDto,
  ) {
    const user = await this.userModel.findById(createProjectMemberDto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existingMember = await this.projectMemberModel.findOne({
      projectId,
      userId: createProjectMemberDto.userId,
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this project');
    }
    const member = new this.projectMemberModel({
      ...createProjectMemberDto,
      projectId,
    });

    return member.save();
  }
  //get all member
  async findAll(projectId: string) {
    return this.projectMemberModel.find({ projectId });
  }
  //edit member
  async update(
    memberId: string,
    UpdateProjectMemberDto: UpdateProjectMemberDto,
  ) {
    const member = await this.projectMemberModel.findByIdAndUpdate(
      memberId,
      UpdateProjectMemberDto,
      { new: true },
    );

    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    return member;
  }
  //delete member
  async remove(memberId: string) {
    const member = await this.projectMemberModel.findByIdAndDelete(memberId);

    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    return {
      message: 'Project member deleted successfully',
    };
  }
}