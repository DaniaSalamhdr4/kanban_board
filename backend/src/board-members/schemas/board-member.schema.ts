import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BoardMemberDocument = HydratedDocument<BoardMember>;

@Schema({ timestamps: true })
export class BoardMember {
  @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
  boardId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ enum: ['BOARD_LEADER', 'BOARD_MEMBER'], default: 'BOARD_MEMBER' })
  role!: string;

  @Prop({ default: Date.now })
  joinedAt!: Date;
}

export const BoardMemberSchema = SchemaFactory.createForClass(BoardMember);
