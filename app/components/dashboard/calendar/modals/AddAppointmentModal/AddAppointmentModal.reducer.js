import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

/**
 * Filter available time based on start time and service duration
 * @param {Array.<string>} availableTime
 * @param {string} startTime
 * @param {{ duration: number}|null} service
 * @return {Array.<string>}
 */
export const filterAvailableTime = (
  availableTime,
  startTime,
  service = null,
) => {
  return availableTime.filter((item) => {
    const [startH, startM] = startTime.split(':');
    const [h, m] = item.split(':');
    const startDate = moment().set({
      hour: parseInt(startH),
      minute: parseInt(startM),
      second: 0,
    });
    const endDate = moment().set({
      hour: parseInt(h),
      minute: parseInt(m),
      second: 0,
    });
    const diff = Math.ceil(endDate.diff(startDate) / 1000 / 60);
    return diff >= (service?.duration || 15);
  });
};

/**
 * Get the end hour for a schedule based on service duration
 * @param {Array.<string>} availableTime
 * @param {string} startTime
 * @param {{ duration: number}|null} service
 * @return {string}
 */
export const getEndTimeBasedOnService = (availableTime, startTime, service) => {
  const filteredTime = filterAvailableTime(availableTime, startTime, service);
  return filteredTime.length > 0 ? filteredTime[0] : '';
};

export const initialState = {
  patient: null,
  patients: [],
  availableStartTime: [],
  availableEndTime: [],
  availableTime: [],
  doctor: null,
  service: null,
  services: [],
  hours: [],
  isNewPatient: false,
  patientFirstName: '',
  patientLastName: '',
  patientPhoneNumber: '',
  patientBirthday: null,
  patientEmail: '',
  patientLanguage: 'ro',
  patientSource: 'Unknown',
  phoneCountry: { countryCode: 'md', dialCode: '373' },
  isFetchingHours: false,
  isCreatingSchedule: false,
  isPatientValid: false,
  isDoctorValid: false,
  isServiceValid: false,
  isEditing: false,
  showDatePicker: false,
  appointmentDate: new Date(),
  scheduleId: null,
  appointmentHour: '',
  startTime: '',
  endTime: '',
  appointmentNote: '',
  appointmentStatus: 'Pending',
  isUrgent: false,
  loading: { patients: false, services: false, doctors: false },
  cabinet: null,
};

const addAppointmentModalSlice = createSlice({
  name: 'addAppointmentModal',
  initialState,
  reducers: {
    setPatient(state, action) {
      state.patient = action.payload;
      state.isPatientValid = action.payload != null;
    },
    setPatients(state, acton) {
      state.patients = acton.payload;
    },
    setDoctor(state, action) {
      state.doctor = action.payload;
      state.service = null;
      state.isDoctorValid = action.payload != null;
    },
    setService(state, action) {
      state.service = action.payload;
      state.isServiceValid = action.payload != null;
    },
    setServices(state, action) {
      state.services = action.payload;
    },
    setHours(state, action) {
      state.hours = action.payload;
    },
    setPatientFirstName(state, action) {
      state.patientFirstName = action.payload;
    },
    setPatientLastName(state, action) {
      state.patientLastName = action.payload;
    },
    setPatientPhoneNumber(state, action) {
      state.patientPhoneNumber = action.payload.phoneNumber;
      state.isPhoneValid = action.payload.isPhoneValid;
      state.phoneCountry = action.payload.country;
    },
    setIsNewPatient(state, action) {
      state.isNewPatient = action.payload;
      state.patientBirthday = null;
      state.patientEmail = '';
      state.patientFirstName = '';
      state.patientLastName = '';
      state.patientPhoneNumber = '';
    },
    setPatientsLoading(state, action) {
      state.loading = { ...state.loading, patients: action.payload };
    },
    setServicesLoading(state, action) {
      state.loading = { ...state.loading, services: action.payload };
    },
    setDoctorsLoading(state, action) {
      state.loading = { ...state.loading, doctors: action.payload };
    },
    setIsPatientValid(state, action) {
      state.isPatientValid = action.payload;
    },
    setIsDoctorValid(state, action) {
      state.isDoctorValid = action.payload;
    },
    setIsServiceValid(state, action) {
      state.isServiceValid = action.payload;
    },
    setIsFetchingHours(state, action) {
      state.isFetchingHours = action.payload;
    },
    setShowDatePicker(state, action) {
      state.showDatePicker = action.payload;
    },
    setShowBirthdayPicker(state, action) {
      state.showBirthdayPicker = action.payload;
    },
    setAppointmentDate(state, action) {
      state.appointmentDate = action.payload;
      state.showDatePicker = false;
    },
    setAppointmentHour(state, action) {
      state.appointmentHour = action.payload;
    },
    setAppointmentNote(state, action) {
      state.appointmentNote = action.payload;
    },
    setAppointmentStatus(state, action) {
      state.appointmentStatus = action.payload;
    },
    setIsCreatingSchedule(state, action) {
      state.isCreatingSchedule = action.payload;
    },
    setSchedule(state, action) {
      const schedule = action.payload;
      const scheduleStartDate = moment(schedule.startTime);
      const scheduleEndDate = moment(schedule.endTime);
      const {
        patient,
        doctor,
        service,
        noteText,
        scheduleStatus,
        isUrgent,
        cabinet,
      } = schedule;

      state.scheduleId = schedule.id;
      state.patient = {
        ...patient,
        name: patient.fullName,
        label: patient.fullName,
      };
      state.cabinet = { ...cabinet, label: cabinet.name };
      state.doctor = doctor;
      state.service = { ...service, label: service.name };
      state.appointmentNote = noteText;
      state.appointmentDate = scheduleStartDate.toDate();
      state.startTime = scheduleStartDate.format('HH:mm');
      state.endTime = scheduleEndDate.format('HH:mm');
      state.appointmentStatus = scheduleStatus;
      state.isUrgent = isUrgent;
      state.isPatientValid = true;
      state.isDoctorValid = true;
      state.isServiceValid = true;
      state.isEditing = true;
    },
    setPatientBirthday(state, action) {
      state.patientBirthday = action.payload;
      state.showBirthdayPicker = false;
    },
    setPatientEmail(state, action) {
      state.patientEmail = action.payload;
    },
    setIsUrgent(state, action) {
      state.isUrgent = action.payload;
    },
    setStartTime(state, action) {
      const startTime = action.payload;
      const endTime = getEndTimeBasedOnService(
        state.availableTime,
        startTime,
        state.service,
      );
      const availableEndTime = filterAvailableTime(
        state.availableTime,
        startTime,
      );

      state.startTime = startTime;
      state.availableEndTime = availableEndTime;
      state.endTime = availableEndTime.includes(endTime)
        ? endTime
        : availableEndTime.length > 0
        ? availableEndTime[0]
        : '';
    },
    setEndTime(state, action) {
      state.endTime = action.payload;
    },
    resetState() {
      return initialState;
    },
    setAvailableTime(state, action) {
      const availableTime = action.payload;
      const startTime =
        availableTime?.length > 0 && state.startTime.length === 0
          ? availableTime[0]
          : state.startTime;

      const endTime = !state.isEditing
        ? getEndTimeBasedOnService(availableTime, startTime, state.service)
        : state.endTime;

      const availableStartTime = availableTime;
      const availableEndTime = filterAvailableTime(availableTime, startTime);
      state.availableTime = availableTime;
      state.availableStartTime = availableStartTime;
      state.availableEndTime = availableEndTime;
      state.startTime = startTime;
      state.endTime = endTime;
    },
    setAvailableStartTime(state, action) {
      state.availableStartTime = action.payload;
    },
    setAvailableEndTime(state, action) {
      state.availableEndTime = action.payload;
    },
    setPatientLanguage(state, action) {
      state.patientLanguage = action.payload;
    },
    setPatientSource(state, action) {
      state.patientSource = action.payload;
    },
    setSelectedCabinet(state, action) {
      if (action.payload == null) {
        state.cabinet = null;
      } else {
        state.cabinet = {
          ...action.payload,
          label: action.payload.name,
        };
      }
      state.doctor = null;
      state.isDoctorValid = action.payload != null;
    },
    setSelectedCabinetInDoctorMode(state, action) {
      state.cabinet = { ...action.payload, label: action.payload.name };
    },
  },
});

export const {
  setPatient,
  setPatients,
  setPatientSource,
  setPatientLanguage,
  setShowDatePicker,
  setSchedule,
  setAppointmentHour,
  setAppointmentStatus,
  setEndTime,
  setDoctor,
  setAppointmentDate,
  setIsCreatingSchedule,
  setAppointmentNote,
  setHours,
  setIsDoctorValid,
  setServices,
  setAvailableTime,
  setIsFetchingHours,
  setIsNewPatient,
  setIsPatientValid,
  setIsUrgent,
  setPatientBirthday,
  setPatientPhoneNumber,
  setPatientEmail,
  setPatientFirstName,
  setService,
  setShowBirthdayPicker,
  setServicesLoading,
  setPatientLastName,
  setPatientsLoading,
  setStartTime,
  setSelectedCabinet,
  setSelectedCabinetInDoctorMode,
  resetState,
} = addAppointmentModalSlice.actions;

export default addAppointmentModalSlice.reducer;
