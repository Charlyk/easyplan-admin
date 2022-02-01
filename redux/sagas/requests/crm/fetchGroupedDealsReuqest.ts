import { AxiosResponse } from 'axios';
import { fetchGroupedDeals } from 'middleware/api/crm';
import { GroupedDeals } from 'types';

export async function requestFetchGroupedDeals(
  page: number,
  itemsPerPage: number,
): Promise<AxiosResponse<GroupedDeals[]>> {
  return fetchGroupedDeals(page, itemsPerPage);
}
