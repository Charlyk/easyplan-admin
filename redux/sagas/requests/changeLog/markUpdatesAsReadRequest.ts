import { AxiosResponse } from 'axios';
import { markRecentChangesAsRead } from 'middleware/api/recentChanges';

export async function requestMarkRecentChangesAsRead(): Promise<
  AxiosResponse<any>
> {
  return markRecentChangesAsRead(null);
}
