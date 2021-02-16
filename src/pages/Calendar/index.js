import React, { useCallback, useEffect, useReducer } from 'react';

import './styles.scss';
import { Box } from '@material-ui/core';
import { usePubNub } from 'pubnub-react';
import { ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { START_TIMER, STOP_TIMER } from 'redux-timer-middleware';

import ConfirmationModal from '../../components/ConfirmationModal';
import { MappingData } from '../../components/MapSchedulesDataModal';
import {
  setAppointmentModal,
  setPaymentModal,
  toggleAppointmentsUpdate,
  toggleImportModal,
} from '../../redux/actions/actions';
import {
  clinicActiveDoctorsSelector,
  clinicServicesSelector,
} from '../../redux/selectors/clinicSelector';
import { userSelector } from '../../redux/selectors/rootSelector';
import types from '../../redux/types/types';
import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import { generateReducerActions, logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import AppointmentsCalendar from './comps/center/AppointmentsCalendar';
import CalendarDoctors from './comps/left/CalendarDoctors';

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
  setMappingModal: 'setMappingModal',
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
    case reducerTypes.setMappingModal:
      return { ...state, mappingModal: action.payload };
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
  mappingModal: {
    mode: MappingData.none,
    data: null,
  },
  isParsing: false,
  parsedValue: 0,
};

const Calendar = () => {
  const pubnub = usePubNub();
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);
  const services = useSelector(clinicServicesSelector);
  const doctors = useSelector(clinicActiveDoctorsSelector);
  const [
    {
      filters,
      selectedService,
      selectedDoctor,
      isFetching,
      viewDate,
      selectedSchedule,
      deleteSchedule,
      isDeleting,
      viewMode,
      isUploading,
      isParsing,
      parsedValue,
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
  }, [doctors, services]);

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
        console.log('set is parsing');
        localDispatch(reducerActions.setIsParsing(true));
      }
      const percentage = (count / total) * 100;
      localDispatch(reducerActions.setParsedValue(Math.round(percentage)));
    }
  };

  const handleAppointmentModalOpen = useCallback(
    (doctor, startHour, endHour) => {
      dispatch(
        setAppointmentModal({
          open: true,
          doctor: viewMode === 'day' ? doctor : selectedDoctor,
          startHour,
          endHour,
          date: viewDate,
        }),
      );
    },
    [],
  );

  const handleDoctorSelected = (doctor) => {
    localDispatch(reducerActions.setSelectedDoctor(doctor));
  };

  const handleViewDateChange = useCallback((newDate) => {
    localDispatch(reducerActions.setViewDate(newDate));
  }, []);

  const handleScheduleSelected = useCallback((schedule) => {
    localDispatch(reducerActions.setSelectedSchedule(schedule));
  }, []);

  const handleViewModeChange = useCallback((newMode) => {
    localDispatch(reducerActions.setViewMode(newMode));
  }, []);

  const handlePayDebt = useCallback((debt) => {
    dispatch(setPaymentModal({ open: true, invoice: debt }));
  }, []);

  const handleEditSchedule = useCallback((schedule) => {
    dispatch(
      setAppointmentModal({
        open: true,
        schedule,
      }),
    );
  }, []);

  const handleDeleteSchedule = useCallback((schedule) => {
    localDispatch(reducerActions.setDeleteSchedule({ open: true, schedule }));
  }, []);

  const handleConfirmDeleteSchedule = async () => {
    if (deleteSchedule.schedule == null) {
      return;
    }
    localDispatch(reducerActions.setIsDeleting(true));
    await dataAPI.deleteSchedule(deleteSchedule.schedule.id);
    logUserAction(
      Action.DeleteAppointment,
      JSON.stringify(deleteSchedule.schedule),
    );
    localDispatch(
      reducerActions.setDeleteSchedule({ open: false, schedule: null }),
    );
    localDispatch(reducerActions.setIsDeleting(false));
    if (selectedSchedule.id === deleteSchedule.schedule.id) {
      localDispatch(reducerActions.setSelectedSchedule(null));
    }
    // dispatch(toggleAppointmentsUpdate());
  };

  const handleCloseDeleteSchedule = () => {
    localDispatch(
      reducerActions.setDeleteSchedule({ open: false, schedule: null }),
    );
  };

  const handleOpenImportModal = useCallback(() => {
    dispatch(toggleImportModal(true));
  }, []);

  const parsingProgressBar = isParsing && (
    <Box
      className='parsing-progress-wrapper'
      position='absolute'
      bottom='2.5rem'
      left='2.5rem'
      right='2.5rem'
    >
      <ProgressBar
        now={parsedValue}
        label={`${parsedValue}%`}
        animated={parsedValue === 100 || parsedValue === 0}
      />
    </Box>
  );

  return (
    <div className='calendar-root'>
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
        <div className='calendar-root__content__left-container'>
          <CalendarDoctors
            isFetching={isFetching}
            selectedDoctor={selectedDoctor}
            selectedService={selectedService}
            doctors={filters.doctors}
            onSelect={handleDoctorSelected}
          />
        </div>
      )}
      <div className='calendar-root__content__center-container'>
        <AppointmentsCalendar
          isUploading={isUploading}
          onPayDebt={handlePayDebt}
          onDeleteSchedule={handleDeleteSchedule}
          onEditSchedule={handleEditSchedule}
          canAddAppointment
          onAddAppointment={handleAppointmentModalOpen}
          selectedSchedule={selectedSchedule}
          onScheduleSelect={handleScheduleSelected}
          onViewDateChange={handleViewDateChange}
          onViewModeChange={handleViewModeChange}
          onImportSchedules={handleOpenImportModal}
          doctor={selectedDoctor}
          viewDate={viewDate}
        />
        {parsingProgressBar}
      </div>
    </div>
  );
};

export default Calendar;
