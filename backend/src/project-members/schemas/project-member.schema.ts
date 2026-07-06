import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectMemberDocument = HydratedDocument<ProjectMember>;

@Schema({ timestamps: true })
export class ProjectMember {
  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  projectId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    enum: ['OWNER', 'MEMBER'],
    default: 'MEMBER',
  })
  role!: string;

  @Prop({
    default: false,
  })
  canViewAllBoards!: boolean;

  @Prop({
    default: Date.now,
  })
  joinedAt!: Date;
}

export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember);