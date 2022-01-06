import { AxiosResponse } from 'axios';
import { requestChangeDoctorCalendarOrder as changeCalendarOrder } from 'middleware/api/userPreferences';
import { CurrentUser } from 'types';

export async function requestChangeDoctorCalendarOrder(
  entityId: number,
  direction: 'Next' | 'Previous',
  type: 'Doctor' | 'Cabinet',
): Promise<AxiosResponse<CurrentUser>> {
  return changeCalendarOrder(entityId, direction, type);
}
