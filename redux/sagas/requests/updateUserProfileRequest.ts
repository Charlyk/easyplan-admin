import { AxiosResponse } from 'axios';
import { updateUserAccount } from 'middleware/api/auth';
import { UpdateProfileRequest } from 'types/api';
import { AuthenticationResponse } from 'types/api/response';

export async function requestUpdateUserProfile(
  data: UpdateProfileRequest,
): Promise<AxiosResponse<AuthenticationResponse>> {
  return updateUserAccount(data);
}
