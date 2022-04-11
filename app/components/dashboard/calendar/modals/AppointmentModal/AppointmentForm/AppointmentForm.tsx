import React, {
  useState,
  Fragment,
  useRef,
  useEffect,
  useMemo,
  memo,
} from 'react';
import {
  TextField,
  SelectMenu,
  Typography,
  Button,
  Checkbox,
  CalendarPopper,
  LoadingButton,
} from '@easyplanpro/easyplan-components';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { PatientsAutocomplete } from 'app/components/common/PatientsAutocomplete';
import addTimeToDate from 'app/utils/addTimeToDate';
import { textForKey } from 'app/utils/localization';
import useDateFormatter from 'app/utils/useDateFormatter';
import {
  appointmentDoctorsSelector,
  appointmentEndHoursSelector,
  appointmentServicesSelector,
  appointmentStartHoursSelector,
  formDataSelector,
  newPatientModalOpenSelector,
} from 'redux/selectors/appointmentsSelector';
import {
  setSelectedDate,
  dispatchFetchServices,
  dispatchFetchStartHours,
  dispatchFetchEndHours,
  setStartHours,
  setAppointmentFormKeyValue,
  openNewPatientsModal,
  closeNewPatientsModal,
} from 'redux/slices/appointmentSlice';
import { dispatchCreateAppointment } from 'redux/slices/calendarData';
import { NewPatientPopper } from '../../NewPatientPopper';
// import { isScheduleLoadingSelector } from 'redux/selectors/calendarSelector';
import styles from './AppointmentForm.module.css';
import { AppointmentFormProps } from './AppointmentForm.types';

const AppointmentForm: React.FC<AppointmentFormProps> = ({ selectedDate }) => {
  const inputRef = useRef<HTMLDivElement | null>(null);
  const newClientRef = useRef<HTMLButtonElement>(null);
  const formData = useSelector(formDataSelector);
  const dispatch = useDispatch();
  const formatDate = useDateFormatter();
  // const isScheduleLoading = useSelector(isScheduleLoadingSelector);

  const { data: doctors, error: doctorsError } = useSelector(
    appointmentDoctorsSelector,
  );

  const { data: services, error: servicesError } = useSelector(
    appointmentServicesSelector,
  );

  const { data: startHours, error: startHoursError } = useSelector(
    appointmentStartHoursSelector,
  );

  const { data: endHours, error: endHoursError } = useSelector(
    appointmentEndHoursSelector,
  );
  const newPatientPopperOpen = useSelector(newPatientModalOpenSelector);
  const [wasSubmitClicked, setWasSubmitClicked] = useState(false);
  const [popperOpen, setPopperOpen] = useState(false);

  const formTitle = useMemo(() => {
    if (formData.scheduleId) return textForKey('Edit appointment');
    return textForKey('Add appointment');
  }, [formData.scheduleId]);

  const doctorsMappedToOptionStructure = useMemo(() => {
    if (doctors === null) return [];
    return doctors.map((doctor) => ({
      ...doctor,
      name: doctor.fullName,
    }));
  }, [doctors]);

  const mappedDoctorCabinets = useMemo(() => {
    const requiredDoctor = doctors?.find(
      (doctor) => doctor.id === formData.doctorId,
    );

    if (!requiredDoctor) return [];
    if (requiredDoctor.cabinets.length === 0) return [];

    return requiredDoctor.cabinets;
  }, [doctors, formData.doctorId]);

  const mappedStartHours = useMemo(() => {
    if (startHours === null) return [];
    return startHours?.map((hour) => ({ id: hour, name: hour }));
  }, [startHours]);

  const mappedEndHours = useMemo(() => {
    if (endHours === null) return [];
    return endHours?.map((hour) => ({ id: hour, name: hour }));
  }, [endHours]);

  useEffect(() => {
    if (!selectedDate) return;
    handleDateChange(selectedDate);
    if (formData.startHour !== '') {
      dispatch(setStartHours([formData.startHour]));
    }
  }, []);

  useEffect(() => {
    if (doctorsMappedToOptionStructure.length === 1) {
      dispatch(
        setAppointmentFormKeyValue({
          key: 'doctorId',
          value: doctorsMappedToOptionStructure[0].id as number,
        }),
      );
    }
  }, [doctorsMappedToOptionStructure]);

  useEffect(() => {
    if (formData?.doctorId === -1) return;
    if (formData.doctorId === null || formData.doctorId === 0) return;
    dispatch(dispatchFetchServices({ doctorId: String(formData.doctorId) }));
  }, [formData.doctorId]);

  useEffect(() => {
    if (selectedDate && formData.serviceId !== 0) {
      dispatch(
        dispatchFetchStartHours({
          doctorId: String(formData.doctorId),
          date: format(new Date(selectedDate), 'yyyy-MM-dd'),
          step: '5',
        }),
      );
    }
  }, [String(selectedDate), formData.serviceId]);

  useEffect(() => {
    if (mappedEndHours.length <= 1) return;
    dispatch(
      setAppointmentFormKeyValue({
        key: 'endHour',
        value: mappedEndHours[0].id,
      }),
    );
  }, [formData.startHour, mappedEndHours]);

  useEffect(() => {
    if (
      formData.startHour === '' ||
      formData.serviceId < 1 ||
      !formData.serviceId
    )
      return;
    dispatch(
      dispatchFetchEndHours({
        doctorId: String(formData.doctorId),
        date: format(new Date(selectedDate), 'yyyy-MM-dd'),
        serviceId: String(formData.serviceId),
        startTime: formData.startHour,
      }),
    );
  }, [formData.startHour, formData.serviceId]);

  const isFormValid = () => {
    const isPatientValid = formData.patientId !== 0;
    const isDoctorValid = formData.doctorId !== 0;
    const isCabinetValid =
      formData.cabinetId !== 0 || mappedDoctorCabinets.length === 0;
    const areHoursValid = formData.startHour !== '' && formData.endHour !== '';

    return (
      isPatientValid &&
      isDoctorValid &&
      isCabinetValid &&
      areHoursValid &&
      !wasSubmitClicked
    );
  };

  const handleFormChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setAppointmentFormKeyValue({
        key: evt.target.name as 'notes',
        value: evt.target.value,
      }),
    );
  };

  const handleSelect = (evt: any) => {
    dispatch(
      setAppointmentFormKeyValue({
        key: evt.target.name,
        value: Number(evt.target.value),
      }),
    );
  };

  const toggleIsUrgent = () => {
    dispatch(
      setAppointmentFormKeyValue({
        key: 'isUrgent',
        value: !formData.isUrgent,
      }),
    );
  };

  const handleDateChange = (date: any) => {
    closeDatePopper();
    dispatch(
      setAppointmentFormKeyValue({
        key: 'date',
        value: formatDate(date, false, 'dd MMMM yyyy'),
      }),
    );
    dispatch(setSelectedDate(format(date, 'yyyy-MM-dd')));
  };

  const closeDatePopper = () => {
    setPopperOpen(false);
  };

  const openDatePopper = () => {
    setPopperOpen(true);
  };

  const onPatientSelect = (value: string | number) => {
    dispatch(setAppointmentFormKeyValue({ key: 'patientId', value }));
  };

  const handleHourChange = (evt: any) => {
    dispatch(
      setAppointmentFormKeyValue({
        key: evt.target.name,
        value: evt.target.value,
      }),
    );
  };

  const handleNewPatientClick = () => {
    dispatch(openNewPatientsModal());
  };

  const handleNewPatientClose = () => {
    dispatch(closeNewPatientsModal());
  };

  const handleFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (selectedDate === null) return;
    const [startHours, startMinutes] = formData.startHour.split(':');
    const [endHours, endMinutes] = formData.endHour.split(':');

    const body = {
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      serviceId: formData.serviceId,
      cabinetId: formData.cabinetId ?? null,
      startDate: String(addTimeToDate(selectedDate, startHours, startMinutes)),
      endDate: String(addTimeToDate(selectedDate, endHours, endMinutes)),
      isUrgent: formData.isUrgent,
      status: 'Pending',
      message: String(formData.notes),
      scheduleId: formData.scheduleId,
    };
    dispatch(dispatchCreateAppointment(body));
    setWasSubmitClicked(true);
  };

  return (
    <Fragment>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <Typography variant='titleSmall' sx={{ marginBottom: '1.5em' }}>
          {formTitle}
        </Typography>
        <PatientsAutocomplete
          key={formData.patientId}
          className={styles.noMargin}
          onSelect={onPatientSelect}
          value={formData.patientId}
        />
        <Button
          ref={newClientRef}
          variant='text'
          label={`${textForKey('new patient')}?`}
          size='small'
          onClick={handleNewPatientClick}
        />
        <SelectMenu
          options={doctorsMappedToOptionStructure}
          label={textForKey('appointment_doctor')}
          fullWidth
          name='doctorId'
          onChange={handleSelect}
          value={formData.doctorId}
          helperText={doctorsError ?? ''}
          disabled={doctorsMappedToOptionStructure.length === 1}
        />
        <SelectMenu
          options={mappedDoctorCabinets}
          label={textForKey('appointment_cabinet')}
          fullWidth
          name='cabinetId'
          disabled={mappedDoctorCabinets.length === 0}
          onChange={handleSelect}
          value={formData.cabinetId}
        />
        <SelectMenu
          options={services ?? []}
          label={textForKey('appointment_service')}
          fullWidth
          name='serviceId'
          onChange={handleSelect}
          helperText={servicesError ?? ''}
          value={formData.serviceId}
        />
        <TextField
          label={textForKey('appointment_date')}
          fullWidth
          ref={inputRef}
          name='date'
          value={formData.date}
          onClick={openDatePopper}
          readOnly
        />
        <div className={styles.flexWrapper}>
          <SelectMenu
            options={mappedStartHours}
            label={textForKey('appointment_hours')}
            fullWidth
            name='startHour'
            value={formData.startHour}
            onChange={handleHourChange}
          />
          <SelectMenu
            options={mappedEndHours}
            label=' '
            fullWidth
            name='endHour'
            sx={{ marginTop: '1em' }}
            value={formData.endHour}
            onChange={handleHourChange}
          />
        </div>
        {startHoursError && (
          <Typography variant='overlineLarge'>{startHoursError}</Typography>
        )}
        {endHoursError && (
          <Typography variant='overlineLarge'>{endHoursError}</Typography>
        )}
        <TextField
          type='text'
          fullWidth
          label={textForKey('appointment_notes')}
          placeholder={textForKey('appointment_notes')}
          minRows={3}
          maxRows={5}
          multiline
          name='notes'
          value={formData.notes}
          onChange={handleFormChange}
        />
        <div className={styles.flexWrapperPadding}>
          <Checkbox
            disabled={false}
            checkType='check'
            label={textForKey('appointment_urgent')}
            name='isUrgent'
            checked={formData.isUrgent}
            onChange={toggleIsUrgent}
            variant='overlineLarge'
          />
          <LoadingButton
            type='submit'
            label={textForKey('appointment_create')}
            variant='contained'
            size='medium'
            // loading={isScheduleLoading}
            disabled={!isFormValid()}
          />
        </div>
      </form>
      {newPatientPopperOpen && (
        <NewPatientPopper
          anchorEl={newClientRef.current}
          open={newPatientPopperOpen}
          className={styles.newPatientPopper}
          placement='right'
          onClose={handleNewPatientClose}
        />
      )}
      <CalendarPopper
        locale='ro'
        open={popperOpen}
        selectedDate={new Date(selectedDate)}
        anchorEl={inputRef.current}
        onChange={handleDateChange}
        onClose={closeDatePopper}
      />
    </Fragment>
  );
};

export default memo(AppointmentForm);
