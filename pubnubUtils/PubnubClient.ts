import debounce from 'lodash/debounce';
import moment from 'moment-timezone';
import PubNub from 'pubnub';
import { fetchExchangeRatesList } from 'app/components/common/MainComponent/ExchageRates/ExchangeRates.slice';
import {
  addInvoice,
  removeInvoice,
  updateInvoice,
} from 'app/components/dashboard/InvoicesButton/InvoicesButton.slice';
import { Role } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import {
  togglePatientsListUpdate,
  triggerUsersUpdate,
} from 'redux/actions/actions';
import { setClinicExchangeRatesUpdateRequired } from 'redux/actions/clinicActions';
import { toggleUpdateInvoice } from 'redux/actions/invoiceActions';
import {
  currentUserSelector,
  userClinicSelector,
} from 'redux/selectors/appDataSelector';
import { scheduleDetailsSelector } from 'redux/selectors/doctorScheduleDetailsSelector';
import { calendarScheduleDetailsSelector } from 'redux/selectors/scheduleSelector';
import { requestUpdateCurrentClinic } from 'redux/slices/appDataSlice';
import { setCurrentUser } from 'redux/slices/appDataSlice';
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
import { showSuccessNotification } from 'redux/slices/globalNotificationsSlice';
import { ReduxStore as store } from 'store';
import { DealView, MessageAction, PatientDebt, ShortInvoice } from 'types';
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
      case MessageAction.InvoiceCreated:
        handleInvoiceCreated(payload);
        break;
      case MessageAction.InvoiceUpdated:
        handleInvoiceUpdated(payload);
        break;
      case MessageAction.UserCanCreateScheduleChanged:
        handleUserCanCreateScheduleChanged(payload);
        break;
    }
  } catch (error) {
    console.error('error receiving message', error);
  }
};

const updateScheduleDetails = debounce((detailsId: number) => {
  store.dispatch(fetchScheduleDetails(detailsId));
}, 100);

const handleUpdateClinicUsers = () => {
  store.dispatch(triggerUsersUpdate(true));
};

const handleUpdateSchedules = (schedule: Schedule) => {
  const appState = store.getState();
  const scheduleDetails = calendarScheduleDetailsSelector(appState);
  store.dispatch(updateSchedule(schedule));
  if (scheduleDetails != null && schedule.id === scheduleDetails.id) {
    updateScheduleDetails(schedule.id);
  }
};

const handleAddNewSchedule = (schedule: Schedule) => {
  const appState = store.getState();
  const currentUser = currentUserSelector(appState);
  const userClinic = userClinicSelector(appState);
  if (
    userClinic.roleInClinic !== Role.doctor ||
    currentUser.id === schedule.doctorId
  ) {
    store.dispatch(addNewSchedule(schedule));
  }
};

const handleDeleteSchedule = (schedule: Schedule) => {
  store.dispatch(deleteSchedule(schedule));
};

const handleUpdateCurrentClinic = async () => {
  const date = String(moment().format('YYYY-MM-DD'));
  store.dispatch(requestUpdateCurrentClinic(date));
};

const handleUpdatePatients = () => {
  store.dispatch(togglePatientsListUpdate());
};

const handleUpdateExchangeRates = () => {
  store.dispatch(fetchExchangeRatesList());
};

const handleUpdateExchangeRatesRequired = () => {
  store.dispatch(setClinicExchangeRatesUpdateRequired(true));
};

const handleNewPaymentRegistered = (message: PatientDebt) => {
  const appState = store.getState();
  const scheduleDetails = scheduleDetailsSelector(appState);
  store.dispatch(removeInvoice(message));
  store.dispatch(toggleUpdateInvoice(message));
  if (
    scheduleDetails != null &&
    message.patientId === scheduleDetails.patient.id
  ) {
    updateScheduleDetails(scheduleDetails.id);
  }
};

const handleUpdateMessageStatus = (payload: any) => {
  console.warn('handleUpdateMessageStatus', 'Not handled', payload);
};

const handleNewDealCreated = (payload: DealView) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setNewDeal(payload));
};

const handleDealUpdated = (payload: DealView) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setUpdatedDeal(payload));
};

const handleDealDeleted = (payload: DealView) => {
  if (payload == null) {
    return;
  }
  store.dispatch(setDeletedDeal(payload));
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

const handleInvoiceCreated = (payload: ShortInvoice) => {
  store.dispatch(addInvoice(payload));
  const appState = store.getState();
  const userClinic = userClinicSelector(appState);
  if (
    userClinic.roleInClinic !== Role.doctor &&
    userClinic.canRegisterPayments
  ) {
    store.dispatch(showSuccessNotification(textForKey('invoice_created')));
  }
};

const handleInvoiceUpdated = (payload: ShortInvoice) => {
  const appState = store.getState();
  const scheduleDetails = scheduleDetailsSelector(appState);
  store.dispatch(updateInvoice(payload));
  if (scheduleDetails != null && payload.scheduleId === scheduleDetails.id) {
    updateScheduleDetails(payload.scheduleId);
  }
};

const handleUserCanCreateScheduleChanged = (payload) => {
  const appState = store.getState();
  const currentUser = currentUserSelector(appState);
  if (currentUser.id !== payload.id) {
    // no need to handle if the received user is not same as current user
    return;
  }
  store.dispatch(setCurrentUser(payload));
};
