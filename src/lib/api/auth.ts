import type { AuthMePayload, AuthMeResponse, AuthResponsePayload, AuthSession } from '../../../../common';
import { normalizePunishment } from '../../../../common';
import { normalizeUser } from '../../../../common';
import type { CaelusRequestClient } from './client';

export function createAuthApi(client: CaelusRequestClient) {
  return {
    async register(input: { username: string; password: string; country?: string }) {
      const response = await client.requestJson<AuthResponsePayload>('/api/auth/register', {
        method: 'POST',
        auth: false,
        body: input,
      });

      client.setAuthToken(response.token);

      return {
        user: normalizeUser(response.user),
        token: response.token,
      } satisfies AuthSession;
    },
    async login(input: { username: string; password: string }) {
      const response = await client.requestJson<AuthResponsePayload>('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: input,
      });

      client.setAuthToken(response.token);

      return {
        user: normalizeUser(response.user),
        token: response.token,
      } satisfies AuthSession;
    },
    async me() {
      const response = await client.requestJson<AuthMePayload>('/api/auth/me');
      return {
        user: normalizeUser(response.user),
        suspension: response.suspension ? normalizePunishment(response.suspension) : null,
      } satisfies AuthMeResponse;
    },
    async logout() {
      await client.requestJson<null>('/api/auth/logout', { method: 'POST' });
      client.clearAuthToken();
    },
  };
}
