import { AxiosResponse } from 'axios';
import { createNewDealState } from 'middleware/api/crm';
import { CreateDealStateRequest, UpdateDealStateResponse } from 'types/api';

export async function requestCreateDealState(
  body: CreateDealStateRequest,
): Promise<AxiosResponse<UpdateDealStateResponse>> {
  return createNewDealState(body);
}
