import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardMember } from './schemas/board-member.schema';
import { Board } from '../boards/schemas/board.schema';
import { AddBoardMemberDto } from './dto/add-board-member.dto';
import { UpdateBoardMemberDto } from './dto/update-board-member.dto';

@Injectable()
export class BoardMembersService {
  constructor(
    @InjectModel(BoardMember.name)
    private boardMemberModel: Model<BoardMember>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
  ) {}

  private async assertBoardLeader(
    boardId: string,
    userId: string,
    userRole: string,
  ) {
    if (userRole === 'OWNER') return;
    const membership = await this.boardMemberModel.findOne({
      boardId,
      userId,
      role: 'BOARD_LEADER',
    });
    if (!membership) {
      throw new ForbiddenException(
        'Only a board leader or owner can manage board members',
      );
    }
  }

  async addMember(
    boardId: string,
    dto: AddBoardMemberDto,
    requesterId: string,
    requesterRole: string,
  ) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');

    await this.assertBoardLeader(boardId, requesterId, requesterRole);

    const existing = await this.boardMemberModel.findOne({
      boardId,
      userId: dto.userId,
    });
    if (existing) throw new ConflictException('User is already a board member');

    return this.boardMemberModel.create({ boardId, ...dto });
  }

  async findAllByBoard(boardId: string) {
    return this.boardMemberModel
      .find({ boardId })
      .populate('userId', 'fullName email');
  }

  async updateMember(
    boardId: string,
    memberId: string,
    dto: UpdateBoardMemberDto,
    requesterId: string,
    requesterRole: string,
  ) {
    await this.assertBoardLeader(boardId, requesterId, requesterRole);

    const member = await this.boardMemberModel.findByIdAndUpdate(
      memberId,
      dto,
      { new: true },
    );
    if (!member) throw new NotFoundException('Board member not found');
    return member;
  }

  async removeMember(
    boardId: string,
    memberId: string,
    requesterId: string,
    requesterRole: string,
  ) {
    await this.assertBoardLeader(boardId, requesterId, requesterRole);

    const member = await this.boardMemberModel.findByIdAndDelete(memberId);
    if (!member) throw new NotFoundException('Board member not found');
    return { message: 'Member removed from board successfully' };
  }
}
