import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { Column } from '../columns/schemas/column.schema';
import { Task } from '../tasks/schemas/task.schema';
import { BoardMember } from '../board-members/schemas/board-member.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Column.name) private columnModel: Model<Column>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(BoardMember.name)
    private boardMemberModel: Model<BoardMember>,
  ) {}

  async create(
    projectId: string,
    createBoardDto: CreateBoardDto,
    userId: string,
  ) {
    const board = await this.boardModel.create({ ...createBoardDto, projectId });

    // Creator is automatically a BOARD_LEADER
    await this.boardMemberModel.create({
      boardId: board._id,
      userId,
      role: 'BOARD_LEADER',
    });

    return board;
  }

  async findAllByProject(
    projectId: string,
    userId: string,
    userRole: string,
  ) {
    // Global owner sees all boards
    if (userRole === 'OWNER') {
      return this.boardModel.find({ projectId });
    }

    

    // Only boards where user is a board member
    const boardMemberships = await this.boardMemberModel.find({ userId });
    const boardIds = boardMemberships.map((bm) => bm.boardId);
    return this.boardModel.find({ projectId, _id: { $in: boardIds } });
  }

  async findOne(boardId: string, userId: string, userRole: string) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');

    if (userRole === 'OWNER') return board;

    return board;
  }

  async getBoardView(boardId: string, userId: string, userRole: string) {
    const board = await this.findOne(boardId, userId, userRole);

    const columns = await this.columnModel
      .find({ boardId })
      .sort({ position: 1 });

    const columnsWithTasks = await Promise.all(
      columns.map(async (col) => {
        const tasks = await this.taskModel
          .find({ columnId: col._id })
          .sort({ position: 1 })
          .populate('assignedTo', 'fullName email');
        return { ...col.toObject(), tasks };
      }),
    );

    return { ...board.toObject(), columns: columnsWithTasks };
  }

  async update(boardId: string, updateBoardDto: UpdateBoardDto) {
    const board = await this.boardModel.findByIdAndUpdate(
      boardId,
      updateBoardDto,
      { new: true },
    );
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  async remove(boardId: string) {
    const board = await this.boardModel.findByIdAndDelete(boardId);
    if (!board) throw new NotFoundException('Board not found');

    // Cascade delete columns and tasks
    const columns = await this.columnModel.find({ boardId });
    for (const col of columns) {
      await this.taskModel.deleteMany({ columnId: col._id });
    }
    await this.columnModel.deleteMany({ boardId });
    await this.boardMemberModel.deleteMany({ boardId });

    return { message: 'Board deleted successfully' };
  }
}
