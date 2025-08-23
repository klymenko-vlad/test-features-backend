import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schema/user.schema';
import { CreateTaskDto } from './dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTasks(@CurrentUser() user: User) {
    return this.tasksService.getTasks(user._id.toString());
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTask(
    @CurrentUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(createTaskDto, user._id.toString());
  }

  @Post('prioritize')
  @UseGuards(JwtAuthGuard)
  async prioritizeTasks(
    @CurrentUser() user: User,
    @Body() body: { taskIds: string[] },
  ) {
    return this.tasksService.prioritizeTasks(
      user._id.toString(),
      body?.taskIds,
    );
  }
}
