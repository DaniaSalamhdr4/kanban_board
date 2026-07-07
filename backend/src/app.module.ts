import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { BoardMembersModule } from './board-members/board-members.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kanban'),
    AuthModule,
    UsersModule,
    ProjectsModule,
    BoardsModule,
    ColumnsModule,
    TasksModule,
    ProjectMembersModule,
    BoardMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
