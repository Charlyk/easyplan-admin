import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { toggleAppointmentsUpdate } from '../../../../../../redux/actions/actions';
import { EmailRegex, Role } from '../../../../../utils/constants';
import { textForKey } from '../../../../../../utils/localization';
import EasyDatePicker from '../../../../common/EasyDatePicker';
import {
  getAvailableHours,
  getScheduleDetails,
  postSchedule
} from "../../../../../../middleware/api/schedules";
import { getPatients } from "../../../../../../middleware/api/patients";
import { reducer, initialState, actions } from "./AddAppointmentModal.reducer";
import isPhoneNumberValid from "../../../../../utils/isPhoneNumberValid";
import areComponentPropsEqual from "../../../../../utils/areComponentPropsEqual";
import EASModal from "../../../../common/modals/EASModal";
import styles from './AddAppointment.module.scss';
import EASPhoneInput from "../../../../common/EASPhoneInput";
import EASTextField from "../../../../common/EASTextField";
import EASAutocomplete from "../../../../common/EASAutocomplete";
import EASSelect from "../../../../common/EASSelect";
import EASTextarea from "../../../../common/EASTextarea";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const AddAppointmentModal = (
  {
    open,
    currentClinic,
    doctor: selectedDoctor,
    patient: selectedPatient,
    startHour: selectedStartTime,
    endHour: selectedEndTime,
    date,
    schedule,
    onClose,
  }
) => {
  const dispatch = useDispatch();
  const birthdayPickerAnchor = useRef(null);
  const datePickerAnchor = useRef(null);
  const doctors = useMemo(() => {
    return currentClinic.users.filter((item) =>
      item.roleInClinic === Role.doctor &&
      !item.isHidden &&
      !item.isInVacation
    ).map(item => ({
      ...item,
      name: item.fullName,
      label: item.fullName,
      services: item.services.map(service => ({
        ...service,
        label: service.name,
      })),
    }));
  }, [currentClinic]);

  const [
    {
      patient,
      patients,
      doctor,
      service,
      loading,
      scheduleId,
      patientLastName,
      patientFirstName,
      patientPhoneNumber,
      patientBirthday,
      patientEmail,
      phoneCountry,
      isPhoneValid,
      isNewPatient,
      appointmentDate,
      appointmentNote,
      appointmentStatus,
      showDatePicker,
      showBirthdayPicker,
      isFetchingHours,
      isPatientValid,
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

  const getLabelKey = useCallback((option) => {
    return option.firstName || option.lastName
      ? `${option.lastName} ${option.firstName}`
      : option.phoneNumber;
  }, []);

  const suggestionPatients = useMemo(() => {
    if (patients.length === 0 && patient != null) {
      return [{
        ...patient,
        name: patient.fullName,
      }]
    }
    return patients.map(item => ({
      ...item,
      name: item.fullName,
    }))
  }, [patients, patient]);

  useEffect(() => {
    if (schedule != null) {
      fetchScheduleDetails();
    }
  }, [schedule]);

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    }
  }, [open]);

  useEffect(() => {
    if (selectedDoctor != null) {
      localDispatch(
        actions.setDoctor({
          ...selectedDoctor,
          name: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
          fullName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
        }),
      );
    }

    if (date != null) {
      localDispatch(actions.setAppointmentDate(date));
    }

    if (selectedPatient != null) {
      const fullName = getLabelKey(selectedPatient);
      localDispatch(
        actions.setPatient({
          ...selectedPatient,
          fullName,
          name: fullName,
        }),
      );
    }
  }, [selectedDoctor, date, selectedPatient]);

  useEffect(() => {
    fetchAvailableHours();
  }, [doctor, service, appointmentDate]);

  useEffect(() => {
    if (schedule == null) {
      localDispatch(actions.setStartTime(selectedStartTime || ''));
      localDispatch(actions.setEndTime(selectedEndTime || ''));
    }
  }, [selectedStartTime, selectedEndTime]);

  const mappedTime = (timeList) => {
    return timeList.map(item => ({
      id: item,
      label: item,
      name: item,
    }));
  }

  const fetchScheduleDetails = async () => {
    if (schedule == null) {
      return;
    }
    try {
      const response = await getScheduleDetails(schedule.id);
      const { data: scheduleDetails } = response;
      localDispatch(
        actions.setSchedule({
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
    localDispatch(actions.setIsFetchingHours(true));
    try {
      const query = {
        doctorId: doctor.id,
        serviceId: service.serviceId || service.id,
        date: moment(appointmentDate).format('YYYY-MM-DD'),
      };
      if (schedule != null) {
        query.scheduleId = schedule.id;
      }
      const response = await getAvailableHours(query);
      const { data: availableTime } = response;
      localDispatch(actions.setAvailableTime(availableTime));
      if (startTime.length === 0) {
        localDispatch(actions.setStartTime(availableTime[0]));
      }
      updateEndTimeBasedOnService(availableTime);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsFetchingHours(false));
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
      localDispatch(actions.setEndTime(end));
    }, 300);
  };

  const handlePatientChange = (event, selectedPatient) => {
    localDispatch(actions.setPatient(selectedPatient));
  };

  const handleDoctorChange = (event, selectedDoctor) => {
    localDispatch(actions.setDoctor(selectedDoctor));
  };

  const handleServiceChange = (event, selectedService) => {
    localDispatch(actions.setService(selectedService));
  };

  const handlePatientSearch = useCallback(
    debounce(async (query) => {
      localDispatch(actions.setPatientsLoading(true));
      try {
        const updatedQuery = query.replace('+', '');
        const requestQuery = { query: updatedQuery, page: '0', rowsPerPage: '10', short: '1' };
        const { data: response } = await getPatients(requestQuery);
        const patients = response.data.map((item) => ({
          ...item,
          fullName: getLabelKey(item),
        }));
        localDispatch(actions.setPatients(patients));
      } catch (error) {
        toast.error(error.message);
      } finally {
        localDispatch(actions.setPatientsLoading(false));
      }
    }, 500),
    [],
  );

  const handleSearchQueryChange = (event) => {
    const query = event.target.value;
    if (query.length < 3) {
      localDispatch(actions.setPatients([]))
      localDispatch(actions.setPatientsLoading(false));
      return;
    }
    localDispatch(actions.setPatientsLoading(true));
    handlePatientSearch(query);
  };

  const handleDateFieldClick = () => {
    if (isFinished) {
      return;
    }
    localDispatch(actions.setShowDatePicker(true));
  };

  const handleCloseDatePicker = () => {
    localDispatch(actions.setShowDatePicker(false));
  };

  const handleDateChange = (newDate) => {
    localDispatch(actions.setAppointmentDate(newDate));
  };

  const handleBirthdayChange = (newDate) => {
    localDispatch(actions.setPatientBirthday(newDate));
  };

  const handleEmailChange = (newValue) => {
    localDispatch(actions.setPatientEmail(newValue));
  };

  const handleCloseBirthdayPicker = () => {
    localDispatch(actions.setShowBirthdayPicker(false));
  };

  const handleOpenBirthdayPicker = () => {
    localDispatch(actions.setShowBirthdayPicker(true));
  };

  const handleStartHourChange = (event) => {
    localDispatch(actions.setStartTime(event.target.value));
  };

  const handleEndHourChange = (event) => {
    localDispatch(actions.setEndTime(event.target.value));
  }

  const handleNoteChange = (newValue) => {
    localDispatch(actions.setAppointmentNote(newValue));
  };

  const handleIsUrgentChange = (event, checked) => {
    localDispatch(actions.setIsUrgent(checked));
  };

  const changePatientMode = () => {
    if (schedule != null) {
      return;
    }
    const isNew = !isNewPatient;
    localDispatch(actions.setIsNewPatient(isNew));
    if (isNew) {
      localDispatch(actions.setPatient(null));
      localDispatch(actions.setIsPatientValid(false));
    }
  };

  const handlePatientFirstNameChange = (newValue) => {
    localDispatch(actions.setPatientFirstName(newValue));
  }

  const handlePatientLastNameChange = (newValue) => {
    localDispatch(actions.setPatientLastName(newValue));
  }

  const isFormValid = () => {
    return (
      isDoctorValid &&
      (isNewPatient || isPatientValid) &&
      isServiceValid &&
      startTime?.length > 0 &&
      endTime?.length > 0 &&
      (!isNewPatient || isPhoneValid)
    );
  };

  const handleCreateSchedule = async () => {
    if (!isFormValid()) {
      return;
    }
    localDispatch(actions.setIsCreatingSchedule(true));
    try {
      // set start date
      const [startHour, startMinute] = startTime.split(':');
      const startDate = moment(appointmentDate);
      startDate.set({ hour: parseInt(startHour), minute: parseInt(startMinute) });

      // set end date
      const [endHour, endMinute] = endTime.split(':');
      const endDate = moment(appointmentDate);
      endDate.set({ hour: parseInt(endHour), minute: parseInt(endMinute) });

      // build request body
      const requestBody = {
        patientFirstName,
        patientLastName,
        patientPhoneNumber,
        patientBirthday,
        patientEmail,
        isUrgent,
        patientCountryCode: phoneCountry.dialCode,
        patientId: patient?.id,
        doctorId: doctor.id,
        serviceId: service.serviceId || service.id,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        note: appointmentNote,
        status: appointmentStatus,
        scheduleId: scheduleId,
      };

      await postSchedule(requestBody);
      onClose();
      dispatch(toggleAppointmentsUpdate());
    } catch (error) {
      toast.error(error.messages);
    } finally {
      localDispatch(actions.setIsCreatingSchedule(false));
    }
  };

  const handlePhoneChange = (value, country, event) => {
    localDispatch(
      actions.setPatientPhoneNumber({
        phoneNumber: value.replace(country.dialCode, ''),
        isPhoneValid: isPhoneNumberValid(value, country) && !event.target?.classList.value.includes('invalid-number'),
        country,
      }),
    );
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

  const birthdayPicker = (
    <EasyDatePicker
      open={Boolean(showBirthdayPicker)}
      pickerAnchor={birthdayPickerAnchor.current}
      onChange={handleBirthdayChange}
      onClose={handleCloseBirthdayPicker}
      selectedDate={patientBirthday || new Date()}
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
      isPositiveDisabled={!isFormValid() || isLoading}
      onPrimaryClick={handleCreateSchedule}
      isPositiveLoading={isLoading}
    >
      <Box padding='16px' display='flex' flexDirection='column'>
        {isNewPatient && (
          <div className={styles.patientNameContainer}>
            <EASTextField
              type="text"
              value={patientLastName}
              containerClass={styles.nameField}
              fieldLabel={textForKey('Last name')}
              onChange={handlePatientFirstNameChange}
            />
            <EASTextField
              type="text"
              value={patientFirstName}
              containerClass={styles.nameField}
              fieldLabel={textForKey('First name')}
              onChange={handlePatientLastNameChange}
            />
          </div>
        )}

        {isNewPatient && (
          <EASPhoneInput
            fieldLabel={textForKey('Phone number')}
            rootClass={styles.phoneInput}
            value={`${phoneCountry.dialCode}${patientPhoneNumber}`}
            country={phoneCountry.countryCode || 'md'}
            onChange={handlePhoneChange}
          />
        )}

        {isNewPatient && (
          <EASTextField
            type="email"
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Email')}
            value={patientEmail}
            error={patientEmail.length > 0 && !patientEmail.match(EmailRegex)}
            onChange={handleEmailChange}
          />
        )}

        {isNewPatient && (
          <EASTextField
            readOnly
            containerClass={styles.simpleField}
            ref={birthdayPickerAnchor}
            fieldLabel={textForKey('Birthday')}
            value={patientBirthday ? moment(patientBirthday).format('DD MMM YYYY') : ''}
            onPointerUp={handleOpenBirthdayPicker}
          />
        )}

        {!isNewPatient && (
          <EASAutocomplete
            disabled={schedule != null}
            fieldLabel={textForKey('Patient')}
            options={suggestionPatients}
            onTextChange={handleSearchQueryChange}
            onChange={handlePatientChange}
            value={patient}
            loading={loading.patients}
            placeholder={textForKey('Enter patient name or phone')}
          />
        )}

        <div className={styles.modeWrapper}>
          <div
            className={
              clsx(
                styles.patientModeButton,
                {
                  [styles.disabled]: isFinished,
                },
              )
            }
            role='button'
            tabIndex={0}
            onPointerUp={changePatientMode}
          >
          <span>
            {textForKey(isNewPatient ? 'Existent patient' : 'New patient')}?
          </span>
          </div>
        </div>

        <EASAutocomplete
          options={doctors}
          value={doctor}
          fieldLabel={textForKey('Doctor')}
          placeholder={textForKey('Enter doctor name or phone')}
          onChange={handleDoctorChange}
        />

        <EASAutocomplete
          disabled={doctor == null}
          containerClass={styles.simpleField}
          options={doctor?.services || []}
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
            labelId="start-time-select"
            options={mappedTime(availableStartTime)}
            onChange={handleStartHourChange}
          />
          <EASSelect
            disabled={availableEndTime.length === 0}
            rootClass={styles.timeSelect}
            value={endTime || ''}
            label={textForKey('End time')}
            labelId="start-time-select"
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
    isUrgent: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
};
