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
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post('boards/:boardId/columns')
  create(
    @Param('boardId') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Req() req,
  ) {
    return this.columnsService.create(
      boardId,
      createColumnDto,
      req.user.sub,
      req.user.role,
    );
  }

  @Get('boards/:boardId/columns')
  findAll(@Param('boardId') boardId: string) {
    return this.columnsService.findAllByBoard(boardId);
  }

  @Get('columns/:columnId')
  findOne(@Param('columnId') columnId: string) {
    return this.columnsService.findOne(columnId);
  }

  @Put('columns/:columnId')
  update(
    @Param('columnId') columnId: string,
    @Body() updateColumnDto: UpdateColumnDto,
    @Req() req,
  ) {
    return this.columnsService.update(
      columnId,
      updateColumnDto,
      req.user.sub,
      req.user.role,
    );
  }

  @Delete('columns/:columnId')
  remove(@Param('columnId') columnId: string, @Req() req) {
    return this.columnsService.remove(columnId, req.user.sub, req.user.role);
  }
}
