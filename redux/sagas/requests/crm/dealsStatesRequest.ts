import { AxiosResponse } from 'axios';
import { fetchAllDealStates } from 'middleware/api/crm';
import { DealStateView } from 'types';

export async function requestFetchDealStates(): Promise<
  AxiosResponse<DealStateView[]>
> {
  return fetchAllDealStates();
}
