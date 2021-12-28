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
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import EASAutocomplete from 'app/components/common/EASAutocomplete';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASSelect from 'app/components/common/EASSelect';
import EASTextarea from 'app/components/common/EASTextarea';
import EASTextField from 'app/components/common/EASTextField';
import EasyDatePicker from 'app/components/common/EasyDatePicker';
import EASModal from 'app/components/common/modals/EASModal';
import PatientsSearchField from 'app/components/common/PatientsSearchField';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import {
  getAvailableHours,
  getScheduleDetails,
  postSchedule,
} from 'middleware/api/schedules';
import {
  clinicCabinetsSelector,
  clinicServicesSelector,
  doctorsForScheduleSelector,
} from 'redux/selectors/appDataSelector';
import { updateAppointmentsList } from 'redux/slices/mainReduxSlice';
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
  setNewPatient,
  setShowCreateModal,
  resetState,
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
  const toast = useContext(NotificationsContext);
  const dispatch = useDispatch();
  const activeServices = useSelector(clinicServicesSelector);
  const datePickerAnchor = useRef(null);
  const clinicCabinets = useSelector(clinicCabinetsSelector);
  const clinicDoctors = useSelector(doctorsForScheduleSelector);
  const [currentTab, setCurrentTab] = useState('0');
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
      showCreateModal,
      isFetchingHours,
      isDoctorValid,
      isServiceValid,
      isCreatingSchedule,
      isUrgent,
      startTime,
      endTime,
      availableStartTime,
      availableEndTime,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const hasCabinets = clinicCabinets.length > 0;

  const shouldGoNext = currentTab === '0';
  const canGoNext =
    currentTab === '0' && (newPatient.isPhoneValid || patient != null);

  const doctors = useMemo(() => {
    const mappedDoctors = clinicDoctors
      .filter((item) => {
        const isInCabinet = item.cabinets.some((cab) => cab.id === cabinet?.id);
        return cabinet == null || isInCabinet;
      })
      .map((item) => {
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

  const cabinets = useMemo(() => {
    let mappedCabinets;
    if (isDoctorMode) {
      const neededDoctor = clinicDoctors.find(
        (doctor) => doctor.id === selectedDoctor.id,
      );
      mappedCabinets = neededDoctor.cabinets.map((cabinet) => ({
        ...cabinet,
        label: cabinet.name,
      }));
    } else {
      mappedCabinets = clinicCabinets.map((cabinet) => ({
        ...cabinet,
        label: cabinet.name,
      }));
    }
    return orderBy(mappedCabinets, 'name', 'asc');
  }, [clinicCabinets]);

  const mappedServices = useMemo(() => {
    if (isDoctorMode) {
      doctor?.services.filter((service) =>
        activeServices.some(
          (activeService) => activeService.id === service.serviceId,
        ),
      );
    }

    if (doctor?.services == null && cabinet == null) {
      return [];
    }

    let services;
    if (doctor != null) {
      services = doctor.services.filter((service) =>
        activeServices.some(
          (activeService) => activeService.id === service.serviceId,
        ),
      );
    } else {
      const cabinetDoctors = clinicDoctors.filter((doctor) =>
        doctor.cabinets.some((item) => item.id === cabinet.id),
      );
      const allCabinetServices = cabinetDoctors
        .map((doctor) => doctor.services)
        .flat();
      services = allCabinetServices.filter((service) =>
        activeServices.some(
          (activeService) => activeService.id === service.serviceId,
        ),
      );
    }

    return services.map((service) => ({
      ...service,
      label: service.name,
    }));
  }, [doctor, cabinet, clinicDoctors]);

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

  useEffect(() => {
    if (schedule != null) {
      fetchScheduleDetails();
    }
  }, [schedule]);

  useEffect(() => {
    if (!open) {
      localDispatch(resetState());
    }
  }, [open]);

  useEffect(() => {
    if (selectedDoctor != null && !isDoctorMode) {
      const fullName = `${selectedDoctor.firstName} ${selectedDoctor.lastName}`;
      const { phoneNumber } = selectedDoctor;
      const name = phoneNumber ? `${fullName} ${phoneNumber}` : fullName;
      localDispatch(
        setDoctor({
          ...selectedDoctor,
          label: fullName,
          fullName,
          name,
        }),
      );
    }

    if (selectedDoctor != null && isDoctorMode) {
      const neededDoctor = clinicDoctors.find(
        (doctor) => doctor.id === selectedDoctor.id,
      );
      const fullName = `${neededDoctor.firstName} ${neededDoctor.lastName}`;
      const { phoneNumber } = neededDoctor;
      const name = phoneNumber ? `${fullName} ${phoneNumber}` : fullName;

      localDispatch(
        setDoctor({
          ...neededDoctor,
          label: fullName,
          fullName,
          name,
        }),
      );
    }

    if (date != null) {
      localDispatch(setAppointmentDate(date));
    }

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

    if (selectedCabinet != null && !isDoctorMode) {
      localDispatch(setSelectedCabinet(selectedCabinet));
    }
  }, [selectedDoctor, date, selectedPatient, selectedCabinet]);

  useEffect(() => {
    fetchAvailableHours();
  }, [doctor, cabinet, service, appointmentDate]);

  useEffect(() => {
    if (schedule == null) {
      localDispatch(setStartTime(selectedStartTime || ''));
      localDispatch(setEndTime(selectedEndTime || ''));
    }
  }, [selectedStartTime, selectedEndTime]);

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
    if (doctor == null || service == null || appointmentDate == null) {
      return;
    }
    localDispatch(setIsFetchingHours(true));
    try {
      const query = {
        serviceId: service.serviceId || service.id,
        doctorId: doctor.id,
        date: moment(appointmentDate).format('YYYY-MM-DD'),
      };

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
      toast.error(error.message);
    } finally {
      localDispatch(setIsFetchingHours(false));
    }
  };

  const updateEndTimeBasedOnService = (availableTime) => {
    if (schedule != null) {
      return;
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
        .add(service.duration, 'minutes')
        .format('HH:mm');
      localDispatch(setEndTime(end));
    }, 300);
  };

  const handleDoctorChange = (event, selectedDoctor) => {
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

  const isFormValid = () => {
    return (
      isDoctorValid &&
      isServiceValid &&
      startTime?.length > 0 &&
      endTime?.length > 0 &&
      (patient != null || newPatient?.isPhoneValid)
    );
  };

  const handleCreateSchedule = async () => {
    if (shouldGoNext && canGoNext) {
      // move to schedule details
      setCurrentTab('1');
      return;
    }

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
        patientFirstName: newPatient?.patientFirstName,
        patientLastName: newPatient?.patientLastName,
        patientPhoneNumber: newPatient?.patientPhoneNumber?.replace(
          newPatient?.patientCountryCode,
          '',
        ),
        patientBirthday: newPatient?.patientBirthday,
        patientLanguage: newPatient?.patientLanguage,
        patientSource: newPatient?.patientSource,
        patientEmail: newPatient?.patientEmail,
        patientCountryCode: newPatient?.patientCountryCode,
        isUrgent,
        patientId: patient?.id,
        doctorId: doctor?.id,
        cabinetId: cabinet?.id,
        serviceId: service.serviceId || service.id,
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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(`${newValue}`);
  };

  const handleExistentPatientChange = (patient) => {
    localDispatch(setPatient(patient));
    if (patient != null) {
      setCurrentTab('1');
    }
  };

  const handleCloseCreateModal = () => {
    localDispatch(setShowCreateModal(false));
  };

  const handleOpenCreateModal = (value) => {
    localDispatch(setShowCreateModal(true));
  };

  const handleNewPatientChange = (patient) => {
    localDispatch(setNewPatient(patient));
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

  const createPatientModal = (
    <AppointmentPatient
      open={showCreateModal}
      onClose={handleCloseCreateModal}
      onSaved={handleExistentPatientChange}
      patient={patient}
      newPatient={newPatient}
    />
  );

  const isLoading = isFetchingHours || isCreatingSchedule;

  const isFinished =
    isLoading ||
    appointmentStatus === 'CompletedNotPaid' ||
    appointmentStatus === 'CompletedPaid' ||
    appointmentStatus === 'PartialPaid' ||
    appointmentStatus === 'CompletedFree';

  return (
    <EASModal
      onClose={onClose}
      open={open}
      className={styles['add-appointment-root']}
      paperClass={styles.modalPaper}
      title={
        schedule == null
          ? textForKey('Add appointment')
          : textForKey('Edit appointment')
      }
      onBackdropClick={() => null}
      isPositiveDisabled={
        shouldGoNext ? !canGoNext : !isFormValid() || isLoading
      }
      primaryBtnText={shouldGoNext ? textForKey('Next') : textForKey('Save')}
      onPrimaryClick={handleCreateSchedule}
      isPositiveLoading={isLoading}
    >
      <Box>
        {/*<TabContext value={currentTab}>*/}
        {/*  /!*<Box>*!/*/}
        {/*  /!*  <TabList*!/*/}
        {/*  /!*    variant='fullWidth'*!/*/}
        {/*  /!*    classes={{*!/*/}
        {/*  /!*      root: styles.tabsRoot,*!/*/}
        {/*  /!*      indicator: styles.tabsIndicator,*!/*/}
        {/*  /!*    }}*!/*/}
        {/*  /!*    onChange={handleTabChange}*!/*/}
        {/*  /!*  >*!/*/}
        {/*  /!*    <Tab*!/*/}
        {/*  /!*      value='0'*!/*/}
        {/*  /!*      label={textForKey('Patient')}*!/*/}
        {/*  /!*      classes={{ root: styles.tabItem }}*!/*/}
        {/*  /!*    />*!/*/}
        {/*  /!*    <Tab*!/*/}
        {/*  /!*      value='1'*!/*/}
        {/*  /!*      disabled={shouldGoNext && !canGoNext}*!/*/}
        {/*  /!*      label={textForKey('appointment_details')}*!/*/}
        {/*  /!*      classes={{ root: styles.tabItem }}*!/*/}
        {/*  /!*    />*!/*/}
        {/*  /!*  </TabList>*!/*/}
        {/*  /!*</Box>*!/*/}
        {/*  /!*<TabPanel value='0' style={{ padding: 0, width: '100%' }}>*!/*/}
        {/*  /!*  <AppointmentPatient*!/*/}
        {/*  /!*    patient={patient}*!/*/}
        {/*  /!*    newPatient={newPatient}*!/*/}
        {/*  /!*    onPatientChange={handleExistentPatientChange}*!/*/}
        {/*  /!*    onNewPatientChange={handleNewPatientChange}*!/*/}
        {/*  /!*  />*!/*/}
        {/*  /!*</TabPanel>*!/*/}
        {/*  /!*<TabPanel value='1' style={{ padding: 0, width: '100%' }}>*!/*/}
        <Box display='flex' flexDirection='column' padding='16px'>
          <PatientsSearchField
            onCreatePatient={handleOpenCreateModal}
            fieldLabel={textForKey('Patient')}
            selectedPatient={patient}
            onSelected={handleExistentPatientChange}
          />
          {hasCabinets && (
            <EASAutocomplete
              filterLocally
              containerClass={styles.simpleField}
              options={cabinets}
              value={cabinet}
              fieldLabel={textForKey('add_appointment_cabinet')}
              placeholder={textForKey('type_to_search')}
              onChange={handleCabinetChange}
            />
          )}

        {!isDoctorMode && (
          <EASAutocomplete
            filterLocally
            containerClass={styles.simpleField}
            options={doctors}
            value={doctor}
            fieldLabel={textForKey('Doctor')}
            placeholder={textForKey('Enter doctor name or phone')}
            onChange={handleDoctorChange}
          />
        )}

        <EASAutocomplete
          filterLocally
          disabled={mappedServices.length === 0}
          containerClass={styles.simpleField}
          options={mappedServices}
          value={service}
          fieldLabel={textForKey('Service')}
          placeholder={textForKey('Enter service name')}
          onChange={handleServiceChange}
        />

        <EASTextField
          readOnly
          ref={datePickerAnchor}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Date')}
          value={moment(appointmentDate).format('DD MMMM YYYY')}
          onPointerUp={handleDateFieldClick}
        />

        <div className={styles.timeContainer}>
          <EASSelect
            disabled={availableStartTime.length === 0}
            rootClass={styles.timeSelect}
            value={startTime || ''}
            label={textForKey('Start time')}
            labelId='start-time-select'
            options={mappedTime(availableStartTime)}
            onChange={handleStartHourChange}
          />
          <EASSelect
            disabled={availableEndTime.length === 0}
            rootClass={styles.timeSelect}
            value={endTime || ''}
            label={textForKey('End time')}
            labelId='start-time-select'
            options={mappedTime(availableEndTime)}
            onChange={handleEndHourChange}
          />
        </div>

        <div>
          <FormControlLabel
            control={<Checkbox checked={isUrgent} />}
            label={textForKey('Is urgent')}
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
          fieldLabel={textForKey('Notes')}
        />

        {datePicker}
        {birthdayPicker}
      </Box>
    </EASModal>
  );
};

export default React.memo(AddAppointmentModal, areComponentPropsEqual);

AddAppointmentModal.propTypes = {
  open: PropTypes.bool,
  date: PropTypes.instanceOf(Date),
  doctor: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  patient: PropTypes.object,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
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
};
