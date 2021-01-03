import {
  setUpdateCurrentUser,
  toggleAppointmentsUpdate,
  toggleCheckDoctorAppointments,
  togglePatientsListUpdate,
  toggleUpdateInvoices,
  triggerUsersUpdate,
} from '../redux/actions/actions';
import { userSelector } from '../redux/selectors/rootSelector';
import { fetchClinicData } from './helperFuncs';

export const handleRemoteMessage = message => (dispatch, getState) => {
  const appState = getState();
  const currentUser = userSelector(appState);
  const { action, targetUserId } = message;
  switch (action) {
    case MessageAction.NewUserInvited:
    case MessageAction.InvitationRemoved:
    case MessageAction.ClinicInvitationAccepted:
      dispatch(triggerUsersUpdate());
      break;
    case MessageAction.CreatedNewInvoice:
      // update appointments list
      dispatch(toggleAppointmentsUpdate());
      // update invoices
      dispatch(toggleUpdateInvoices());
      break;
    case MessageAction.NewPatientOnSite:
      dispatch(toggleCheckDoctorAppointments());
      break;
    case MessageAction.ScheduleUpdatedOrCreated:
      dispatch(toggleAppointmentsUpdate());
      dispatch(toggleCheckDoctorAppointments());
      break;
    case MessageAction.UserRemovedFromClinic:
      if (currentUser.id === targetUserId) {
        dispatch(setUpdateCurrentUser());
      }
      break;
    case MessageAction.ClinicDataImportStarted:
    case MessageAction.ClinicDataImported:
      dispatch(fetchClinicData());
      dispatch(togglePatientsListUpdate());
      break;
  }
};

const MessageAction = {
  ClinicInvitationAccepted: 'ClinicInvitationAccepted',
  CreatedNewInvoice: 'CreatedNewInvoice',
  NewPatientOnSite: 'NewPatientOnSite',
  ScheduleUpdatedOrCreated: 'ScheduleUpdatedOrCreated',
  NewUserInvited: 'NewUserInvited',
  InvitationRemoved: 'InvitationRemoved',
  UserRemovedFromClinic: 'UserRemovedFromClinic',
  ClinicDataImported: 'ClinicDataImported',
  ClinicDataImportStarted: 'ClinicDataImportStarted',
};
