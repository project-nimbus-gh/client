import type { PunishmentPayload, PunishmentsMePayload, PunishmentsMeResponse } from '../../../../common';
import { normalizePunishment, normalizeUser } from '../../../../common';
import type { NimbusRequestClient } from './client';

export function createPunishmentsApi(client: NimbusRequestClient) {
  return {
    async me() {
      const response = await client.requestJson<PunishmentsMePayload>('/api/punishments/me');
      return {
        user: normalizeUser(response.user),
        activeSuspension: response.activeSuspension ? normalizePunishment(response.activeSuspension) : null,
        punishments: response.punishments.map(normalizePunishment),
      } satisfies PunishmentsMeResponse;
    },
    async getById(id: string) {
      const response = await client.requestJson<PunishmentPayload>(`/api/punishments/${id}`);
      return normalizePunishment(response.punishment);
    },
  };
}
