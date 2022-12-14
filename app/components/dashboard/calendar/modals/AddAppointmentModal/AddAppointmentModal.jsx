import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Alert } from '@material-ui/lab';
import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASAutocomplete from 'app/components/common/EASAutocomplete';
import EASSelect from 'app/components/common/EASSelect';
import EASTextarea from 'app/components/common/EASTextarea';
import EASTextField from 'app/components/common/EASTextField';
import EasyDatePicker from 'app/components/common/EasyDatePicker';
import PatientsSearchField from 'app/components/common/PatientsSearchField';
import NotificationsContext from 'app/context/notificationsContext';
import {
  getAvailableHours,
  getScheduleDetails,
  postSchedule,
} from 'middleware/api/schedules';

import {
  clinicCabinetsSelector,
  clinicServicesSelector,
  consultationServiceSelector,
  doctorsForScheduleSelector,
  hasConsultationServiceSelector,
} from 'redux/selectors/appDataSelector';
import { updateAppointmentsList } from 'redux/slices/mainReduxSlice';
import { ScheduleStatus } from 'types';
import EASModal from '../../../../common/modals/EASModal';
import styles from './AddAppointment.module.scss';
import reducer, {
  initialState,
  setSchedule,
  setEndTime,
  setStartTime,
  setAppointmentDate,
  setIsCreatingSchedule,
  setAppointmentNote,
  setDoctor,
  setPatient,
  setAvailableTime,
  setIsFetchingHours,
  setIsUrgent,
  setService,
  setShowDatePicker,
  setSelectedCabinet,
  setSelectedCabinetInDoctorMode,
  setShowCreateModal,
  setHoursError,
  resetState,
  setIsConsultation,
} from './AddAppointmentModal.reducer';
import AppointmentPatient from './AppointmentPatient';

const AddAppointmentModal = ({
  open,
  doctor: selectedDoctor,
  patient: selectedPatient,
  startHour: selectedStartTime,
  endHour: selectedEndTime,
  cabinet: selectedCabinet,
  date,
  isDoctorMode = false,
  schedule,
  onClose,
}) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const datePickerAnchor = useRef(null);
  const activeServices = useSelector(clinicServicesSelector);
  const clinicCabinets = useSelector(clinicCabinetsSelector);
  const clinicDoctors = useSelector(doctorsForScheduleSelector);
  const consultationService = useSelector(consultationServiceSelector);
  const hasConsultationService = useSelector(hasConsultationServiceSelector);

  const [
    {
      patient,
      newPatient,
      doctor,
      cabinet,
      service,
      scheduleId,
      appointmentDate,
      appointmentNote,
      appointmentStatus,
      showDatePicker,
      createPatientModal,
      isFetchingHours,
      isDoctorValid,
      isServiceValid,
      isCreatingSchedule,
      isUrgent,
      startTime,
      endTime,
      availableStartTime,
      availableEndTime,
      hoursError,
      isConsultation,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  // map doctors for autocomplete fields
  const doctors = useMemo(() => {
    const filtered = clinicDoctors.filter((item) => {
      const isInCabinet = item.cabinets.some((cab) => cab.id === cabinet?.id);
      return cabinet == null || isInCabinet || item.cabinets.length === 0;
    });

    const mappedDoctors = filtered.map((item) => {
      const { phoneNumber, fullName } = item;
      const name = phoneNumber ? `${fullName} ${phoneNumber}` : fullName;
      return {
        ...item,
        name: name,
        label: item.fullName,
      };
    });
    return orderBy(mappedDoctors, 'name', 'asc');
  }, [cabinet, clinicDoctors]);

  // map cabinets for autocomplete fields
  const cabinets = useMemo(() => {
    if (doctor == null || doctor.cabinets?.length === 0) {
      localDispatch(setSelectedCabinetInDoctorMode(null));
      return [];
    } else {
      return orderBy(
        (doctor.cabinets ?? []).map((item) => ({ ...item, label: item.name })),
        'name',
        'asc',
      );
    }
  }, [clinicCabinets, doctor]);

  // check if there are any cabinets
  const shouldSelectCabinet =
    cabinet == null && schedule?.cabinet == null && cabinets.length > 0;

  // check if data is fetching
  const isLoading = isFetchingHours || isCreatingSchedule;

  // check if schedule is finished
  const isFinished =
    isLoading ||
    appointmentStatus === ScheduleStatus.CompletedNotPaid ||
    appointmentStatus === ScheduleStatus.CompletedPaid ||
    appointmentStatus === ScheduleStatus.PartialPaid ||
    appointmentStatus === ScheduleStatus.CompletedFree;

  const modalTitle =
    schedule == null
      ? `${textForKey('add appointment')} ${cabinet?.name ?? ''}`
      : `${textForKey('edit appointment')} ${cabinet?.name ?? ''}`;

  // map services for autocomplete field
  const mappedServices = useMemo(() => {
    if (doctor == null) {
      return [];
    }

    // filter services to show only provided by selected doctor service services
    const services = doctor?.services?.filter((service) =>
      activeServices.some(
        (activeService) => activeService.id === service.serviceId,
      ),
    );

    // map services for autocomplete field
    const mappedServices = services?.map((service) => ({
      ...service,
      label: service.name,
    }));

    return orderBy(mappedServices, 'name', 'asc');
  }, [doctor]);

  // get a name value for a patient
  const getLabelKey = useCallback((option) => {
    if (option.firstName && option.lastName) {
      return `${option.lastName} ${option.firstName}`;
    } else if (option.firstName) {
      return option.firstName;
    } else if (option.lastName) {
      return option.lastName;
    } else {
      return `+${option.countryCode}${option.phoneNumber}`;
    }
  }, []);

  // fetch schedule details if initial schedule is not null
  useEffect(() => {
    if (schedule != null) {
      fetchScheduleDetails();
    }
  }, [schedule]);

  // reset state when modal is closed
  useEffect(() => {
    if (!open) {
      localDispatch(resetState());
    }
  }, [open]);

  // set initial selected doctor
  useEffect(() => {
    if (selectedDoctor == null) {
      return;
    }
    localDispatch(setDoctor(selectedDoctor));
  }, [selectedDoctor]);

  // set initial selected cabinet
  useEffect(() => {
    if (selectedCabinet != null && !isDoctorMode) {
      localDispatch(setSelectedCabinet(selectedCabinet));
    }
  }, [selectedCabinet]);

  // set initial selected date
  useEffect(() => {
    if (date != null) {
      localDispatch(setAppointmentDate(date));
    }
  }, [date, selectedPatient]);

  // set initial selected patient
  useEffect(() => {
    if (selectedPatient != null) {
      const fullName = getLabelKey(selectedPatient);
      const { countryCode, phoneNumber } = selectedPatient;
      localDispatch(
        setPatient({
          ...selectedPatient,
          fullName,
          name: `${fullName} +${countryCode}${phoneNumber}`,
          label: fullName,
        }),
      );
    }
  }, [selectedPatient]);

  // fetch available hours when service, doctor, cabinet and/or date is changed
  useEffect(() => {
    fetchAvailableHours();
  }, [doctor, service, appointmentDate, isConsultation]);

  // set initial start and end time for appointment
  useEffect(() => {
    if (schedule == null) {
      localDispatch(setStartTime(selectedStartTime || ''));
      localDispatch(setEndTime(selectedEndTime || ''));
    }
  }, [selectedStartTime, selectedEndTime]);

  const isDoctorInCabinet = (doctor) => {
    if (cabinet == null) {
      return false;
    }
    return doctor.cabinets.some((item) => item.id === cabinet.id);
  };

  const mappedTime = (timeList) => {
    return timeList.map((item) => ({
      id: item,
      label: item,
      name: item,
    }));
  };

  const fetchScheduleDetails = async () => {
    if (schedule == null) {
      return;
    }
    try {
      const response = await getScheduleDetails(schedule.id);
      const { data: scheduleDetails } = response;
      localDispatch(
        setSchedule({
          ...scheduleDetails,
          doctor: doctors.find((it) => it.id === scheduleDetails.doctor.id),
        }),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAvailableHours = async () => {
    if (
      doctor == null ||
      (service == null && !isConsultation) ||
      appointmentDate == null
    ) {
      return;
    }
    localDispatch(setIsFetchingHours(true));
    try {
      const query = {
        doctorId: doctor.id,
        date: moment(appointmentDate).format('YYYY-MM-DD'),
      };

      if (!isConsultation) {
        query.serviceId = service.serviceId || service.id;
      }

      if (schedule != null) {
        query.scheduleId = schedule.id;
      }

      const response = await getAvailableHours(query);
      const { data: availableTime } = response;
      localDispatch(setAvailableTime(availableTime));
      if (startTime.length === 0) {
        localDispatch(setStartTime(availableTime[0]));
      }
      updateEndTimeBasedOnService(availableTime);
    } catch (error) {
      if (error.response != null) {
        const { data } = error.response;
        localDispatch(setHoursError(data.message || error.message));
      } else {
        localDispatch(setHoursError(error.message));
      }
    }
  };

  const updateEndTimeBasedOnService = (availableTime) => {
    if (schedule != null) {
      return;
    }
    const serviceDuration = isConsultation
      ? consultationService.duration
      : service.duration;
    let approximatedDuration;
    if (serviceDuration % 5 !== 0) {
      let remainder = serviceDuration % 5;
      approximatedDuration = serviceDuration - remainder + 5;
    } else {
      approximatedDuration = serviceDuration;
    }

    setTimeout(() => {
      const start =
        availableTime.length > 0 && startTime.length === 0
          ? availableTime[0]
          : startTime;
      const [h, m] = start.split(':');
      const end = moment(appointmentDate)
        .set({
          hour: parseInt(h),
          minute: parseInt(m),
          second: 0,
        })
        .add(approximatedDuration, 'minutes')
        .format('HH:mm');
      localDispatch(setEndTime(end));
    }, 300);
  };

  const handleDoctorChange = (event, selectedDoctor) => {
    if (!isDoctorInCabinet(selectedDoctor)) {
      localDispatch(setSelectedCabinetInDoctorMode(null));
    }
    localDispatch(setDoctor(selectedDoctor));
  };

  const handleCabinetChange = (event, selectedCabinet) => {
    if (isDoctorMode) {
      localDispatch(setSelectedCabinetInDoctorMode(selectedCabinet));
    } else {
      localDispatch(setSelectedCabinet(selectedCabinet));
    }
  };

  const handleServiceChange = (event, selectedService) => {
    localDispatch(setService(selectedService));
  };

  const handleDateFieldClick = () => {
    if (isFinished) {
      return;
    }
    localDispatch(setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(setShowDatePicker(false));
  };

  const handleDateChange = (newDate) => {
    localDispatch(setAppointmentDate(newDate));
  };

  const handleStartHourChange = (event) => {
    localDispatch(setStartTime(event.target.value));
  };

  const handleEndHourChange = (event) => {
    localDispatch(setEndTime(event.target.value));
  };

  const handleNoteChange = (newValue) => {
    localDispatch(setAppointmentNote(newValue));
  };

  const handleIsUrgentChange = (event, checked) => {
    localDispatch(setIsUrgent(checked));
  };

  const handleIsConsultationChange = (event, checked) => {
    localDispatch(setIsConsultation(checked));
  };

  const isFormValid = () => {
    return (
      isDoctorValid &&
      isServiceValid &&
      startTime?.length > 0 &&
      endTime?.length > 0 &&
      patient != null &&
      (!shouldSelectCabinet || cabinet != null)
    );
  };

  const handleCreateSchedule = async () => {
    if (!isFormValid()) {
      return;
    }
    localDispatch(setIsCreatingSchedule(true));
    try {
      // set start date
      const [startHour, startMinute] = startTime.split(':');
      const startDate = moment(appointmentDate);
      startDate.set({
        hour: parseInt(startHour),
        minute: parseInt(startMinute),
      });

      // set end date
      const [endHour, endMinute] = endTime.split(':');
      const endDate = moment(appointmentDate);
      endDate.set({ hour: parseInt(endHour), minute: parseInt(endMinute) });

      // build.yml request body
      const requestBody = {
        isUrgent,
        isConsultation,
        patientId: patient?.id,
        doctorId: doctor?.id,
        cabinetId: cabinet?.id,
        serviceId: isConsultation ? null : service.serviceId || service.id,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        note: appointmentNote,
        status: appointmentStatus,
        scheduleId: scheduleId,
      };

      await postSchedule(requestBody);
      onClose();
      dispatch(updateAppointmentsList());
    } catch (error) {
      if (error.response != null) {
        const { data } = error.response;
        toast?.error(data.message || error.message);
      } else {
        toast?.error(error.message);
      }
    } finally {
      localDispatch(setIsCreatingSchedule(false));
    }
  };

  const handleExistentPatientChange = (patient) => {
    localDispatch(setPatient(patient));
  };

  const handleCloseCreateModal = () => {
    localDispatch(setShowCreateModal({ open: false, value: '' }));
  };

  const handleOpenCreateModal = (value) => {
    localDispatch(setShowCreateModal({ open: true, value: value.label }));
  };

  const datePicker = (
    <EasyDatePicker
      minDate={new Date()}
      open={Boolean(showDatePicker)}
      pickerAnchor={datePickerAnchor.current}
      onChange={handleDateChange}
      selectedDate={appointmentDate}
      onClose={handleCloseDatePicker}
    />
  );

  const createPatientModalComponent = (
    <AppointmentPatient
      {...createPatientModal}
      onClose={handleCloseCreateModal}
      onSaved={handleExistentPatientChange}
      patient={patient}
      newPatient={newPatient}
    />
  );

  return (
    <EASModal
      onClose={onClose}
      open={open}
      className={styles['add-appointment-root']}
      paperClass={styles.modalPaper}
      size='medium'
      title={modalTitle}
      note={textForKey('fill_required_fields')}
      onBackdropClick={() => null}
      isPositiveDisabled={!isFormValid() || isLoading}
      onPrimaryClick={handleCreateSchedule}
      isPositiveLoading={isLoading}
    >
      <Box>
        <Box display='flex' flexDirection='column' padding='16px'>
          <PatientsSearchField
            onCreatePatient={handleOpenCreateModal}
            fieldLabel={`${textForKey('patient')} (${textForKey('required')})`}
            selectedPatient={patient}
            onSelected={handleExistentPatientChange}
          />

          {!isDoctorMode && (
            <EASAutocomplete
              filterLocally
              containerClass={styles.simpleField}
              options={doctors}
              value={doctor}
              fieldLabel={`${textForKey('doctor')} (${textForKey('required')})`}
              placeholder={textForKey('enter doctor name or phone')}
              onChange={handleDoctorChange}
            />
          )}

          {shouldSelectCabinet && (
            <EASAutocomplete
              filterLocally
              containerClass={styles.simpleField}
              options={cabinets}
              value={cabinet}
              fieldLabel={`${textForKey(
                'add_appointment_cabinet',
              )} (${textForKey('required')})`}
              placeholder={textForKey('type_to_search')}
              onChange={handleCabinetChange}
            />
          )}

          {!isConsultation && (
            <EASAutocomplete
              filterLocally
              disabled={mappedServices.length === 0}
              containerClass={styles.simpleField}
              options={mappedServices}
              value={service}
              fieldLabel={textForKey('service')}
              placeholder={textForKey('enter service name')}
              onChange={handleServiceChange}
            />
          )}

          <div>
            <FormControlLabel
              disabled={!hasConsultationService}
              control={<Checkbox checked={isConsultation} />}
              label={textForKey('consultation_appointment')}
              onChange={handleIsConsultationChange}
              classes={{
                root: styles.urgentCheck,
                label: styles.consultationLabel,
              }}
            />
          </div>

          <EASTextField
            readOnly
            ref={datePickerAnchor}
            containerClass={styles.simpleField}
            fieldLabel={`${textForKey('date')} (${textForKey('required')})`}
            value={moment(appointmentDate).format('DD MMMM YYYY')}
            onPointerUp={handleDateFieldClick}
          />

          <div className={styles.timeContainer}>
            <EASSelect
              disabled={availableStartTime.length === 0}
              rootClass={styles.timeSelect}
              value={startTime || ''}
              label={`${textForKey('start time')} (${textForKey('required')})`}
              labelId='start-time-select'
              options={mappedTime(availableStartTime)}
              onChange={handleStartHourChange}
            />
            <EASSelect
              disabled={availableEndTime.length === 0}
              rootClass={styles.timeSelect}
              value={endTime || ''}
              label={`${textForKey('end time')} (${textForKey('required')})`}
              labelId='start-time-select'
              options={mappedTime(availableEndTime)}
              onChange={handleEndHourChange}
            />
          </div>

          <div>
            <FormControlLabel
              control={<Checkbox checked={isUrgent} />}
              label={textForKey('is urgent')}
              onChange={handleIsUrgentChange}
              classes={{
                root: styles.urgentCheck,
                label: styles.urgentLabel,
              }}
            />
          </div>

          <EASTextarea
            containerClass={styles.simpleField}
            value={appointmentNote || ''}
            rows={4}
            maxRows={6}
            onChange={handleNoteChange}
            fieldLabel={textForKey('notes')}
            maxLength={1000}
          />
          {hoursError && (
            <Alert severity='warning' style={{ width: '100%', marginTop: 16 }}>
              {hoursError}
            </Alert>
          )}
        </Box>
        {datePicker}
        {createPatientModal.open && createPatientModalComponent}
      </Box>
    </EASModal>
  );
};

export default AddAppointmentModal;

AddAppointmentModal.propTypes = {
  open: PropTypes.bool,
  doctor: PropTypes.object,
  patient: PropTypes.object,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  cabinet: PropTypes.object,
  date: PropTypes.instanceOf(Date),
  isDoctorMode: PropTypes.bool,
  schedule: PropTypes.shape({
    id: PropTypes.number,
    patientId: PropTypes.number,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    doctorId: PropTypes.number,
    doctorName: PropTypes.string,
    serviceId: PropTypes.number,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceDuration: PropTypes.string,
    dateAndTime: PropTypes.string,
    isUrgent: PropTypes.bool,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};
