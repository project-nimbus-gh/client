import type {
  ProfileCountriesPayload,
  ProfileCountriesResponse,
  ProfileMePayload,
  ProfileMeResponse,
  SerializedPublicUser,
} from '../../../../common';
import { normalizeUser } from '../../../../common';
import type { OmbrRequestClient } from './client';

export function createProfileApi(client: OmbrRequestClient) {
  return {
    async me() {
      const response = await client.requestJson<ProfileMePayload>('/api/profile/me');
      return {
        user: normalizeUser(response.user),
      } satisfies ProfileMeResponse;
    },
    async getCountries() {
      const response = await client.requestJson<ProfileCountriesPayload>('/api/profile/countries');
      return {
        countries: response.countries,
      } satisfies ProfileCountriesResponse;
    },
    async updateCountry(input: { country: string }) {
      const response = await client.requestJson<{ user: SerializedPublicUser }>('/api/profile/country', {
        method: 'PATCH',
        body: input,
      });
      return normalizeUser(response.user);
    },
  };
}
