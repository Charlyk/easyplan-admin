import axios, { AxiosResponse } from 'axios';
import { UpdateUserRequest, AppUserInfo } from 'types/api';

export async function updateUserAccount(
  data: UpdateUserRequest,
): Promise<AxiosResponse<AppUserInfo>> {
  return axios.put('/api/users/update/personal-data', data);
}
