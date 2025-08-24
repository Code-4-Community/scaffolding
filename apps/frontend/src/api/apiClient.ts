import axios, { type AxiosInstance } from 'axios';
import { Task } from '../types/types';

const defaultBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClient {
  /* eslint-disable @typescript-eslint/no-useless-constructor */
  private axiosInstance: AxiosInstance;

  /* eslint-disable @typescript-eslint/no-useless-constructor */
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
    const response = await this.get('/api/tasks/task');
    return response as Task[];
  }

  public async updateTaskCategory(id: number, body: unknown): Promise<Task> {
    const response = await this.patch(`/api/tasks/${id}/category`, body);
    return response as Task;
  }
}

export default new ApiClient();
