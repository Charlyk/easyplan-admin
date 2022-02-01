import { AxiosResponse } from 'axios';
import { deleteDealState } from 'middleware/api/crm';
import { UpdateDealStateResponse } from 'types/api';

export async function requestDeleteDealState(
  stateId: number,
): Promise<AxiosResponse<UpdateDealStateResponse>> {
  return deleteDealState(stateId);
}
