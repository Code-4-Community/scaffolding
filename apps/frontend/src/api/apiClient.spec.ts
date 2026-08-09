import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';

import { fetchAuthSession } from 'aws-amplify/auth';
import { isAuthEnabled } from '../auth/auth.config';
import { ApiClient } from './apiClient';

vi.mock('aws-amplify/auth', () => ({ fetchAuthSession: vi.fn() }));
vi.mock('../auth/auth.config', () => ({ isAuthEnabled: vi.fn() }));

const mockFetchAuthSession = vi.mocked(fetchAuthSession);
const mockIsAuthEnabled = vi.mocked(isAuthEnabled);

// Pulls the request interceptor the ApiClient registered on its axios instance
// and runs it over a bare config, returning the config the request would use.
async function runRequestInterceptor(): Promise<InternalAxiosRequestConfig> {
  const client = new ApiClient() as unknown as {
    axiosInstance: {
      interceptors: {
        request: {
          handlers: {
            fulfilled: (
              config: InternalAxiosRequestConfig,
            ) => Promise<InternalAxiosRequestConfig>;
          }[];
        };
      };
    };
  };

  const [interceptor] = client.axiosInstance.interceptors.request.handlers;
  return interceptor.fulfilled({
    headers: {},
  } as unknown as InternalAxiosRequestConfig);
}

// Builds what fetchAuthSession returns for a signed-in user.
function mockSession(accessToken: string, idToken = 'id-token-value'): void {
  mockFetchAuthSession.mockResolvedValue({
    tokens: {
      accessToken: { toString: () => accessToken },
      idToken: { toString: () => idToken },
    },
  } as unknown as Awaited<ReturnType<typeof fetchAuthSession>>);
}

describe('ApiClient auth interceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when auth is enabled', () => {
    beforeEach(() => {
      mockIsAuthEnabled.mockReturnValue(true);
    });

    it('attaches the access token as a Bearer header', async () => {
      mockSession('access-token-value');

      const config = await runRequestInterceptor();

      expect(config.headers.Authorization).toBe('Bearer access-token-value');
    });

    // The backend guard rejects any token whose token_use is not 'access', so
    // sending the ID token here would 401 every request.
    it('sends the access token, never the ID token', async () => {
      mockSession('access-token-value', 'id-token-value');

      const config = await runRequestInterceptor();

      expect(config.headers.Authorization).not.toContain('id-token-value');
    });

    it('sends no Authorization header when nobody is signed in', async () => {
      mockFetchAuthSession.mockRejectedValue(new Error('No current user'));

      const config = await runRequestInterceptor();

      expect(config.headers.Authorization).toBeUndefined();
    });

    it('sends no Authorization header when the session has no access token', async () => {
      mockFetchAuthSession.mockResolvedValue({ tokens: undefined } as Awaited<
        ReturnType<typeof fetchAuthSession>
      >);

      const config = await runRequestInterceptor();

      expect(config.headers.Authorization).toBeUndefined();
    });
  });

  describe('when auth is disabled', () => {
    beforeEach(() => {
      mockIsAuthEnabled.mockReturnValue(false);
    });

    // With no Cognito env vars the scaffold must still run, and Amplify is
    // unconfigured, so the session lookup must not even be attempted.
    it('does not look up a session or attach a header', async () => {
      const config = await runRequestInterceptor();

      expect(mockFetchAuthSession).not.toHaveBeenCalled();
      expect(config.headers.Authorization).toBeUndefined();
    });
  });
});
