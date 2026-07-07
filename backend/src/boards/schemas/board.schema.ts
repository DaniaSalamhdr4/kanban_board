import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId!: Types.ObjectId;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
