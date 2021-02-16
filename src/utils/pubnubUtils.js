import {
  setUpdateCurrentUser,
  toggleAppointmentsUpdate,
  toggleCheckDoctorAppointments,
  toggleExchangeRateUpdate,
  togglePatientsListUpdate,
  toggleUpdateDoctorAppointment,
  toggleUpdateInvoices,
  triggerUsersUpdate,
} from '../redux/actions/actions';
import { setClinicExchangeRatesUpdateRequired } from '../redux/actions/clinicActions';
import { setSMSMessageStatus } from '../redux/actions/patientActions';
import { toggleUpdateSchedule } from '../redux/actions/schedule';
import { userSelector } from '../redux/selectors/rootSelector';
import { fetchClinicData } from './helperFuncs';

export const handleRemoteMessage = (message) => (dispatch, getState) => {
  const appState = getState();
  const currentUser = userSelector(appState);
  const { action, targetUserId, payload: messagePayload } = message;
  const payload = messagePayload != null ? JSON.parse(messagePayload) : null;
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
      dispatch(toggleUpdateSchedule(payload));
      break;
    case MessageAction.UserRestoredInClinic:
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
    case MessageAction.ExchangeRatesUpdated:
      dispatch(toggleExchangeRateUpdate());
      break;
    case MessageAction.NewPaymentRegistered:
      dispatch(toggleUpdateInvoices());
      dispatch(toggleCheckDoctorAppointments());
      dispatch(toggleUpdateDoctorAppointment());
      break;
    case MessageAction.ExchangeRatesUpdateRequired:
      dispatch(setClinicExchangeRatesUpdateRequired(true));
      break;
    case MessageAction.UpdateMessageStatus: {
      if (payload == null) {
        return;
      }
      dispatch(setSMSMessageStatus({ id: payload.id, status: payload.status }));
      break;
    }
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
  NewPaymentRegistered: 'NewPaymentRegistered',
  ExchangeRatesUpdateRequired: 'ExchangeRatesUpdateRequired',
  UpdateMessageStatus: 'UpdateMessageStatus',
};
