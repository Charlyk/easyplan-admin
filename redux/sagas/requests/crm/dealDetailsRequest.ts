import { AxiosResponse } from 'axios';
import { requestFetchDealDetails as fetchDetails } from 'middleware/api/crm';
import { DealDetailsView } from 'types';

export async function requestFetchDealDetails(
  dealId: number,
): Promise<AxiosResponse<DealDetailsView>> {
  return fetchDetails(dealId);
}
