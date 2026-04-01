/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance } from 'axios';
import { getIdToken } from '../auth/cognito';
import { useCallback, useEffect, useState } from 'react';
import {
  Application,
  AppStatus,
  AvailabilityFields,
  CandidateInfo,
  LearnerInfo,
  User,
} from './types';

const defaultBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: defaultBaseUrl });
    this.axiosInstance.interceptors.request.use(async (config) => {
      try {
        const idToken = await getIdToken();
        if (idToken) {
          if (!config.headers) config.headers = {} as any;
          const hasAuth =
            (config.headers as any).Authorization ||
            (config.headers as any)['Authorization'];
          if (!hasAuth) {
            (config.headers as any)['Authorization'] = `Bearer ${idToken}`;
            console.debug(
              'ApiClient: attached Authorization header from getIdToken',
            );
          }
        } else {
          console.debug('ApiClient: no idToken available from getIdToken');
        }
      } catch (err) {
        console.debug('ApiClient: error while retrieving idToken', err);
      }

      return config;
    });
  }

  public async getHello(): Promise<string> {
    return this.get('/api') as Promise<string>;
  }

  public async getApplication(appId: number): Promise<Application> {
    return this.get(`/api/applications/${appId}`) as Promise<Application>;
  }

  public async getLearnerInfo(appId: number): Promise<LearnerInfo> {
    return this.get(`/api/learner_info/${appId}`) as Promise<LearnerInfo>;
  }

  public async getCandidateInfoByEmail(email: string): Promise<CandidateInfo> {
    return this.get(
      `/api/CandidateInfo/email/${encodeURIComponent(email)}`,
    ) as Promise<CandidateInfo>;
  }

  public async updateAvailability(
    appId: number,
    availability: Partial<AvailabilityFields>,
  ): Promise<Application> {
    return this.patch(
      `/api/applications/${appId}/availability`,
      availability,
    ) as Promise<Application>;
  }

  public async updateApplicationStatus(
    appId: number,
    appStatus: AppStatus,
  ): Promise<Application> {
    return this.patch(`/api/applications/${appId}/status`, {
      appStatus,
    }) as Promise<Application>;
  }

  public async getTotalApplicationsCount(): Promise<number> {
    const response = (await this.get('/api/applications/count/total')) as {
      count: number;
    };
    return response.count;
  }

  public async getInReviewApplicationsCount(): Promise<number> {
    const response = (await this.get('/api/applications/count/in-review')) as {
      count: number;
    };
    return response.count;
  }

  public async getRejectedApplicationsCount(): Promise<number> {
    const response = (await this.get('/api/applications/count/rejected')) as {
      count: number;
    };
    return response.count;
  }

  public async getApprovedApplicationsCount(): Promise<number> {
    const response = (await this.get('/api/applications/count/approved')) as {
      count: number;
    };
    return response.count;
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

  public async getCurrentUser(): Promise<User | null> {
    return this.get('/api/users/me') as Promise<User | null>;
  }
}

const apiClient = new ApiClient();
export default apiClient;

type CountHookResult = {
  count: number;
  isLoading: boolean;
  error: Error | null;
};

function useCount(
  getter: () => Promise<number>,
  initialCount = 0,
): CountHookResult {
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getter()
      .then((value) => {
        if (mounted) {
          setCount(value);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [getter]);

  return { count, isLoading, error };
}

export function useTotalApplicationsCount(): CountHookResult {
  const getter = useCallback(() => apiClient.getTotalApplicationsCount(), []);
  return useCount(getter);
}

export function useInReviewApplicationsCount(): CountHookResult {
  const getter = useCallback(
    () => apiClient.getInReviewApplicationsCount(),
    [],
  );
  return useCount(getter);
}

export function useRejectedApplicationsCount(): CountHookResult {
  const getter = useCallback(
    () => apiClient.getRejectedApplicationsCount(),
    [],
  );
  return useCount(getter);
}

export function useApprovedApplicationsCount(): CountHookResult {
  const getter = useCallback(
    () => apiClient.getApprovedApplicationsCount(),
    [],
  );
  return useCount(getter);
}
