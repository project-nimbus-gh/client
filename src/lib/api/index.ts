import { createAuthApi } from './auth';
import { createDevicesApi } from './devices';
import { createMarketApi } from './market';
import { createCaelusRequestClient, type ApiClientConfig, type CaelusRequestClient } from './client';
import { createPunishmentsApi } from './punishments';
import { createStaffApi } from './staff';
import { createUsersApi } from './users';
import { createProfileApi } from './profile';

export type CaelusApiClient = CaelusRequestClient & {
  getStatus: () => Promise<string>;
  auth: ReturnType<typeof createAuthApi>;
  users: ReturnType<typeof createUsersApi>;
  profile: ReturnType<typeof createProfileApi>;
  punishments: ReturnType<typeof createPunishmentsApi>;
  devices: ReturnType<typeof createDevicesApi>;
  staff: ReturnType<typeof createStaffApi>;
  market: ReturnType<typeof createMarketApi>;
};

export function createCaelusApiClient(config: ApiClientConfig = {}): CaelusApiClient {
  const client = createCaelusRequestClient(config);

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

export const api = createCaelusApiClient();

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
