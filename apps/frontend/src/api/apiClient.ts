import axios, { type AxiosInstance } from 'axios';
import { Label, Task } from '../types/types';

const defaultBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: defaultBaseUrl });
  }

  public async getHello(): Promise<string> {
    const response = await this.get('/api');
    return response as string;
  }

  private async get(path: string): Promise<unknown> {
    return this.axiosInstance.get(path).then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .post(path, body)
      .then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .patch(path, body)
      .then((response) => response.data);
  }

  private async delete(path: string): Promise<unknown> {
    return this.axiosInstance.delete(path).then((response) => response.data);
  }

  public async getTasks(): Promise<Task[]> {
    const response = await this.get('/api/tasks');
    return response as Task[];
  }

  public async updateTaskCategory(id: number, body: unknown): Promise<Task> {
    const response = await this.patch(`/api/tasks/${id}/category`, body);
    return response as Task;
  }

  public async updateTask(id: number, body: unknown): Promise<Task> {
    const response = await this.patch(`/api/tasks/${id}/edit`, body);
    return response as Task;
  }

  public async deleteTask(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.delete(`/api/tasks/${id}`);
    return response as { success: boolean; message: string };
  }

  public async createTask(body: unknown): Promise<Task> {
    const response = await this.post('/api/tasks/', body);
    return response as Task;
  }

  public async addTaskLabels(
    taskId: number,
    labelIds: number[],
  ): Promise<Task> {
    const response = await this.post('/api/tasks/add_labels', {
      taskId,
      labelIds,
    });
    return response as Task;
  }

  public async removeTaskLabels(
    taskId: number,
    labelIds: number[],
  ): Promise<Task> {
    const response = await this.post('/api/tasks/remove_labels', {
      taskId,
      labelIds,
    });
    return response as Task;
  }

  public async getLabels(): Promise<Label[]> {
    const response = await this.get(`/api/labels`);
    return response as Label[];
  }

  public async createLabel(body: unknown): Promise<Label> {
    const response = await this.post(`/api/labels/label`, body);
    console.log('DALTON response: ', response);
    return response as Label;
  }

  public async getTaskById(id: number): Promise<Task> {
    const response = await this.get(`/api/tasks/${id}`);
    return response as Task;
  }
}

export default new ApiClient();
