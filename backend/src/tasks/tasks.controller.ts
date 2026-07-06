import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('columns/:columnId/tasks')
  create(
    @Param('columnId') columnId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.create(columnId, createTaskDto, req.user.sub);
  }

  @Get('columns/:columnId/tasks')
  findAll(@Param('columnId') columnId: string) {
    return this.tasksService.findAllByColumn(columnId);
  }

  @Get('tasks/:taskId')
  findOne(@Param('taskId') taskId: string) {
    return this.tasksService.findOne(taskId);
  }

  @Put('tasks/:taskId')
  update(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.update(
      taskId,
      updateTaskDto,
      req.user.sub,
      req.user.role,
    );
  }

  @Delete('tasks/:taskId')
  remove(@Param('taskId') taskId: string) {
    return this.tasksService.remove(taskId);
  }
}
