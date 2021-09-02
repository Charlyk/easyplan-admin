import React, { useEffect, useReducer } from 'react';

import { usePubNub } from 'pubnub-react';
import { useDispatch } from 'react-redux';
import moment from "moment-timezone";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

import {
  setAppointmentModal,
  setPaymentModal,
  toggleAppointmentsUpdate,
} from '../../../../../redux/actions/actions';
import { redirectIfOnGeneralHost } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import ConfirmationModal from '../../../common/modals/ConfirmationModal';
import MainComponent from "../../../common/MainComponent/MainComponent";
import AppointmentsCalendar from '../AppointmentsCalendar';
import CalendarDoctors from '../CalendarDoctors';
import reducer, {
  initialState,
  setParsedValue,
  setIsDeleting,
  setSelectedDoctor,
  setDeleteSchedule,
  setIsUploading,
  setFilters,
  setIsParsing,
  setSelectedSchedule,
  setViewMode,
  setShowImportModal,
} from './CalendarContainer.reducer';
import styles from './CalendarContainer.module.scss';
import CSVImportModal from "../../../common/CSVImportModal";
import { importSchedulesFromFile } from "../../../../../middleware/api/schedules";
import { HeaderKeys } from "../../../../utils/constants";

const importFields = [
  {
    id: 'date',
    name: textForKey('Date'),
    required: true,
  },
  {
    id: 'time',
    name: textForKey('Time'),
    required: true,
  },
  {
    id: 'doctor',
    name: textForKey('Doctor'),
    required: true,
  },
  {
    id: 'serviceName',
    name: textForKey('Service'),
    required: false,
  },
  {
    id: 'patientName',
    name: textForKey('Patient name'),
    required: false,
  },
  {
    id: 'phoneNumber',
    name: textForKey('Patient phone'),
    required: true,
  },
  {
    id: 'countryCode',
    name: textForKey('Country code'),
    required: true,
  },
  {
    id: 'status',
    name: textForKey('Status'),
    required: false,
  },
  {
    id: 'comment',
    name: textForKey('Comment'),
    required: false,
  },
  {
    id: 'importedId',
    name: textForKey('ID'),
    required: false,
  },
];

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
      showImportModal,
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
    const newDoctors = doctors?.map((item) => {
      const servicesIds = item.services.map((service) => service.seviceId);
      return {
        ...item,
        services: services.filter((service) =>
          servicesIds.includes(service.serviceId),
        ),
      };
    }) ?? [];
    localDispatch(setFilters({ doctors: newDoctors, services }));
    if (newDoctors.length > 0 && doctorId == null) {
      localDispatch(setSelectedDoctor(newDoctors[0]));
    }

    // set selected doctor
    if (doctorId != null) {
      const doctor = newDoctors.find((item) => item.id === parseInt(doctorId));
      localDispatch(setSelectedDoctor(doctor));
    }
  }, [currentClinic, doctorId]);

  const handlePubnubMessageReceived = (remoteMessage) => {
    const { message, channel } = remoteMessage;
    if (channel !== `${currentUser.id}-import_schedules_channel`) {
      return;
    }
    const { count, total, done } = message;
    if (done) {
      localDispatch(setParsedValue(100));
      setTimeout(() => {
        localDispatch(setIsParsing(false));
        dispatch(toggleAppointmentsUpdate());
      }, 3500);
    } else {
      if (!isParsing) {
        localDispatch(setIsParsing(true));
      }
      const percentage = (count / total) * 100;
      localDispatch(setParsedValue(Math.round(percentage)));
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

  const handleCloseImportModal = () => {
    localDispatch(setShowImportModal(false));
  }

  const handleImportSchedules = async (file, fields) => {
    try {
      localDispatch(setIsUploading(true));
      const mappedFields = fields.map(item => ({ fieldId: item.id, index: item.index }));
      await importSchedulesFromFile(file, mappedFields, 'MMM dd yyyy',{
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      handleCloseImportModal();
      router.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsUploading(false));
    }
  }

  const handleScheduleSelected = (schedule) => {
    localDispatch(setSelectedSchedule(schedule));
  };

  const handleViewModeChange = async (newMode) => {
    localDispatch(setViewMode(newMode));
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
    localDispatch(setDeleteSchedule({ open: true, schedule }));
  };

  const handleConfirmDeleteSchedule = async () => {
    if (deleteSchedule.schedule == null) {
      return;
    }
    localDispatch(setIsDeleting(true));
    try {
      await axios.delete(`/api/schedules/${deleteSchedule.schedule.id}`);
      localDispatch(
        setDeleteSchedule({ open: false, schedule: null }),
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsDeleting(false));
      if (selectedSchedule.id === deleteSchedule.schedule.id) {
        localDispatch(setSelectedSchedule(null));
      }
    }
  };

  const handleCloseDeleteSchedule = () => {
    localDispatch(
      setDeleteSchedule({ open: false, schedule: null }),
    );
  };

  const handleOpenImportModal = () => {
    localDispatch(setShowImportModal(true));
  };

  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/calendar'
      authToken={authToken}
    >
      <div className={styles.calendarRoot}>
        <CSVImportModal
          open={showImportModal}
          isLoading={isUploading}
          fields={importFields}
          title={textForKey('Import schedules')}
          importBtnTitle={textForKey('import_n_schedules')}
          onClose={handleCloseImportModal}
          onImport={handleImportSchedules}
        />
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
          <div className={styles.leftContainer}>
            <CalendarDoctors
              isFetching={isFetching}
              selectedDoctor={selectedDoctor}
              selectedService={selectedService}
              doctors={filters.doctors}
              onSelect={handleDoctorSelected}
            />
          </div>
        )}
        <div className={styles.centerContainer}>
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
