import { AxiosResponse } from 'axios';
import { getScheduleDetails } from 'middleware/api/schedules';
import { ScheduleDetails } from 'types';

export async function fetchScheduleDetails(
  scheduleId: number,
): Promise<AxiosResponse<ScheduleDetails>> {
  return getScheduleDetails(scheduleId);
}
