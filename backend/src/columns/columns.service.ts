import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from './schemas/column.schema';
import { Task } from '../tasks/schemas/task.schema';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name) private columnModel: Model<Column>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async create(boardId: string, createColumnDto: CreateColumnDto) {
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

  async update(columnId: string, updateColumnDto: UpdateColumnDto) {
    const column = await this.columnModel.findByIdAndUpdate(
      columnId,
      updateColumnDto,
      { new: true },
    );
    if (!column) throw new NotFoundException('Column not found');
    return column;
  }

  async remove(columnId: string) {
    const column = await this.columnModel.findByIdAndDelete(columnId);
    if (!column) throw new NotFoundException('Column not found');

    // Cascade delete tasks in this column
    await this.taskModel.deleteMany({ columnId });

    return { message: 'Column deleted successfully' };
  }
}
