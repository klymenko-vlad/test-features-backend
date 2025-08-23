import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AiService } from '../ai/ai.service';
import { CreateTaskDto } from './dto';
import { Task } from './schema/task.schema';

interface TaskPriorityResult {
  id: string;
  priority: string;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly TaskModel: Model<Task>,
    private readonly aiService: AiService,
  ) {}

  async getTasks(userId: string): Promise<Task[]> {
    return this.TaskModel.find({ user: userId, isArchived: false });
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = new this.TaskModel({ ...createTaskDto, user: userId });
    return task.save();
  }

  async prioritizeTasks(
    userId: string,
    taskIds?: string[],
  ): Promise<(Task | null)[]> {
    let tasks: Task[];
    if (!taskIds?.length) {
      tasks = await this.TaskModel.find({ user: userId, isArchived: false });
    } else {
      const objectIds = taskIds.map(id => new Types.ObjectId(id));
      tasks = await this.TaskModel.find({
        _id: { $in: objectIds },
        user: userId,
      });
    }
    if (!tasks.length) return [];
    const aiResults: TaskPriorityResult[] =
      await this.aiService.prioritizeTasksWithAI(
        tasks.map((task: Task) => ({
          _id: task._id.toString(),
          title: task.title,
          description: task.description,
        })),
      );

    return await Promise.all(
      aiResults.map(async (result: TaskPriorityResult) => {
        const { id, priority } = result;
        return this.TaskModel.findByIdAndUpdate(
          id,
          { priority },
          { new: true },
        );
      }),
    );
  }
}
