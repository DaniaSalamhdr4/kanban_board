import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ColumnDocument = HydratedDocument<Column>;

@Schema({ timestamps: true })
export class Column {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, default: 0 })
  position!: number;

  @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
  boardId!: Types.ObjectId;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
