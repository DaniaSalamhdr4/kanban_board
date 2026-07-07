import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from './schemas/column.schema';
import { Task } from '../tasks/schemas/task.schema';
import { BoardMember } from '../board-members/schemas/board-member.schema';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name) private columnModel: Model<Column>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(BoardMember.name)
    private boardMemberModel: Model<BoardMember>,
  ) {}

  private async assertBoardAdmin(
    boardId: string,
    userId: string,
    userRole: string,
  ) {
    if (userRole === 'OWNER') return;
    const membership = await this.boardMemberModel.findOne({
      boardId,
      userId,
      role: 'ADMIN',
    });
    if (!membership) {
      throw new ForbiddenException(
        'Only OWNER or board admin can perform this action',
      );
    }
  }

  async create(
    boardId: string,
    createColumnDto: CreateColumnDto,
    userId: string,
    userRole: string,
  ) {
    await this.assertBoardAdmin(boardId, userId, userRole);
    if (createColumnDto.position === undefined) {
      const count = await this.columnModel.countDocuments({ boardId });
      createColumnDto.position = count;
    }
    return this.columnModel.create({ ...createColumnDto, boardId });
  }

  async findAllByBoard(boardId: string) {
    return this.columnModel.find({ boardId }).sort({ position: 1 });
  }

  async findOne(columnId: string) {
    const column = await this.columnModel.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');
    return column;
  }

  async update(
    columnId: string,
    updateColumnDto: UpdateColumnDto,
    userId: string,
    userRole: string,
  ) {
    const column = await this.columnModel.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    await this.assertBoardAdmin(column.boardId.toString(), userId, userRole);

    const updated = await this.columnModel.findByIdAndUpdate(
      columnId,
      updateColumnDto,
      { new: true },
    );
    return updated;
  }

  async remove(columnId: string, userId: string, userRole: string) {
    const column = await this.columnModel.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    await this.assertBoardAdmin(column.boardId.toString(), userId, userRole);

    await this.columnModel.findByIdAndDelete(columnId);

    // Cascade delete tasks in this column
    await this.taskModel.deleteMany({ columnId });

    return { message: 'Column deleted successfully' };
  }
}
