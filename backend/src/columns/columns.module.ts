import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { Column, ColumnSchema } from './schemas/column.schema';
import { Task, TaskSchema } from '../tasks/schemas/task.schema';
import {
  BoardMember,
  BoardMemberSchema,
} from '../board-members/schemas/board-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Column.name, schema: ColumnSchema },
      { name: Task.name, schema: TaskSchema },
      { name: BoardMember.name, schema: BoardMemberSchema },
    ]),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
