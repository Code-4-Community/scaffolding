import axios, { type AxiosInstance } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Anthology, Story } from '../types';
import User from './dtos/user.dto';

const defaultBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: defaultBaseUrl });
  }

  public async getMe(): Promise<User> {
    return this.get('/api/auth/me') as Promise<User>;
  }

  public async getHello(): Promise<string> {
    return this.get('/api') as Promise<string>;
  }

  public async getAnthologies(): Promise<Anthology[]> {
    return this.get('/api/anthologies') as Promise<Anthology[]>;
  }

  public async getAnthology(id: string | number): Promise<Anthology> {
    return this.get(`/api/anthologies/${id}`) as Promise<Anthology>;
  }

  public async getStoriesByAnthology(
    anthologyId: string | number,
  ): Promise<Story[]> {
    return this.get(`/api/anthologies/${anthologyId}/stories`) as Promise<
      Story[]
    >;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  }

  private async get(path: string): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .get(path, { headers })
      .then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .post(path, body, { headers })
      .then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .patch(path, body, { headers })
      .then((response) => response.data);
  }

  private async delete(path: string): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .delete(path, { headers })
      .then((response) => response.data);
  }
}

export default new ApiClient();
