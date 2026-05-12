import type { MarketPurchaseResponse, PurchaseRequest } from '../../../../common';
import { serializeDate } from '../../../../common';
import type { CaelusRequestClient } from './client';

export function createMarketApi(client: CaelusRequestClient) {
  return {
    async purchase(input: PurchaseRequest) {
      return client.requestJson<MarketPurchaseResponse>('/api/market/purchase', {
        method: 'POST',
        body: {
          ...input,
          start: serializeDate(input.start),
          end: serializeDate(input.end),
        },
      });
    },
  };
}
