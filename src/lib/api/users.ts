import type { UserMePayload, UserMeResponse } from '../../../../common';
import type { SerializedPublicUser } from '../../../../common';
import { normalizePunishment, normalizeUser } from '../../../../common';
import type { NimbusRequestClient } from './client';

export function createUsersApi(client: NimbusRequestClient) {
  return {
    async me() {
      const response = await client.requestJson<UserMePayload>('/api/users/me');
      return {
        user: normalizeUser(response.user),
        activeSuspension: response.activeSuspension ? normalizePunishment(response.activeSuspension) : null,
      } satisfies UserMeResponse;
    },
    async getByUuid(uuid: string) {
      const response = await client.requestJson<{ user: SerializedPublicUser; requestedBy: SerializedPublicUser }>(`/api/users/${uuid}`);
      return {
        user: normalizeUser(response.user),
        requestedBy: normalizeUser(response.requestedBy),
      };
    },
  };
}
