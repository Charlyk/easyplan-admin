import { AxiosResponse } from 'axios';
import Moment from 'moment-timezone';
import { updateScheduleDoctorAndDate } from 'middleware/api/schedules';
import { Schedule } from 'types';

export async function requestUpdateScheduleDoctorAndDate(
  props,
): Promise<AxiosResponse<Schedule>> {
  const { schedule, body } = props;
  const startDate = Moment(body.startDate).toDate();

  return updateScheduleDoctorAndDate(schedule.id, { ...body, startDate });
}
