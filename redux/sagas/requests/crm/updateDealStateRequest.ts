import { AxiosResponse } from 'axios';
import { updateDealState } from 'middleware/api/crm';
import { DealStateView } from 'types';
import { UpdateDealStateRequest } from 'types/api';

export async function requestUpdateDealState(
  stateId: number,
  body: UpdateDealStateRequest,
): Promise<AxiosResponse<DealStateView[]>> {
  return updateDealState(body, stateId);
}
