import { AxiosResponse } from 'axios';
import { fetchCrmFilter } from 'middleware/api/crmFilter';
import { CrmFilterType } from 'types';

export async function requestFetchCrmFilter(): Promise<
  AxiosResponse<CrmFilterType>
> {
  return fetchCrmFilter();
}
