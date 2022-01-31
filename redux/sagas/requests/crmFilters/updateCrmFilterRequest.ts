import { AxiosResponse } from 'axios';
import { updateCrmFilter } from 'middleware/api/crmFilter';
import { CrmFilterType } from 'types';
import { SaveCrmFilterRequest } from 'types/api';

export async function requestUpdateCrmFilter(
  data: SaveCrmFilterRequest,
): Promise<AxiosResponse<CrmFilterType>> {
  return updateCrmFilter(data);
}
