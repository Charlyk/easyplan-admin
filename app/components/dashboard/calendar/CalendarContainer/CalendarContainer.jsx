import React, { useContext, useEffect, useReducer } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import MainComponent from 'app/components/common/MainComponent';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { HeaderKeys } from 'app/utils/constants';
import getCurrentWeek from 'app/utils/getCurrentWeek';
import { textForKey } from 'app/utils/localization';
import {
  importSchedulesFromFile,
  requestDeleteSchedule,
} from 'middleware/api/schedules';
import { setPaymentModal } from 'redux/actions/actions';
import {
  authTokenSelector,
  calendarDoctorsSelector,
  currentClinicSelector,
  clinicTimeZoneSelector,
} from 'redux/selectors/appDataSelector';
import { updateClinicDataSelector } from 'redux/selectors/clinicDataSelector';
import {
  openAppointmentModal,
  setAppointmentFormData,
  setStartHours,
  setSelectedDate,
  setAppointmentServices,
  setEndHours,
} from 'redux/slices/appointmentSlice';
import { setSearchedPatients } from 'redux/slices/patientsAutocompleteSlice';
import styles from './CalendarContainer.module.scss';
import reducer, {
  initialState,
  setIsDeleting,
  setSelectedDoctor,
  setDeleteSchedule,
  setIsUploading,
  setFilters,
  setSelectedSchedule,
  setViewMode,
  setShowImportModal,
} from './CalendarContainer.reducer';

const CSVImportModal = dynamic(() =>
  import('app/components/common/CSVImportModal'),
);
const ConfirmationModal = dynamic(() =>
  import('../../../common/modals/ConfirmationModal'),
);
const CalendarDoctors = dynamic(() => import('../CalendarDoctors'));
const AppointmentsCalendar = dynamic(() => import('../AppointmentsCalendar'));

const importFields = [
  {
    id: 'doctor',
    name: textForKey('Doctor'),
    required: true,
  },
  {
    id: 'date',
    name: textForKey('Date'),
    required: false,
  },
  {
    id: 'time',
    name: textForKey('Time'),
    required: false,
  },
  {
    id: 'cabinet',
    name: textForKey('cabinet'),
    required: false,
  },
  {
    id: 'startTime',
    name: textForKey('import_start_date'),
    required: false,
  },
  {
    id: 'endTime',
    name: textForKey('import_end_time'),
    required: false,
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
    required: false,
  },
  {
    id: 'countryCode',
    name: textForKey('Country code'),
    required: false,
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

const CalendarContainer = ({ date, doctorId, viewMode, children }) => {
  const toast = useContext(NotificationsContext);
  const updateClinicData = useSelector(updateClinicDataSelector);
  const doctors = useSelector(calendarDoctorsSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const authToken = useSelector(authTokenSelector);
  const timeZone = useSelector(clinicTimeZoneSelector);
  const router = useRouter();
  const dispatch = useDispatch();
  const services =
    currentClinic?.services?.filter((item) => !item.deleted) || [];
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
    },
    localDispatch,
  ] = useReducer(reducer, {
    ...initialState,
    filters: {
      ...initialState.filters,
      doctors,
    },
  });

  useEffect(() => {
    if (!updateClinicData) {
      return;
    }
    router.replace(router.asPath);
  }, [updateClinicData]);

  useEffect(() => {
    const newDoctors =
      doctors?.map((item) => {
        const servicesIds = item.services.map((service) => service.seviceId);
        return {
          ...item,
          services: services.filter((service) =>
            servicesIds.includes(service.serviceId),
          ),
        };
      }) ?? [];
    localDispatch(setFilters({ doctors: newDoctors, services }));
  }, [currentClinic]);

  useEffect(() => {
    updateSelectedDoctor(doctorId);
  }, [doctorId, doctors]);

  const updateSelectedDoctor = (doctorId) => {
    if (doctorId != null) {
      const doctor = doctors.find((item) => item.id === parseInt(doctorId));
      localDispatch(setSelectedDoctor(doctor ?? doctors[0]));
    } else {
      localDispatch(setSelectedDoctor(doctors[0]));
    }
  };

  const handleAppointmentModalOpen = (
    doctor,
    startHour,
    endHour,
    selectedDate = null,
    patient,
    cabinet,
  ) => {
    if (doctor?.isHidden) {
      toast.warn(textForKey('doctor_is_fired'));
      return;
    }
    dispatch(setStartHours([startHour]));
    dispatch(setSelectedDate(selectedDate?.toString()));
    dispatch(
      setAppointmentFormData({
        startHour: startHour ?? '',
        doctorId: doctor?.id ?? -1,
        cabinetId: cabinet?.id ?? -1,
      }),
    );
    dispatch(openAppointmentModal());
  };

  const handleDoctorSelected = async (doctor) => {
    if (router.query?.doctorId === doctor.id.toString()) return;
    const dateString = moment(viewDate).format('YYYY-MM-DD');
    updateSelectedDoctor(doctor.id);
    await router.replace({
      pathname: `/calendar/${viewMode}`,
      query: {
        date: dateString,
        doctorId: doctor.id,
      },
    });
  };

  const handleViewDateChange = async (newDate, moveToDay) => {
    const stringDate = moment(newDate).format('YYYY-MM-DD');
    const query = {
      date: stringDate,
      doctorId: doctorId,
    };

    if (viewMode === 'day') {
      if (router.query.date === query.date) return;
    }
    if (viewMode === 'week') {
      const week = getCurrentWeek(viewDate);
      const date = moment(newDate);
      if (
        date.isBetween(
          week[0].toDate(),
          week[week.length - 1].toDate(),
          undefined,
          '[]',
        )
      )
        return;
    }
    if (viewMode === 'month' && !moveToDay) {
      const newDateMonth = new Date(newDate).getMonth();
      const viewDateMonth = new Date(viewDate).getMonth();
      if (newDateMonth === viewDateMonth) return;
    }

    if (query.doctorId == null || viewMode === 'day' || moveToDay) {
      delete query.doctorId;
    }

    await router.replace(
      {
        pathname: `/calendar/${moveToDay ? 'day' : viewMode}`,
        query,
      },
      null,
      { scroll: true },
    );
  };

  const handleCloseImportModal = () => {
    localDispatch(setShowImportModal(false));
  };

  const handleImportSchedules = async (file, fields) => {
    try {
      localDispatch(setIsUploading(true));
      const mappedFields = fields.map((item) => ({
        fieldId: item.id,
        index: item.index,
      }));
      //2018-03-27 07:00:00
      await importSchedulesFromFile(file, mappedFields, 'yyyy-MM-dd HH:mm:ss', {
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
  };

  const handleScheduleSelected = (schedule) => {
    localDispatch(setSelectedSchedule(schedule));
  };

  const handleViewModeChange = async (newMode) => {
    localDispatch(setViewMode(newMode));
    const stringDate = moment(viewDate).format('YYYY-MM-DD');
    const query = { date: stringDate };
    if (newMode !== 'day') {
      query.doctorId = doctorId ?? doctors[0].id;
    }
    await router.replace({
      pathname: `/calendar/${newMode}`,
      query: query,
    });
  };

  const handlePayDebt = (debt) => {
    dispatch(setPaymentModal({ open: true, invoice: debt, schedule: null }));
  };

  const handleEditSchedule = (schedule) => {
    const stringStart = formatInTimeZone(
      schedule?.startTime,
      timeZone,
      'HH:mm',
    );
    const stringEnd = formatInTimeZone(schedule?.endTime, timeZone, 'HH:mm');
    dispatch(setStartHours([stringStart]));
    dispatch(setEndHours([stringEnd]));
    dispatch(setAppointmentServices([schedule?.service]));
    dispatch(setSelectedDate(schedule.startTime?.toString()));
    dispatch(
      setAppointmentFormData({
        scheduleId: schedule.id,
        serviceId: schedule?.service?.id,
        doctorId: schedule?.doctor?.id,
        cabinetId: schedule?.cabinet?.id,
        isUrgent: schedule?.isUrgent,
        date: schedule?.startTime,
        patientId: schedule?.patient?.id,
        startHour: stringStart,
        endHour: stringEnd,
      }),
    );

    dispatch(setSearchedPatients([schedule?.patient]));
    dispatch(openAppointmentModal());
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
      await requestDeleteSchedule(deleteSchedule.schedule.id);
      localDispatch(setDeleteSchedule({ open: false, schedule: null }));
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
    localDispatch(setDeleteSchedule({ open: false, schedule: null }));
  };

  const handleOpenImportModal = () => {
    localDispatch(setShowImportModal(true));
  };

  return (
    <MainComponent
      currentPath='/calendar'
      authToken={authToken}
      provideAppData={false}
    >
      <div className={styles.calendarRoot}>
        <CSVImportModal
          open={showImportModal}
          isLoading={isUploading}
          fields={importFields}
          title={textForKey('Import schedules')}
          iconTitle={textForKey('upload csv file')}
          iconSubtitle={textForKey('n_schedules_only')}
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
              key={`${doctorId}-${viewDate}`}
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
            key={`${doctorId}-${viewDate}`}
            canAddAppointment
            viewMode={viewMode}
            isUploading={isUploading}
            doctorId={doctorId}
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

export default React.memo(CalendarContainer, areComponentPropsEqual);
