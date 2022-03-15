import { AxiosResponse } from 'axios';
import { requestFetchDealDetails as fetchDetails } from 'middleware/api/crm';
import { CrmDealDetailsType } from 'types';

export async function requestFetchDealDetails(
  dealId: number,
): Promise<AxiosResponse<CrmDealDetailsType>> {
  return fetchDetails(dealId);
}
