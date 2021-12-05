import { createSelector } from 'reselect';
import { ReduxState } from '../types';

export const doctorScheduleDetailsSelector = (state: ReduxState) =>
  state.doctorScheduleDetails;

export const scheduleDetailsSelector = createSelector(
  doctorScheduleDetailsSelector,
  (data) => data?.schedule,
);

export const schedulePatientSelector = createSelector(
  doctorScheduleDetailsSelector,
  (data) => data.schedule.patient,
);

export const scheduleDetailsErrorSelector = createSelector(
  doctorScheduleDetailsSelector,
  (data) => data.error,
);

export const scheduleIdSelector = createSelector(
  doctorScheduleDetailsSelector,
  (data) => data?.scheduleId,
);
