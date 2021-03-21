import React, { useEffect, useReducer } from 'react';

import styles from '../../styles/Calendar.module.scss';
import { usePubNub } from 'pubnub-react';
import { useDispatch } from 'react-redux';
import { START_TIMER, STOP_TIMER } from 'redux-timer-middleware';

import ConfirmationModal from '../common/ConfirmationModal';
import {
  setAppointmentModal,
  setPaymentModal,
  toggleAppointmentsUpdate,
  toggleImportModal,
} from '../../redux/actions/actions';
import types from '../../redux/types/types';
import { Role } from '../../utils/constants';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import AppointmentsCalendar from './AppointmentsCalendar';
import CalendarDoctors from './AppointmentsCalendar/CalendarDoctors';
import moment from "moment-timezone";
import { useRouter } from "next/router";
import MainComponent from "../common/MainComponent";
import axios from "axios";
import { baseAppUrl } from "../../eas.config";
import { toast } from "react-toastify";

const reducerTypes = {
  setFilters: 'setFilters',
  setSelectedService: 'setSelectedService',
  setSelectedDoctor: 'setSelectedDoctor',
  setViewDate: 'setViewDate',
  setIsFetching: 'setIsFetching',
  setSelectedSchedule: 'setSelectedSchedule',
  setDeleteSchedule: 'setDeleteSchedule',
  setIsDeleting: 'setIsDeleting',
  setViewMode: 'setViewMode',
  setShowImportModal: 'setShowImportModal',
  setSetupExcelModal: 'setSetupExcelModal',
  setIsUploading: 'setIsUploading',
  setImportData: 'setImportData',
  setParsedValue: 'setParsedValue',
  setIsParsing: 'setIsParsing',
};

const reducerActions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setFilters:
      return { ...state, filters: action.payload };
    case reducerTypes.setSelectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.setSelectedDoctor:
      return {
        ...state,
        selectedDoctor: action.payload,
        selectedSchedule: null,
      };
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setViewDate:
      return { ...state, viewDate: action.payload, selectedSchedule: null };
    case reducerTypes.setSelectedSchedule:
      return { ...state, selectedSchedule: action.payload };
    case reducerTypes.setDeleteSchedule:
      return { ...state, deleteSchedule: action.payload };
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    case reducerTypes.setViewMode:
      return { ...state, viewMode: action.payload, selectedSchedule: null };
    case reducerTypes.setShowImportModal:
      return { ...state, showImportModal: action.payload };
    case reducerTypes.setSetupExcelModal:
      return { ...state, setupExcelModal: action.payload };
    case reducerTypes.setIsUploading:
      return { ...state, isUploading: action.payload };
    case reducerTypes.setImportData:
      return {
        ...state,
        importData: { ...state.importData, ...action.payload },
      };
    case reducerTypes.setParsedValue:
      return { ...state, parsedValue: action.payload };
    case reducerTypes.setIsParsing:
      return { ...state, isParsing: action.payload };
    default:
      return state;
  }
};

const initialState = {
  filters: { doctors: [], services: [] },
  selectedService: null,
  selectedDoctor: null,
  appointmentModal: { open: false },
  isFetching: false,
  viewDate: new Date(),
  deleteSchedule: { open: false, schedule: null },
  isDeleting: false,
  viewMode: 'day',
  showImportModal: false,
  setupExcelModal: { open: false, data: null },
  isUploading: false,
  importData: {
    fileUrl: null,
    fileName: null,
    cellTypes: [],
    doctors: [],
    services: [],
  },
  isParsing: false,
  parsedValue: 0,
};

const Calendar = ({ date, viewMode, currentUser, currentClinic, children }) => {
  const router = useRouter();
  const pubnub = usePubNub();
  const dispatch = useDispatch();
  const services = currentClinic.services?.filter((item) => !item.deleted) || [];
  const doctors = currentClinic.users.filter((item) => item.roleInClinic === Role.doctor && !item.isHidden);
  const viewDate = moment(date).toDate();
  const [
    {
      filters,
      selectedService,
      selectedDoctor,
      isFetching,
      selectedSchedule,
      deleteSchedule,
      isDeleting,
      isUploading,
      isParsing,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    pubnub.subscribe({
      channels: [`${currentUser.id}-import_schedules_channel`],
    });
    pubnub.addListener({ message: handlePubnubMessageReceived });
    dispatch({
      type: START_TIMER,
      payload: {
        actionName: types.checkAppointments,
        timerName: 'appointmentsTimer',
        timerInterval: 10 * 1000,
      },
    });
    return () => {
      dispatch({
        type: STOP_TIMER,
        payload: {
          actionName: types.checkAppointments,
          timerName: 'appointmentsTimer',
          timerInterval: 10 * 1000,
        },
      });
      pubnub.unsubscribe({
        channels: [`${currentUser.id}-import_schedules_channel`],
      });
    };
  }, []);

  useEffect(() => {
    const newDoctors = doctors.map((item) => {
      const servicesIds = item.services.map((service) => service.seviceId);
      return {
        ...item,
        services: services.filter((service) =>
          servicesIds.includes(service.serviceId),
        ),
      };
    });
    localDispatch(reducerActions.setFilters({ doctors: newDoctors, services }));
    if (newDoctors.length > 0) {
      localDispatch(reducerActions.setSelectedDoctor(newDoctors[0]));
    }
  }, [currentClinic]);

  const handlePubnubMessageReceived = (remoteMessage) => {
    const { message, channel } = remoteMessage;
    if (channel !== `${currentUser.id}-import_schedules_channel`) {
      return;
    }
    const { count, total, done } = message;
    if (done) {
      localDispatch(reducerActions.setParsedValue(100));
      setTimeout(() => {
        localDispatch(reducerActions.setIsParsing(false));
        dispatch(toggleAppointmentsUpdate());
      }, 3500);
    } else {
      if (!isParsing) {
        localDispatch(reducerActions.setIsParsing(true));
      }
      const percentage = (count / total) * 100;
      localDispatch(reducerActions.setParsedValue(Math.round(percentage)));
    }
  };

  const handleAppointmentModalOpen = (doctor, startHour, endHour) => {
    dispatch(
      setAppointmentModal({
        open: true,
        doctor: viewMode === 'day' ? doctor : selectedDoctor,
        startHour,
        endHour,
        date: viewDate,
      }),
    );
  };

  const handleDoctorSelected = (doctor) => {
    localDispatch(reducerActions.setSelectedDoctor(doctor));
  };

  const handleViewDateChange = (newDate, moveToDay) => {
    const stringDate = moment(newDate).format('YYYY-MM-DD');
    router.replace({
      pathname: `/calendar/${moveToDay ? 'day' : viewMode}`,
      query: { date: stringDate },
    });
  };

  const handleScheduleSelected = (schedule) => {
    localDispatch(reducerActions.setSelectedSchedule(schedule));
  };

  const handleViewModeChange = (newMode) => {
    localDispatch(reducerActions.setViewMode(newMode));
    const stringDate = moment(viewDate).format('YYYY-MM-DD');
    router.replace({
      pathname: `/calendar/${newMode}`,
      query: { date: stringDate }
    })
  };

  const handlePayDebt = (debt) => {
    dispatch(setPaymentModal({ open: true, invoice: debt }));
  };

  const handleEditSchedule = (schedule) => {
    dispatch(
      setAppointmentModal({
        open: true,
        schedule,
      }),
    );
  };

  const handleDeleteSchedule = (schedule) => {
    localDispatch(reducerActions.setDeleteSchedule({ open: true, schedule }));
  };

  const handleConfirmDeleteSchedule = async () => {
    if (deleteSchedule.schedule == null) {
      return;
    }
    localDispatch(reducerActions.setIsDeleting(true));
    try {
      await axios.delete(`${baseAppUrl}/api/schedules/${deleteSchedule.schedule.id}`);
      localDispatch(
        reducerActions.setDeleteSchedule({ open: false, schedule: null }),
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(reducerActions.setIsDeleting(false));
      if (selectedSchedule.id === deleteSchedule.schedule.id) {
        localDispatch(reducerActions.setSelectedSchedule(null));
      }
    }
  };

  const handleCloseDeleteSchedule = () => {
    localDispatch(
      reducerActions.setDeleteSchedule({ open: false, schedule: null }),
    );
  };

  const handleOpenImportModal = () => {
    dispatch(toggleImportModal(true));
  };

  return (
    <MainComponent currentUser={currentUser} currentClinic={currentClinic} currentPath='/calendar'>
      <div className={styles['calendar-root']}>
        {deleteSchedule.open && (
          <ConfirmationModal
            isLoading={isDeleting}
            show={deleteSchedule.open}
            title={textForKey('Delete appointment')}
            message={textForKey('delete appointment message')}
            onConfirm={handleConfirmDeleteSchedule}
            onClose={handleCloseDeleteSchedule}
          />
        )}
        {viewMode !== 'day' && (
          <div className={styles['calendar-root__content__left-container']}>
            <CalendarDoctors
              isFetching={isFetching}
              selectedDoctor={selectedDoctor}
              selectedService={selectedService}
              doctors={filters.doctors}
              onSelect={handleDoctorSelected}
            />
          </div>
        )}
        <div className={styles['calendar-root__content__center-container']}>
          <AppointmentsCalendar
            canAddAppointment
            viewMode={viewMode}
            isUploading={isUploading}
            doctor={selectedDoctor}
            doctors={doctors}
            viewDate={viewDate}
            selectedSchedule={selectedSchedule}
            onPayDebt={handlePayDebt}
            onDeleteSchedule={handleDeleteSchedule}
            onEditSchedule={handleEditSchedule}
            onAddAppointment={handleAppointmentModalOpen}
            onScheduleSelect={handleScheduleSelected}
            onViewDateChange={handleViewDateChange}
            onViewModeChange={handleViewModeChange}
            onImportSchedules={handleOpenImportModal}
          >
            {children}
          </AppointmentsCalendar>
        </div>
      </div>
    </MainComponent>
  );
};

export default Calendar;
