import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Board {
  @Prop({ required: true })
  title!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  projectId!: Types.ObjectId;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
