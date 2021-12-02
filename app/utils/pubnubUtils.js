import {
  toggleAppointmentsUpdate,
  toggleExchangeRateUpdate,
  togglePatientsListUpdate,
  toggleUpdateInvoices,
  triggerUsersUpdate,
} from 'redux/actions/actions';
import { setClinicExchangeRatesUpdateRequired } from 'redux/actions/clinicActions';
import { toggleUpdateInvoice } from 'redux/actions/invoiceActions';
import { toggleDeleteSchedule } from 'redux/actions/scheduleActions';
import {
  updateSchedule,
  deleteSchedule,
  addNewSchedule,
} from 'redux/slices/calendarData';
import {
  setUpdatedDeal,
  setNewDeal,
  setDeletedDeal,
  setUpdatedReminder,
  setNewReminder,
} from 'redux/slices/crmSlice';
import {
  setShouldUpdateClinicData,
  setUserClinicAccessChange,
} from '../../redux/slices/clinicDataSlice';

export const handleRemoteMessage = (message) => (dispatch) => {
  const { action, payload: messagePayload } = message;
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
    case MessageAction.ScheduleUpdated:
      dispatch(updateSchedule(payload));
      // dispatch(toggleUpdateSchedule(payload));
      // setTimeout(() => {
      //   dispatch(toggleUpdateSchedule(null));
      // }, 600);
      break;
    case MessageAction.ScheduleCreated:
      dispatch(addNewSchedule(payload));
      // dispatch(toggleUpdateSchedule(payload));
      // setTimeout(() => {
      //   dispatch(toggleUpdateSchedule(null));
      // }, 600);
      break;
    case MessageAction.UserCalendarVisibilityChanged:
    case MessageAction.UserRestoredInClinic:
    case MessageAction.UserRemovedFromClinic:
      dispatch(setShouldUpdateClinicData(true));
      setTimeout(() => dispatch(setShouldUpdateClinicData(false)), 600);
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
      dispatch(deleteSchedule(payload));
      dispatch(toggleDeleteSchedule(payload));
      setTimeout(() => dispatch(toggleDeleteSchedule(null)), 600);
      break;
    case MessageAction.NewPaymentRegistered:
      dispatch(toggleUpdateInvoice(payload));
      setTimeout(() => dispatch(toggleUpdateInvoice(null)), 600);
      break;
    case MessageAction.UpdateMessageStatus: {
      if (payload == null) {
        return;
      }
      break;
    }
    case MessageAction.NewDealCreated: {
      if (payload == null) {
        break;
      }
      dispatch(setNewDeal(payload));
      setTimeout(() => dispatch(setNewDeal(null)), 600);
      break;
    }
    case MessageAction.DealDataUpdated: {
      if (payload == null) {
        break;
      }
      dispatch(setUpdatedDeal(payload));
      setTimeout(() => dispatch(setUpdatedDeal(null)), 600);
      break;
    }
    case MessageAction.DealRemoved: {
      if (payload == null) {
        break;
      }
      dispatch(setDeletedDeal(payload));
      setTimeout(() => dispatch(setDeletedDeal(null)), 600);
      break;
    }
    case MessageAction.DealReminderCreated: {
      if (payload == null) {
        break;
      }
      dispatch(setNewReminder(payload));
      setTimeout(() => dispatch(setNewReminder(null)), 600);
      break;
    }
    case MessageAction.ReminderIsDueDate:
    case MessageAction.DealReminderUpdated: {
      if (payload == null) {
        break;
      }
      dispatch(setUpdatedReminder(payload));
      setTimeout(() => dispatch(setUpdatedReminder(null)), 1000);
      break;
    }
    case MessageAction.UserAccessRestored:
    case MessageAction.UserAccessBlocked: {
      if (payload == null) {
        break;
      }
      dispatch(setUserClinicAccessChange(payload));
      setTimeout(() => dispatch(setUserClinicAccessChange(null)), 600);
      break;
    }
  }
};

const MessageAction = {
  ClinicInvitationAccepted: 'ClinicInvitationAccepted',
  CreatedNewInvoice: 'CreatedNewInvoice',
  NewPatientOnSite: 'NewPatientOnSite',
  ScheduleUpdated: 'ScheduleUpdated',
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
  ScheduleCreated: 'ScheduleCreated',
  NewDealCreated: 'NewDealCreated',
  DealDataUpdated: 'DealDataUpdated',
  DealRemoved: 'DealRemoved',
  DealReminderUpdated: 'DealReminderUpdated',
  DealReminderCreated: 'DealReminderCreated',
  ReminderIsDueDate: 'ReminderIsDueDate',
  UserCalendarVisibilityChanged: 'UserCalendarVisibilityChanged',
  UserAccessBlocked: 'UserAccessBlocked',
  UserAccessRestored: 'UserAccessRestored',
};
