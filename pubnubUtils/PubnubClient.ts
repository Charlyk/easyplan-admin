import debounce from 'lodash/debounce';
import moment from 'moment-timezone';
import PubNub from 'pubnub';
import { Dispatch } from 'redux';
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
import { DealView, MessageAction, PatientDebt, ShortInvoice } from 'types';
import { PubnubMessage, Schedule } from 'types';

const pubnubUUID = PubNub.generateUUID();
const initializationParams = {
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  uuid: pubnubUUID,
};

export const pubnubClient: PubNub = new PubNub(initializationParams);

export const handlePubnubMessage = (event: PubnubMessage) => (dispatch) => {
  try {
    const { action, payload: messagePayload } = event.message;
    const payload = messagePayload != null ? JSON.parse(messagePayload) : null;
    switch (action) {
      case MessageAction.NewUserInvited:
      case MessageAction.InvitationRemoved:
      case MessageAction.ClinicInvitationAccepted:
        dispatch(handleUpdateClinicUsers());
        break;
      case MessageAction.PauseUpdated:
      case MessageAction.ScheduleUpdated:
        dispatch(handleUpdateSchedules(payload));
        break;
      case MessageAction.PauseCreated:
      case MessageAction.ScheduleCreated:
        dispatch(handleAddNewSchedule(payload));
        break;
      case MessageAction.ScheduleDeleted:
        dispatch(handleDeleteSchedule(payload));
        break;
      case MessageAction.UserCalendarVisibilityChanged:
      case MessageAction.UserRestoredInClinic:
      case MessageAction.UserRemovedFromClinic:
        dispatch(handleUpdateCurrentClinic());
        break;
      case MessageAction.ClinicDataImportStarted:
      case MessageAction.ClinicDataImported:
        dispatch(handleUpdatePatients());
        break;
      case MessageAction.ExchangeRatesUpdated:
        dispatch(handleUpdateExchangeRates());
        break;
      case MessageAction.ExchangeRatesUpdateRequired:
        dispatch(handleUpdateExchangeRatesRequired());
        break;
      case MessageAction.NewPaymentRegistered:
        dispatch(handleNewPaymentRegistered(payload));
        break;
      case MessageAction.UpdateMessageStatus:
        dispatch(handleUpdateMessageStatus(payload));
        break;
      case MessageAction.NewDealCreated:
        dispatch(handleNewDealCreated(payload));
        break;
      case MessageAction.DealDataUpdated:
        dispatch(handleDealUpdated(payload));
        break;
      case MessageAction.DealRemoved:
        dispatch(handleDealDeleted(payload));
        break;
      case MessageAction.DealReminderCreated:
        dispatch(handleReminderCreated(payload));
        break;
      case MessageAction.ReminderIsDueDate:
      case MessageAction.DealReminderUpdated:
        dispatch(handleReminderUpdated(payload));
        break;
      case MessageAction.UserAccessRestored:
      case MessageAction.UserAccessBlocked:
        dispatch(handleUserAccessChanged(payload));
        break;
      case MessageAction.InvoiceCreated:
        dispatch(handleInvoiceCreated(payload));
        break;
      case MessageAction.InvoiceUpdated:
        dispatch(handleInvoiceUpdated(payload));
        break;
      case MessageAction.UserCanCreateScheduleChanged:
        dispatch(handleUserCanCreateScheduleChanged(payload));
        break;
    }
  } catch (error) {
    console.error('error receiving message', error);
  }
};

const updateScheduleDetails = debounce(
  (detailsId: number) => (dispatch: Dispatch) => {
    dispatch(fetchScheduleDetails(detailsId));
  },
  100,
);

const handleUpdateClinicUsers = () => (dispatch: Dispatch) => {
  dispatch(triggerUsersUpdate(true));
};

const handleUpdateSchedules =
  (schedule: Schedule) => (dispatch: Dispatch, getState) => {
    const appState = getState();
    const scheduleDetails = calendarScheduleDetailsSelector(appState);
    dispatch(updateSchedule(schedule));
    if (scheduleDetails != null && schedule.id === scheduleDetails.id) {
      dispatch(updateScheduleDetails(schedule.id));
    }
  };

const handleAddNewSchedule =
  (schedule: Schedule) => (dispatch: Dispatch, getState) => {
    const appState = getState();
    const currentUser = currentUserSelector(appState);
    const userClinic = userClinicSelector(appState);
    if (
      userClinic.roleInClinic !== Role.doctor ||
      currentUser.id === schedule.doctorId
    ) {
      dispatch(addNewSchedule(schedule));
    }
  };

const handleDeleteSchedule = (schedule: Schedule) => (dispatch: Dispatch) => {
  dispatch(deleteSchedule(schedule));
};

const handleUpdateCurrentClinic = async () => (dispatch: Dispatch) => {
  const date = String(moment().format('YYYY-MM-DD'));
  dispatch(requestUpdateCurrentClinic(date));
};

const handleUpdatePatients = () => (dispatch: Dispatch) => {
  dispatch(togglePatientsListUpdate());
};

const handleUpdateExchangeRates = () => (dispatch: Dispatch) => {
  dispatch(fetchExchangeRatesList());
};

const handleUpdateExchangeRatesRequired = () => (dispatch: Dispatch) => {
  dispatch(setClinicExchangeRatesUpdateRequired(true));
};

const handleNewPaymentRegistered =
  (message: PatientDebt) => (dispatch: Dispatch, getState) => {
    const appState = getState();
    const scheduleDetails = scheduleDetailsSelector(appState);
    dispatch(removeInvoice(message));
    dispatch(toggleUpdateInvoice(message));
    if (
      scheduleDetails != null &&
      message.patientId === scheduleDetails.patient.id
    ) {
      dispatch(updateScheduleDetails(scheduleDetails.id));
    }
  };

const handleUpdateMessageStatus = (payload: any) => {
  console.warn('handleUpdateMessageStatus', 'Not handled', payload);
};

const handleNewDealCreated = (payload: DealView) => (dispatch: Dispatch) => {
  if (payload == null) {
    return;
  }
  dispatch(setNewDeal(payload));
};

const handleDealUpdated = (payload: DealView) => (dispatch: Dispatch) => {
  if (payload == null) {
    return;
  }
  dispatch(setUpdatedDeal(payload));
};

const handleDealDeleted = (payload: DealView) => (dispatch: Dispatch) => {
  if (payload == null) {
    return;
  }
  dispatch(setDeletedDeal(payload));
};

const handleReminderCreated = (payload: any) => (dispatch: Dispatch) => {
  if (payload == null) {
    return;
  }
  dispatch(setNewReminder(payload));
  setTimeout(() => dispatch(setNewReminder(null)), 600);
};

const handleReminderUpdated = (payload: any) => (dispatch: Dispatch) => {
  if (payload == null) {
    return;
  }
  dispatch(setUpdatedReminder(payload));
  setTimeout(() => dispatch(setUpdatedReminder(null)), 1000);
};

const handleUserAccessChanged = (payload: any) => (dispatch: Dispatch) => {
  if (payload == null) {
    return;
  }
  dispatch(setUserClinicAccessChange(payload));
  setTimeout(() => dispatch(setUserClinicAccessChange(null)), 600);
};

const handleInvoiceCreated =
  (payload: ShortInvoice) => (dispatch: Dispatch, getState) => {
    dispatch(addInvoice(payload));
    const appState = getState();
    const userClinic = userClinicSelector(appState);
    if (
      userClinic.roleInClinic !== Role.doctor &&
      userClinic.canRegisterPayments
    ) {
      dispatch(showSuccessNotification(textForKey('invoice_created')));
    }
  };

const handleInvoiceUpdated =
  (payload: ShortInvoice) => (dispatch: Dispatch, getState) => {
    const appState = getState();
    const scheduleDetails = scheduleDetailsSelector(appState);
    dispatch(updateInvoice(payload));
    if (scheduleDetails != null && payload.scheduleId === scheduleDetails.id) {
      dispatch(updateScheduleDetails(payload.scheduleId));
    }
  };

const handleUserCanCreateScheduleChanged =
  (payload) => (dispatch: Dispatch, getState) => {
    const appState = getState();
    const currentUser = currentUserSelector(appState);
    if (currentUser.id !== payload.id) {
      // no need to handle if the received user is not same as current user
      return;
    }
    dispatch(setCurrentUser(payload));
  };
