import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { Column } from '../columns/schemas/column.schema';
import { BoardMember } from '../board-members/schemas/board-member.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Column.name) private columnModel: Model<Column>,
    @InjectModel(BoardMember.name) private boardMemberModel: Model<BoardMember>,
  ) {}
  async create(
    columnId: string,
    createTaskDto: CreateTaskDto,
    userId: string,
    userRole: string,
  ) {
    const column = await this.columnModel.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    // Only OWNER or board ADMIN can create tasks
    if (userRole !== 'OWNER') {
      const isBoardAdmin = !!(await this.boardMemberModel.findOne({
        boardId: column.boardId,
        userId,
        role: 'ADMIN',
      }));
      if (!isBoardAdmin) {
        throw new ForbiddenException(
          'Only OWNER or board admin can create tasks',
        );
      }
    }

    if (createTaskDto.position === undefined) {
      const count = await this.taskModel.countDocuments({ columnId });
      createTaskDto.position = count;
    }

    return this.taskModel
      .create({ ...createTaskDto, columnId, createdBy: userId })
      .then((task) =>
        task.populate([
          { path: 'assignedTo', select: 'fullName email' },
          { path: 'createdBy', select: 'fullName email' },
        ]),
      );
  }

  async findAllByColumn(columnId: string) {
    const column = await this.columnModel.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    return this.taskModel
      .find({ columnId })
      .sort({ position: 1 })
      .populate('assignedTo', 'fullName email');
  }

  async findOne(taskId: string) {
    const task = await this.taskModel
      .findById(taskId)
      .populate('assignedTo', 'fullName email')
      .populate('createdBy', 'fullName email');
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async findByUser(userId: string) {
    return this.taskModel
      .find({ assignedTo: userId })
      .sort({ position: 1 })
      .populate('columnId', 'title');
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
    userRole: string,
  ) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const isAssignee = task.assignedTo?.toString() === userId;

    // Check if user is a board ADMIN for this task's board
    const column = await this.columnModel.findById(task.columnId);
    const isBoardLeader = column
      ? !!(await this.boardMemberModel.findOne({
          boardId: column.boardId,
          userId,
          role: 'ADMIN',
        }))
      : false;

    const isOwner = userRole === 'OWNER';

    if (!isAssignee && !isBoardLeader && !isOwner) {
      throw new ForbiddenException(
        'Only the assigned user or board admin can update this task',
      );
    }

    // If moving to another column, validate target column exists
    if (updateTaskDto.columnId) {
      const targetColumn = await this.columnModel.findById(
        updateTaskDto.columnId,
      );
      if (!targetColumn) throw new NotFoundException('Target column not found');
    }

    const updated = await this.taskModel
      .findByIdAndUpdate(taskId, updateTaskDto, { new: true })
      .populate('assignedTo', 'fullName email');

    return updated;
  }

  async remove(taskId: string, userId: string, userRole: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const column = await this.columnModel.findById(task.columnId);

    const isBoardAdmin = column
      ? !!(await this.boardMemberModel.findOne({
          boardId: column.boardId,
          userId,
          role: 'ADMIN',
        }))
      : false;

    const isOwner = userRole === 'OWNER';

    if (!isBoardAdmin && !isOwner) {
      throw new ForbiddenException(
        'Only OWNER or board admin can delete this task',
      );
    }

    await this.taskModel.findByIdAndDelete(taskId);
    return { message: 'Task deleted successfully' };
  }
}
