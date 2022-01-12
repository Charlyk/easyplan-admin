import { AxiosResponse } from 'axios';
import { getRecentChanges } from 'middleware/api/recentChanges';

export async function requestFetchRecentChanges(): Promise<AxiosResponse<any>> {
  return getRecentChanges();
}
