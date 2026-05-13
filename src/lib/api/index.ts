import { createAuthApi } from './auth';
import { createDevicesApi } from './devices';
import { createMarketApi } from './market';
import { createOmbrRequestClient, type ApiClientConfig, type OmbrRequestClient } from './client';
import { createPunishmentsApi } from './punishments';
import { createStaffApi } from './staff';
import { createUsersApi } from './users';
import { createProfileApi } from './profile';

export type OmbrApiClient = OmbrRequestClient & {
  getStatus: () => Promise<string>;
  auth: ReturnType<typeof createAuthApi>;
  users: ReturnType<typeof createUsersApi>;
  profile: ReturnType<typeof createProfileApi>;
  punishments: ReturnType<typeof createPunishmentsApi>;
  devices: ReturnType<typeof createDevicesApi>;
  staff: ReturnType<typeof createStaffApi>;
  market: ReturnType<typeof createMarketApi>;
};

export function createOmbrApiClient(config: ApiClientConfig = {}): OmbrApiClient {
  const client = createOmbrRequestClient(config);

  return {
    ...client,
    async getStatus() {
      return client.requestText('/api/status', { auth: false });
    },
    auth: createAuthApi(client),
    users: createUsersApi(client),
    profile: createProfileApi(client),
    punishments: createPunishmentsApi(client),
    devices: createDevicesApi(client),
    staff: createStaffApi(client),
    market: createMarketApi(client),
  };
}

export const api = createOmbrApiClient();

export type {
  ApiErrorBody,
  AuthMePayload,
  AuthMeResponse,
  AuthResponsePayload,
  AuthSession,
  DeviceListPayload,
  DevicePayload,
  MarketPurchaseResponse,
  PurchaseRequest,
  PunishmentPayload,
  PunishmentsMePayload,
  PunishmentsMeResponse,
  ProfileCountriesPayload,
  ProfileCountriesResponse,
  ProfileMePayload,
  ProfileMeResponse,
  StaffPunishmentsPayload,
  StaffRoleUpdatePayload,
  StaffRoleUpdateRequest,
  StaffSummary,
  StaffUsersPayload,
  UserMePayload,
  UserMeResponse,
} from '../../../../common';
export type { PublicDevice, PublicPunishment, PublicUser, UserRole } from '../../../../common';
