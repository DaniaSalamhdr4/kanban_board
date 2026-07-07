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
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('projects/:projectId/boards')
  create(
    @Param('projectId') projectId: string,
    @Body() createBoardDto: CreateBoardDto,
    @Req() req,
  ) {
    return this.boardsService.create(
      projectId,
      createBoardDto,
      req.user.sub,
      req.user.role,
    );
  }

  @Get('projects/:projectId/boards')
  findAll(@Param('projectId') projectId: string, @Req() req) {
    return this.boardsService.findAllByProject(
      projectId,
      req.user.sub,
      req.user.role,
    );
  }

  @Get('boards/:boardId')
  findOne(@Param('boardId') boardId: string, @Req() req) {
    return this.boardsService.findOne(boardId, req.user.sub, req.user.role);
  }

  @Get('boards/:boardId/view')
  getBoardView(@Param('boardId') boardId: string, @Req() req) {
    return this.boardsService.getBoardView(
      boardId,
      req.user.sub,
      req.user.role,
    );
  }

  @Put('boards/:boardId')
  update(
    @Param('boardId') boardId: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Req() req,
  ) {
    return this.boardsService.update(
      boardId,
      updateBoardDto,
      req.user.sub,
      req.user.role,
    );
  }

  @Delete('boards/:boardId')
  remove(@Param('boardId') boardId: string, @Req() req) {
    return this.boardsService.remove(boardId, req.user.sub, req.user.role);
  }
}
