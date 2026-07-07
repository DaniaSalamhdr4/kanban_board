import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board, BoardSchema } from './schemas/board.schema';
import { Column, ColumnSchema } from '../columns/schemas/column.schema';
import { Task, TaskSchema } from '../tasks/schemas/task.schema';
import {
  ProjectMember,
  ProjectMemberSchema,
} from '../project-members/schemas/project-member.schema';
import {
  BoardMember,
  BoardMemberSchema,
} from '../board-members/schemas/board-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: Column.name, schema: ColumnSchema },
      { name: Task.name, schema: TaskSchema },
      { name: ProjectMember.name, schema: ProjectMemberSchema },
      { name: BoardMember.name, schema: BoardMemberSchema },
    ]),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
