import { AxiosResponse } from 'axios';
import { fetchAppData } from 'middleware/api/initialization';
import { CurrentClinic, CurrentUser } from 'types';

export async function requestFetchAppData(
  headers: any,
): Promise<
  AxiosResponse<{ currentUser: CurrentUser; currentClinic: CurrentClinic }>
> {
  return fetchAppData(headers);
}
