import moment from 'moment-timezone';
import PubNub from 'pubnub';
import { getClinicDetails } from 'middleware/api/clinic';
import {
  toggleAppointmentsUpdate,
  toggleExchangeRateUpdate,
  togglePatientsListUpdate,
  toggleUpdateInvoices,
  triggerUsersUpdate,
} from 'redux/actions/actions';
import { setClinicExchangeRatesUpdateRequired } from 'redux/actions/clinicActions';
import { toggleUpdateInvoice } from 'redux/actions/invoiceActions';
import { scheduleDetailsSelector } from 'redux/selectors/doctorScheduleDetailsSelector';
import { calendarScheduleDetailsSelector } from 'redux/selectors/scheduleSelector';
import { setCurrentClinic } from 'redux/slices/appDataSlice';
import {
  addNewSchedule,
  deleteSchedule,
  fetchScheduleDetails,
  updateSchedule,
} from 'redux/slices/calendarData';
import { setUserClinicAccessChange } from 'redux/slices/clinicDataSlice';
import {
  setDeletedDeal,
  setNewDeal,
  setNewReminder,
  setUpdatedDeal,
  setUpdatedReminder,
} from 'redux/slices/crmSlice';
import { ReduxStore as store } from 'store';
import {
  DealPayload,
  InvoicePayload,
  MessageAction,
  PaymentPayload,
} from 'types';
import { PubnubMessage, Schedule } from 'types';

const pubnubUUID = PubNub.generateUUID();
const initializationParams = {
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  uuid: pubnubUUID,
};

export const pubnubClient: PubNub = new PubNub(initializationParams);

export const handlePubnubMessage = (event: PubnubMessage) => {
  try {
    const { action, payload: messagePayload } = event.message;
    const payload = messagePayload != null ? JSON.parse(messagePayload) : null;
    switch (action) {
      case MessageAction.NewUserInvited:
      case MessageAction.InvitationRemoved:
      case MessageAction.ClinicInvitationAccepted:
        handleUpdateClinicUsers();
        break;
      case MessageAction.CreatedNewInvoice:
        handleUpdateInvoices(payload);
        break;
      case MessageAction.PauseUpdated:
      case MessageAction.ScheduleUpdated:
        handleUpdateSchedules(payload);
        break;
      case MessageAction.PauseCreated:
      case MessageAction.ScheduleCreated:
        handleAddNewSchedule(payload);
        break;
      case MessageAction.ScheduleDeleted:
        handleDeleteSchedule(payload);
        break;
      case MessageAction.UserCalendarVisibilityChanged:
      case MessageAction.UserRestoredInClinic:
      case MessageAction.UserRemovedFromClinic:
        handleUpdateCurrentClinic();
        break;
      case MessageAction.ClinicDataImportStarted:
      case MessageAction.ClinicDataImported:
        handleUpdatePatients();
        break;
      case MessageAction.ExchangeRatesUpdated:
        handleUpdateExchangeRates();
        break;
      case MessageAction.ExchangeRatesUpdateRequired:
        handleUpdateExchangeRatesRequired();
        break;
      case MessageAction.NewPaymentRegistered:
        handleNewPaymentRegistered(payload);
        break;
      case MessageAction.UpdateMessageStatus:
        handleUpdateMessageStatus(payload);
        break;
      case MessageAction.NewDealCreated:
        handleNewDealCreated(payload);
        break;
      case MessageAction.DealDataUpdated:
        handleDealUpdated(payload);
        break;
      case MessageAction.DealRemoved:
        handleDealDeleted(payload);
        break;
      case MessageAction.DealReminderCreated:
        handleReminderCreated(payload);
        break;
      case MessageAction.ReminderIsDueDate:
      case MessageAction.DealReminderUpdated:
        handleReminderUpdated(payload);
        break;
      case MessageAction.UserAccessRestored:
      case MessageAction.UserAccessBlocked:
        handleUserAccessChanged(payload);
        break;
    }
  } catch (error) {
    console.error('error receiving message', error);
  }
};

const handleUpdateClinicUsers = () => {
  store.dispatch(triggerUsersUpdate(true));
};

const handleUpdateInvoices = (invoice: InvoicePayload) => {
  const appState = store.getState();
  const scheduleDetails = scheduleDetailsSelector(appState);
  setTimeout(() => {
    const { patient } = invoice;
    if (scheduleDetails != null && patient.id === scheduleDetails.patient.id) {
      store.dispatch(fetchScheduleDetails(scheduleDetails.id));
    }
  }, 100);

  // update appointments list
  store.dispatch(toggleAppointmentsUpdate());
  // update invoices
  store.dispatch(toggleUpdateInvoices());
};

const handleUpdateSchedules = (schedule: Schedule) => {
  const appState = store.getState();
  const scheduleDetails = calendarScheduleDetailsSelector(appState);
  store.dispatch(updateSchedule(schedule));
  setTimeout(() => {
    if (scheduleDetails != null && schedule.id === scheduleDetails.id) {
      store.dispatch(fetchScheduleDetails(schedule.id));
    }
  });
};

const handleAddNewSchedule = (schedule: Schedule) => {
  store.dispatch(addNewSchedule(schedule));
};

const handleDeleteSchedule = (schedule: Schedule) => {
  store.dispatch(deleteSchedule(schedule));
};

const handleUpdateCurrentClinic = async () => {
  try {
    const date = String(moment().format('YYYY-MM-DD'));
    const response = await getClinicDetails(date);
    store.dispatch(setCurrentClinic(response.data));
  } catch (error) {
    console.error(error);
  }
};

const handleUpdatePatients = () => {
  store.dispatch(togglePatientsListUpdate());
};

const handleUpdateExchangeRates = () => {
  store.dispatch(toggleExchangeRateUpdate());
};

const handleUpdateExchangeRatesRequired = () => {
  store.dispatch(setClinicExchangeRatesUpdateRequired(true));
};

const handleNewPaymentRegistered = (message: PaymentPayload) => {
  const appState = store.getState();
  const scheduleDetails = scheduleDetailsSelector(appState);
  store.dispatch(toggleUpdateInvoice(message));
  setTimeout(() => {
    if (
      scheduleDetails != null &&
      message.patientId === scheduleDetails.patient.id
    ) {
      store.dispatch(fetchScheduleDetails(scheduleDetails.id));
    }
  }, 100);
};

const handleUpdateMessageStatus = (payload: any) => {
  console.warn('handleUpdateMessageStatus', 'Not handled', payload);
};

const handleNewDealCreated = (payload: DealPayload) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setNewDeal(payload));
  setTimeout(() => store.dispatch(setNewDeal(null)), 600);
};

const handleDealUpdated = (payload: DealPayload) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setUpdatedDeal(payload));
  setTimeout(() => store.dispatch(setUpdatedDeal(null)), 600);
};

const handleDealDeleted = (payload: DealPayload) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setDeletedDeal(payload));
  setTimeout(() => store.dispatch(setDeletedDeal(null)), 600);
};

const handleReminderCreated = (payload: any) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setNewReminder(payload));
  setTimeout(() => store.dispatch(setNewReminder(null)), 600);
};

const handleReminderUpdated = (payload: any) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setUpdatedReminder(payload));
  setTimeout(() => store.dispatch(setUpdatedReminder(null)), 1000);
};

const handleUserAccessChanged = (payload: any) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setUserClinicAccessChange(payload));
  setTimeout(() => store.dispatch(setUserClinicAccessChange(null)), 600);
};
