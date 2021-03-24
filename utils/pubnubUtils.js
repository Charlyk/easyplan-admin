import {
  setUpdateCurrentUser,
  toggleAppointmentsUpdate,
  toggleExchangeRateUpdate,
  togglePatientsListUpdate,
  toggleUpdateInvoices,
  triggerUsersUpdate,
} from '../redux/actions/actions';
import { setClinicExchangeRatesUpdateRequired } from '../redux/actions/clinicActions';
import { toggleUpdateInvoice } from '../redux/actions/invoiceActions';
import { setSMSMessageStatus } from '../redux/actions/patientActions';
import {
  toggleDeleteSchedule,
  toggleUpdateSchedule,
} from '../redux/actions/scheduleActions';
import { userSelector } from '../redux/selectors/rootSelector';

export const handleRemoteMessage = (message) => (dispatch, getState) => {
  const appState = getState();
  const currentUser = userSelector(appState);
  const { action, targetUserId, payload: messagePayload } = message;
  const payload = messagePayload != null ? JSON.parse(messagePayload) : null;
  switch (action) {
    case MessageAction.NewUserInvited:
    case MessageAction.InvitationRemoved:
    case MessageAction.ClinicInvitationAccepted:
      dispatch(triggerUsersUpdate(true));
      break;
    case MessageAction.CreatedNewInvoice:
      // update appointments list
      dispatch(toggleAppointmentsUpdate());
      // update invoices
      dispatch(toggleUpdateInvoices());
      break;
    case MessageAction.PauseRecordUpdatedOrCreated:
    case MessageAction.ScheduleUpdatedOrCreated:
      dispatch(toggleUpdateSchedule(payload));
      setTimeout(() => dispatch(toggleUpdateSchedule(null)), 400);
      break;
    case MessageAction.UserRestoredInClinic:
    case MessageAction.UserRemovedFromClinic:
      if (currentUser.id === targetUserId) {
        dispatch(setUpdateCurrentUser());
      }
      break;
    case MessageAction.ClinicDataImportStarted:
    case MessageAction.ClinicDataImported:
      dispatch(togglePatientsListUpdate());
      break;
    case MessageAction.ExchangeRatesUpdated:
      dispatch(toggleExchangeRateUpdate());
      break;
    case MessageAction.ExchangeRatesUpdateRequired:
      dispatch(setClinicExchangeRatesUpdateRequired(true));
      break;
    case MessageAction.ScheduleDeleted:
      dispatch(toggleDeleteSchedule(payload));
      setTimeout(() => dispatch(toggleDeleteSchedule(null)), 400);
      break;
    case MessageAction.NewPaymentRegistered:
      dispatch(toggleUpdateInvoice(payload));
      setTimeout(() => dispatch(toggleUpdateInvoice(null)), 400);
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
  PauseRecordUpdatedOrCreated: 'PauseRecordUpdatedOrCreated',
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
  ScheduleDeleted: 'ScheduleDeleted',
};
