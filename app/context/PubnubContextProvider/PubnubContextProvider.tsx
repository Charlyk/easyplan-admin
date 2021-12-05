import React, { useCallback, useEffect } from 'react';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { usePubNub } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';
import getUuidByString from 'uuid-by-string';
import { pubNubEnv } from 'eas.config';
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
import {
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { calendarScheduleDetailsSelector } from 'redux/selectors/scheduleSelector';
import { setCurrentClinic } from 'redux/slices/appDataSlice';
import {
  addNewSchedule,
  updateSchedule,
  deleteSchedule,
  fetchScheduleDetails,
} from 'redux/slices/calendarData';
import { setUserClinicAccessChange } from 'redux/slices/clinicDataSlice';
import {
  setDeletedDeal,
  setNewDeal,
  setNewReminder,
  setUpdatedDeal,
  setUpdatedReminder,
} from 'redux/slices/crmSlice';
import { Schedule } from 'types';
import PubnubContext from '../pubnubContext';
import {
  PubnubMessage,
  MessageAction,
  RemoteMessage,
  DealPayload,
  PaymentPayload,
} from './PubnubContextProvider.types';

const PubnubContextProvider: React.FC = ({ children }) => {
  const pubnub = usePubNub();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentClinic = useSelector(currentClinicSelector);
  const currentUser = useSelector(currentUserSelector);
  const scheduleDetails = useSelector(calendarScheduleDetailsSelector);

  const updateUUID = useCallback(() => {
    if (currentUser == null) {
      return;
    }

    const userUUID = getUuidByString(String(currentUser.id));
    pubnub.setUUID(userUUID);
  }, [currentUser]);

  const handleUpdateClinicUsers = useCallback(() => {
    dispatch(triggerUsersUpdate(true));
  }, []);

  const handleUpdateInvoices = useCallback(() => {
    // update appointments list
    dispatch(toggleAppointmentsUpdate());
    // update invoices
    dispatch(toggleUpdateInvoices());
    if (scheduleDetails != null) {
      dispatch(fetchScheduleDetails(scheduleDetails.id));
    }
  }, []);

  const handleUpdateSchedules = useCallback(
    (schedule: Schedule) => {
      dispatch(updateSchedule(schedule));
      setTimeout(() => {
        if (scheduleDetails != null && schedule.id === scheduleDetails.id) {
          dispatch(fetchScheduleDetails(schedule.id));
        }
      });
    },
    [scheduleDetails],
  );

  const handleAddNewSchedule = useCallback((schedule: Schedule) => {
    dispatch(addNewSchedule(schedule));
  }, []);

  const handleDeleteSchedule = useCallback((schedule: Schedule) => {
    dispatch(deleteSchedule(schedule));
    // dispatch(toggleDeleteSchedule(payload));
    // setTimeout(() => dispatch(toggleDeleteSchedule(null)), 600);
  }, []);

  const handleUpdateCurrentClinic = useCallback(async () => {
    try {
      const query = router.query;
      const date = String(query.date ?? moment().format('YYYY-MM-DD'));
      const response = await getClinicDetails(date);
      dispatch(setCurrentClinic(response.data));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleUpdatePatients = useCallback(() => {
    dispatch(togglePatientsListUpdate());
  }, []);

  const handleUpdateExchangeRates = useCallback(() => {
    dispatch(toggleExchangeRateUpdate());
  }, []);

  const handleUpdateExchangeRatesRequired = useCallback(() => {
    dispatch(setClinicExchangeRatesUpdateRequired(true));
  }, []);

  const handleNewPaymentRegistered = useCallback((message: PaymentPayload) => {
    dispatch(toggleUpdateInvoice(message));
    setTimeout(() => dispatch(toggleUpdateInvoice(null)), 600);
  }, []);

  const handleUpdateMessageStatus = useCallback((payload: any) => {
    console.warn('handleUpdateMessageStatus', 'Not handled', payload);
  }, []);

  const handleNewDealCreated = useCallback((payload: DealPayload) => {
    if (payload == null) {
      return;
    }
    dispatch(setNewDeal(payload));
    setTimeout(() => dispatch(setNewDeal(null)), 600);
  }, []);

  const handleDealUpdated = useCallback((payload: DealPayload) => {
    if (payload == null) {
      return;
    }
    dispatch(setUpdatedDeal(payload));
    setTimeout(() => dispatch(setUpdatedDeal(null)), 600);
  }, []);

  const handleDealDeleted = useCallback((payload: DealPayload) => {
    if (payload == null) {
      return;
    }
    dispatch(setDeletedDeal(payload));
    setTimeout(() => dispatch(setDeletedDeal(null)), 600);
  }, []);

  const handleReminderCreated = useCallback((payload: any) => {
    if (payload == null) {
      return;
    }
    dispatch(setNewReminder(payload));
    setTimeout(() => dispatch(setNewReminder(null)), 600);
  }, []);

  const handleReminderUpdated = useCallback((payload: any) => {
    if (payload == null) {
      return;
    }
    dispatch(setUpdatedReminder(payload));
    setTimeout(() => dispatch(setUpdatedReminder(null)), 1000);
  }, []);

  const handleUserAccessChanged = useCallback((payload: any) => {
    if (payload == null) {
      return;
    }
    dispatch(setUserClinicAccessChange(payload));
    setTimeout(() => dispatch(setUserClinicAccessChange(null)), 600);
  }, []);

  const handleRemoteMessage = useCallback(
    (message: RemoteMessage) => {
      const { action, payload: messagePayload } = message;
      const payload =
        messagePayload != null ? JSON.parse(messagePayload) : null;
      switch (action) {
        case MessageAction.NewUserInvited:
        case MessageAction.InvitationRemoved:
        case MessageAction.ClinicInvitationAccepted:
          handleUpdateClinicUsers();
          break;
        case MessageAction.CreatedNewInvoice:
          handleUpdateInvoices();
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
    },
    [dispatch],
  );

  const handlePubnubMessageReceived = useCallback((event: PubnubMessage) => {
    handleRemoteMessage(event.message);
  }, []);

  const subscribeToClinicNotifications = useCallback(() => {
    if (currentClinic == null) {
      return;
    }

    const { id } = currentClinic;
    pubnub.subscribe({
      channels: [`${id}-${pubNubEnv}-clinic-pubnub-channel`],
    });
    pubnub.addListener({ message: handlePubnubMessageReceived });
  }, [currentClinic]);

  const unsubscribeFromClinicNotifications = useCallback(() => {
    if (currentClinic == null) {
      pubnub.unsubscribeAll();
      return;
    }

    const { id } = currentClinic;
    pubnub.unsubscribe({
      channels: [`${id}-${pubNubEnv}-clinic-pubnub-channel`],
    });
  }, [currentClinic]);

  useEffect(() => {
    subscribeToClinicNotifications();
    return () => {
      unsubscribeFromClinicNotifications();
    };
  }, [currentClinic]);

  useEffect(() => {
    updateUUID();
  }, [currentUser]);

  return <PubnubContext.Provider value={{}}>{children}</PubnubContext.Provider>;
};

export default PubnubContextProvider;
