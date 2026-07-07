import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardMembersController } from './board-members.controller';
import { BoardMembersService } from './board-members.service';
import { BoardMember, BoardMemberSchema } from './schemas/board-member.schema';
import { Board, BoardSchema } from '../boards/schemas/board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoardMember.name, schema: BoardMemberSchema },
      { name: Board.name, schema: BoardSchema },
    ]),
  ],
  controllers: [BoardMembersController],
  providers: [BoardMembersService],
  exports: [BoardMembersService],
})
export class BoardMembersModule {}
