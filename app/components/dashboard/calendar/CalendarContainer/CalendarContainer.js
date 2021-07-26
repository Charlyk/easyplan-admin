import React, { useEffect, useReducer } from 'react';

import { usePubNub } from 'pubnub-react';
import { useDispatch } from 'react-redux';
import moment from "moment-timezone";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

import ConfirmationModal from '../../../common/modals/ConfirmationModal';
import {
  setAppointmentModal,
  setPaymentModal,
  toggleAppointmentsUpdate,
  toggleImportModal,
} from '../../../../../redux/actions/actions';
import { redirectIfOnGeneralHost } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import AppointmentsCalendar from '../AppointmentsCalendar';
import CalendarDoctors from '../CalendarDoctors';
import MainComponent from "../../../../../components/common/MainComponent";
import { reducer, initialState, reducerActions } from './CalendarContainer.reducer';
import styles from './CalendarContainer.module.scss';

const CalendarContainer = (
  {
    date,
    doctorId,
    doctors,
    viewMode,
    currentUser,
    currentClinic,
    children,
    authToken
  }
) => {
  const router = useRouter();
  const pubnub = usePubNub();
  const dispatch = useDispatch();
  const services = currentClinic?.services?.filter((item) => !item.deleted) || [];
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
  ] = useReducer(reducer, {
    ...initialState,
    filters: {
      ...initialState.filters,
      doctors,
    }
  });

  useEffect(() => {
    if (currentUser == null) {
      return
    }
    redirectIfOnGeneralHost(currentUser, router);

    pubnub.subscribe({
      channels: [`${currentUser.id}-import_schedules_channel`],
    });
    pubnub.addListener({ message: handlePubnubMessageReceived });
    return () => {
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
    if (newDoctors.length > 0 && doctorId == null) {
      localDispatch(reducerActions.setSelectedDoctor(newDoctors[0]));
    }

    // set selected doctor
    if (doctorId != null) {
      const doctor = newDoctors.find((item) => item.id === parseInt(doctorId));
      localDispatch(reducerActions.setSelectedDoctor(doctor));
    }
  }, [currentClinic, doctorId]);

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

  const handleAppointmentModalOpen = (doctor, startHour, endHour, selectedDate = null) => {
    dispatch(
      setAppointmentModal({
        open: true,
        doctor: viewMode === 'day'
          ? doctor
          : viewMode !== 'day'
            ? selectedDoctor
            : null,
        startHour,
        endHour,
        date: selectedDate ?? viewDate,
      }),
    );
  };

  const handleDoctorSelected = async (doctor) => {
    const dateString = moment(viewDate).format('YYYY-MM-DD')
    await router.replace({
      pathname: `/calendar/${viewMode}`,
      query: {
        doctorId: doctor.id ?? doctorId,
        date: dateString
      }
    });
  };

  const handleViewDateChange = async (newDate, moveToDay) => {
    const stringDate = moment(newDate).format('YYYY-MM-DD');
    const query = {
      date: stringDate,
    }
    if (doctorId != null) {
      query.doctorId = doctorId;
    }
    await router.replace({
      pathname: `/calendar/${moveToDay ? 'day' : viewMode}`,
      query,
    });
  };

  const handleScheduleSelected = (schedule) => {
    localDispatch(reducerActions.setSelectedSchedule(schedule));
  };

  const handleViewModeChange = async (newMode) => {
    localDispatch(reducerActions.setViewMode(newMode));
    const stringDate = moment(viewDate).format('YYYY-MM-DD');
    const query = { date: stringDate };
    if (newMode !== 'day' && doctorId != null) {
      query.doctorId = doctorId;
    }
    await router.replace({
      pathname: `/calendar/${newMode}`,
      query: query
    })
  };

  const handlePayDebt = (debt) => {
    dispatch(setPaymentModal({ open: true, invoice: debt, schedule: null }));
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
      await axios.delete(`/api/schedules/${deleteSchedule.schedule.id}`);
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
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/calendar'
      authToken={authToken}
    >
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

export default CalendarContainer;
