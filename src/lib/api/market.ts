import type { MarketPurchaseResponse, PurchaseRequest } from '../../../../common';
// serializeDate removed; JSON.stringify will convert Date to ISO string automatically.
import type { OmbrRequestClient } from './client';

export function createMarketApi(client: OmbrRequestClient) {
  return {
    async purchase(input: PurchaseRequest) {
      return client.requestJson<MarketPurchaseResponse>('/api/market/purchase', {
        method: 'POST',
        body: {
          ...input,
          start: input.start,
          end: input.end,
        },
      });
    },
  };
}
