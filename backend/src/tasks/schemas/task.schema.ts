import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop()
  deadline?: Date;

  @Prop({ enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' })
  priority!: string;

  @Prop({ required: true, default: 0 })
  position!: number;

  @Prop({ type: Types.ObjectId, ref: 'Column', required: true })
  columnId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy!: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
