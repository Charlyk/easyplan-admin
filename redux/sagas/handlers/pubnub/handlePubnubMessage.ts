import { PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { fetchExchangeRatesList } from 'app/components/common/MainComponent/ExchageRates/ExchangeRates.slice';
import {
  addInvoice,
  removeInvoice,
  updateInvoice,
} from 'app/components/dashboard/InvoicesButton/InvoicesButton.slice';
import { Role } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { setClinicExchangeRatesUpdateRequired } from 'redux/actions/clinicActions';
import { toggleUpdateInvoice } from 'redux/actions/invoiceActions';
import {
  currentUserSelector,
  userClinicSelector,
} from 'redux/selectors/appDataSelector';
import { scheduleDetailsSelector } from 'redux/selectors/doctorScheduleDetailsSelector';
import { calendarScheduleDetailsSelector } from 'redux/selectors/scheduleSelector';
import {
  requestUpdateCurrentClinic,
  setCurrentUser,
} from 'redux/slices/appDataSlice';
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
import {
  toggleUpdatePatients,
  updateUsersList,
} from 'redux/slices/mainReduxSlice';
import { handleRemoteMessageReceived } from 'redux/slices/pubnubMessagesSlice';
import {
  DealView,
  MessageAction,
  PatientDebt,
  PubnubMessage,
  Schedule,
  ShortInvoice,
} from 'types';

export function* handlePubnubMessage(event: PayloadAction<PubnubMessage>) {
  try {
    const { action, payload: messagePayload } = event.payload.message;
    const payload = messagePayload != null ? JSON.parse(messagePayload) : null;
    switch (action) {
      case MessageAction.NewUserInvited:
      case MessageAction.InvitationRemoved:
      case MessageAction.ClinicInvitationAccepted:
        yield call(handleUpdateClinicUsers);
        break;
      case MessageAction.PauseUpdated:
      case MessageAction.ScheduleUpdated:
        yield call(handleUpdateSchedules, payload);
        break;
      case MessageAction.PauseCreated:
      case MessageAction.ScheduleCreated:
        yield call(handleAddNewSchedule, payload);
        break;
      case MessageAction.ScheduleDeleted:
        yield call(handleDeleteSchedule, payload);
        break;
      case MessageAction.UserCalendarVisibilityChanged:
      case MessageAction.UserRestoredInClinic:
      case MessageAction.UserRemovedFromClinic:
        yield call(handleUpdateCurrentClinic);
        break;
      case MessageAction.ClinicDataImportStarted:
      case MessageAction.ClinicDataImported:
        yield call(handleUpdatePatients);
        break;
      case MessageAction.ExchangeRatesUpdated:
        yield call(handleUpdateExchangeRates);
        break;
      case MessageAction.ExchangeRatesUpdateRequired:
        yield call(handleUpdateExchangeRatesRequired);
        break;
      case MessageAction.NewPaymentRegistered:
        yield call(handleNewPaymentRegistered, payload);
        break;
      case MessageAction.UpdateMessageStatus:
        yield call(handleUpdateMessageStatus, payload);
        break;
      case MessageAction.NewDealCreated:
        yield call(handleNewDealCreated, payload);
        break;
      case MessageAction.DealDataUpdated:
        yield call(handleDealUpdated, payload);
        break;
      case MessageAction.DealRemoved:
        yield call(handleDealDeleted, payload);
        break;
      case MessageAction.DealReminderCreated:
        yield call(handleReminderCreated, payload);
        break;
      case MessageAction.ReminderIsDueDate:
      case MessageAction.DealReminderUpdated:
        yield call(handleReminderUpdated, payload);
        break;
      case MessageAction.UserAccessRestored:
      case MessageAction.UserAccessBlocked:
        yield call(handleUserAccessChanged, payload);
        break;
      case MessageAction.InvoiceCreated:
        yield call(handleInvoiceCreated, payload);
        break;
      case MessageAction.InvoiceUpdated:
        yield call(handleInvoiceUpdated, payload);
        break;
      case MessageAction.UserCanCreateScheduleChanged:
        yield call(handleUserCanCreateScheduleChanged, payload);
        break;
    }
  } catch (error) {
    console.error('error receiving message', error);
  }
}

function* updateScheduleDetails(detailsId: number) {
  yield put(fetchScheduleDetails(detailsId));
}

function* handleUpdateClinicUsers() {
  yield put(updateUsersList());
}

function* handleUpdateSchedules(schedule: Schedule) {
  const scheduleDetails = yield select(calendarScheduleDetailsSelector);
  yield put(updateSchedule(schedule));
  if (scheduleDetails != null && schedule.id === scheduleDetails.id) {
    yield call(updateScheduleDetails, schedule.id);
  }
}

function* handleAddNewSchedule(schedule: Schedule) {
  const currentUser = yield select(currentUserSelector);
  const userClinic = yield select(userClinicSelector);
  if (
    userClinic.roleInClinic !== Role.doctor ||
    currentUser.id === schedule.doctorId
  ) {
    yield put(addNewSchedule(schedule));
  }
}

function* handleDeleteSchedule(schedule: Schedule) {
  yield put(deleteSchedule(schedule));
}

function* handleUpdateCurrentClinic() {
  const date = String(moment().format('YYYY-MM-DD'));
  yield put(requestUpdateCurrentClinic(date));
}

function* handleUpdatePatients() {
  yield put(toggleUpdatePatients());
}

function* handleUpdateExchangeRates() {
  yield put(fetchExchangeRatesList());
}

function* handleUpdateExchangeRatesRequired() {
  yield put(setClinicExchangeRatesUpdateRequired(true));
}

function* handleNewPaymentRegistered(message: PatientDebt) {
  const scheduleDetails = yield select(scheduleDetailsSelector);
  yield put(removeInvoice(message));
  yield put(toggleUpdateInvoice(message));
  if (
    scheduleDetails != null &&
    message.patientId === scheduleDetails.patient.id
  ) {
    yield call(updateScheduleDetails, scheduleDetails.id);
  }
}

function handleUpdateMessageStatus(payload: any) {
  console.warn('handleUpdateMessageStatus', 'Not handled', payload);
}

function* handleNewDealCreated(payload: DealView) {
  if (payload == null) {
    return;
  }
  yield put(setNewDeal(payload));
}

function* handleDealUpdated(payload: DealView) {
  if (payload == null) {
    return;
  }
  yield put(setUpdatedDeal(payload));
}

function* handleDealDeleted(payload: DealView) {
  if (payload == null) {
    return;
  }
  yield put(setDeletedDeal(payload));
}

function* handleReminderCreated(payload: any) {
  if (payload == null) {
    return;
  }
  yield put(setNewReminder(payload));
}

function* handleReminderUpdated(payload: any) {
  if (payload == null) {
    return;
  }
  yield put(setUpdatedReminder(payload));
}

function* handleUserAccessChanged(payload: any) {
  if (payload == null) {
    return;
  }
  yield put(setUserClinicAccessChange(payload));
}

function* handleInvoiceCreated(payload: ShortInvoice) {
  yield put(addInvoice(payload));
  const userClinic = yield select(userClinicSelector);
  if (
    userClinic.roleInClinic !== Role.doctor &&
    userClinic.canRegisterPayments
  ) {
    yield put(showSuccessNotification(textForKey('invoice_created')));
  }
}

function* handleInvoiceUpdated(payload: ShortInvoice) {
  const scheduleDetails = yield select(scheduleDetailsSelector);
  yield put(updateInvoice(payload));
  if (scheduleDetails != null && payload.scheduleId === scheduleDetails.id) {
    yield call(updateScheduleDetails, payload.scheduleId);
  }
}

function* handleUserCanCreateScheduleChanged(payload) {
  const currentUser = yield select(currentUserSelector);
  if (currentUser.id !== payload.id) {
    // no need to handle if the received user is not same as current user
    return;
  }
  yield put(setCurrentUser(payload));
}

export function* pubnubWatcher() {
  yield takeEvery(handleRemoteMessageReceived.type, handlePubnubMessage);
}
