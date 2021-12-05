import moment from 'moment-timezone';
import { ReduxState } from 'redux/types';

export const appointmentModalSelector = (state: ReduxState) => {
  const modal = state.appointmentModal;
  return {
    ...modal,
    date: modal.date != null ? moment(modal.date).toDate() : null,
  };
};
