import { AxiosResponse } from 'axios';
import { getUsers } from 'middleware/api/users';
import { ClinicUser } from 'types';

export async function fetchClinicUsers(): Promise<
  AxiosResponse<{ users: ClinicUser[]; invitations: any[] }>
> {
  return getUsers();
}
