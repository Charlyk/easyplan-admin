import { AxiosResponse } from 'axios';
import { updateScheduleDoctorAndDate } from 'middleware/api/schedules';
import { Schedule } from 'types';

export async function requestUpdateScheduleDoctorAndDate(
  props,
): Promise<AxiosResponse<Schedule>> {
  const { schedule, body } = props;

  return updateScheduleDoctorAndDate(schedule.id, body);
}
