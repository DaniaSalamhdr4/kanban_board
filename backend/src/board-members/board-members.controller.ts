import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardMembersService } from './board-members.service';
import { AddBoardMemberDto } from './dto/add-board-member.dto';
import { UpdateBoardMemberDto } from './dto/update-board-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/members')
export class BoardMembersController {
  constructor(private readonly boardMembersService: BoardMembersService) {}

  @Post()
  addMember(
    @Param('boardId') boardId: string,
    @Body() dto: AddBoardMemberDto,
    @Req() req,
  ) {
    return this.boardMembersService.addMember(
      boardId,
      dto,
      req.user.sub,
      req.user.role,
    );
  }

  @Get()
  findAll(@Param('boardId') boardId: string) {
    return this.boardMembersService.findAllByBoard(boardId);
  }

  @Patch(':memberId')
  updateMember(
    @Param('boardId') boardId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateBoardMemberDto,
    @Req() req,
  ) {
    return this.boardMembersService.updateMember(
      boardId,
      memberId,
      dto,
      req.user.sub,
      req.user.role,
    );
  }

  @Delete(':memberId')
  removeMember(
    @Param('boardId') boardId: string,
    @Param('memberId') memberId: string,
    @Req() req,
  ) {
    return this.boardMembersService.removeMember(
      boardId,
      memberId,
      req.user.sub,
      req.user.role,
    );
  }
}
