import {
  setUpdateCurrentUser,
  toggleAppointmentsUpdate,
  toggleCheckDoctorAppointments,
  toggleExchangeRateUpdate,
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
    case MessageAction.UserRestoredInClinic:
    case MessageAction.UserRemovedFromClinic:
      if (currentUser.id === targetUserId) {
        console.log('user updated');
        dispatch(setUpdateCurrentUser());
      }
      break;
    case MessageAction.ClinicDataImportStarted:
    case MessageAction.ClinicDataImported:
      dispatch(fetchClinicData());
      dispatch(togglePatientsListUpdate());
      break;
    case MessageAction.ExchangeRatesUpdated:
      dispatch(toggleExchangeRateUpdate());
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
  UserRestoredInClinic: 'UserRestoredInClinic',
  ClinicDataImported: 'ClinicDataImported',
  ClinicDataImportStarted: 'ClinicDataImportStarted',
  ImportingClinicServices: 'ImportingClinicServices',
  ImportingClinicDetails: 'ImportingClinicDetails',
  ImportingClinicPatients: 'ImportingClinicPatients',
  ImportingClinicSchedules: 'ImportingClinicSchedules',
  ExchangeRatesUpdated: 'ExchangeRatesUpdated',
};
