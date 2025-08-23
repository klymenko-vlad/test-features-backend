import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface OllamaResponse {
  response: string;
  done: boolean;
}

interface TaskPriorityResult {
  id: string;
  priority: string;
}

interface TaskInput {
  _id: string;
  title: string;
  description?: string;
}

@Injectable()
export class AiService {
  private readonly ollamaUrl = 'http://localhost:11434/api/generate';
  private readonly defaultModel = 'gemma3:4b';

  constructor(private readonly httpService: HttpService) {}

  async prioritizeTasksWithAI(
    tasks: TaskInput[],
  ): Promise<TaskPriorityResult[]> {
    const prompt = `You are a productivity assistant. For each task below, assign a priority: LOW, MEDIUM, HIGH, or URGENT. Respond as a JSON array of objects with id and priority.\n\nTasks:\n${tasks.map(t => `- id: ${t._id}, title: ${t.title}, description: ${t.description ?? ''}`).join('\n')}`;
    const payload = { model: this.defaultModel, prompt, stream: false };
    try {
      const response = await firstValueFrom(
        this.httpService.post<OllamaResponse>(this.ollamaUrl, payload).pipe(
          catchError(err => {
            throw err;
          }),
        ),
      );
      if (!response.data?.response) {
        throw new Error('Empty or invalid response from Ollama');
      }
      const match = /\[.*]/s.exec(response.data.response);
      if (!match) throw new Error('AI did not return a JSON array');

      const parsed = JSON.parse(match[0]) as TaskPriorityResult[];

      // Validate the structure
      if (!Array.isArray(parsed)) {
        throw new Error('AI response is not an array');
      }

      return parsed;
    } catch (_error) {
      throw new Error('Failed to prioritize tasks with AI');
    }
  }
}
