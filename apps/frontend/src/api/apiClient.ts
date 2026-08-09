import axios, { type AxiosInstance } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

import { isAuthEnabled } from '../auth/auth.config';

const defaultBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: defaultBaseUrl });

    /**
     * Attaches the Cognito ACCESS token to every outgoing request as
     * `Authorization: Bearer <access_token>`, which is what the backend's
     * CognitoJWTGuard expects.
     *
     * Never send the ID token here: the guard rejects any token whose
     * `token_use` is not `access`. ID tokens describe who the user is and are
     * for this client only; access tokens are the API authorization credential.
     *
     * `fetchAuthSession()` returns the cached access token and transparently
     * refreshes it using the stored refresh token when it has expired, so the
     * default 1 hour token lifetime needs no handling here.
     */
    this.axiosInstance.interceptors.request.use(async (config) => {
      // No Cognito env vars means auth is disabled app-wide; send as-is.
      if (!isAuthEnabled()) {
        return config;
      }

      try {
        const { tokens } = await fetchAuthSession();
        const accessToken = tokens?.accessToken?.toString();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch {
        // No signed-in user (or Amplify is unconfigured). Send the request
        // unauthenticated and let the backend guard return a 401.
      }

      return config;
    });
  }

  public async getHello(): Promise<string> {
    return this.get('/api') as Promise<string>;
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
}

export default new ApiClient();
