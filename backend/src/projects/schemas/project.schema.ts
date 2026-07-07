import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop()
  description!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  ownerId!: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
