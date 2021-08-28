import moment from "moment-timezone";
import { generateReducerActions } from "../../../../../../utils/helperFuncs";

/**
 * Filter available time based on start time and service duration
 * @param {Array.<string>} availableTime
 * @param {string} startTime
 * @param {{ duration: number}|null} service
 * @return {Array.<string>}
 */
export const filterAvailableTime = (availableTime, startTime, service = null) => {
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
};

const reducerTypes = {
  setPatient: 'setPatient',
  setPatients: 'setPatients',
  setDoctor: 'setDoctor',
  setService: 'setService',
  setServices: 'setServices',
  setHours: 'setHours',
  setPatientFirstName: 'setPatientFirstName',
  setPatientLastName: 'setPatientLastName',
  setPatientPhoneNumber: 'setPatientPhoneNumber',
  setIsPhoneValid: 'SetIsPhoneValid',
  setIsNewPatient: 'setIsNewPatient',
  setPatientsLoading: 'setPatientsLoading',
  setServicesLoading: 'setServicesLoading',
  setDoctorsLoading: 'setDoctorsLoading',
  setIsPatientValid: 'setIsPatientValid',
  setIsDoctorValid: 'setIsDoctorValid',
  setIsServiceValid: 'setIsServiceValid',
  setIsFetchingHours: 'setIsFetchingHours',
  setShowDatePicker: 'setShowDatePicker',
  setShowBirthdayPicker: 'setShowBirthdayPicker',
  setAppointmentDate: 'setAppointmentDate',
  setAppointmentHour: 'setAppointmentHour',
  setAppointmentNote: 'setAppointmentNote',
  setAppointmentStatus: 'setAppointmentStatus',
  setIsCreatingSchedule: 'setIsCreatingSchedule',
  setSchedule: 'setSchedule',
  setPatientBirthday: 'setPatientBirthday',
  setPatientEmail: 'setPatientEmail',
  setIsUrgent: 'setIsUrgent',
  setStartTime: 'setStartTime',
  setEndTime: 'setEndTime',
  resetState: 'resetState',
  setAvailableTime: 'setAvailableTime',
  setAvailableStartTime: 'setAvailableStartTime',
  setAvailableEndTime: 'setAvailableEndTime',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setPatient:
      return {
        ...state,
        patient: action.payload,
        isPatientValid: action.payload != null,
      };
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setDoctor:
      return {
        ...state,
        doctor: action.payload,
        isDoctorValid: action.payload != null,
      };
    case reducerTypes.setPatients:
      return { ...state, patients: action.payload };
    case reducerTypes.setIsPatientValid:
      return { ...state, isPatientValid: action.payload };
    case reducerTypes.setIsUrgent:
      return { ...state, isUrgent: action.payload };
    case reducerTypes.setStartTime: {
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
      return {
        ...state,
        startTime,
        availableEndTime,
        endTime: availableEndTime.includes(endTime)
          ? endTime
          : availableEndTime.length > 0
            ? availableEndTime[0]
            : '',
      };
    }
    case reducerTypes.setEndTime: {
      const endTime = action.payload;
      return { ...state, endTime };
    }
    case reducerTypes.setDoctorsLoading:
      return {
        ...state,
        loading: { ...state.loading, doctors: action.payload },
      };
    case reducerTypes.setServicesLoading:
      return {
        ...state,
        loading: { ...state.loading, services: action.payload },
      };
    case reducerTypes.setPatientsLoading:
      return {
        ...state,
        loading: { ...state.loading, patients: action.payload },
      };
    case reducerTypes.setIsDoctorValid:
      return { ...state, isDoctorValid: action.payload };
    case reducerTypes.setService: {
      return {
        ...state,
        service: action.payload,
        isServiceValid: action.payload != null,
      };
    }
    case reducerTypes.setIsServiceValid:
      return { ...state, isServiceValid: action.payload };
    case reducerTypes.setShowDatePicker:
      return { ...state, showDatePicker: action.payload };
    case reducerTypes.setAppointmentDate:
      return {
        ...state,
        appointmentDate: action.payload,
        showDatePicker: false,
      };
    case reducerTypes.setHours:
      return { ...state, hours: action.payload };
    case reducerTypes.setIsFetchingHours:
      return { ...state, isFetchingHours: action.payload };
    case reducerTypes.setAppointmentHour:
      return { ...state, appointmentHour: action.payload };
    case reducerTypes.setAppointmentNote:
      return { ...state, appointmentNote: action.payload };
    case reducerTypes.setAppointmentStatus:
      return { ...state, appointmentStatus: action.payload };
    case reducerTypes.setIsCreatingSchedule:
      return { ...state, isCreatingSchedule: action.payload };
    case reducerTypes.setSchedule: {
      const schedule = action.payload;
      const scheduleStartDate = moment(schedule.startTime);
      const scheduleEndDate = moment(schedule.endTime);
      return {
        ...state,
        scheduleId: schedule.id,
        patient: schedule.patient,
        doctor: schedule.doctor,
        service: schedule.service,
        appointmentNote: schedule.noteText,
        appointmentDate: scheduleStartDate.toDate(),
        startTime: scheduleStartDate.format('HH:mm'),
        endTime: scheduleEndDate.format('HH:mm'),
        appointmentStatus: schedule.scheduleStatus,
        isUrgent: schedule.isUrgent,
        isPatientValid: true,
        isDoctorValid: true,
        isServiceValid: true,
        isEditing: true,
      };
    }
    case reducerTypes.setIsNewPatient: {
      const isNewPatient = action.payload;
      return {
        ...state,
        isNewPatient,
        patientBirthday: null,
        patientEmail: '',
        patientFirstName: '',
        patientLastName: '',
        patientPhoneNumber: '',
      };
    }
    case reducerTypes.setPatientFirstName:
      return { ...state, patientFirstName: action.payload };
    case reducerTypes.setPatientLastName:
      return { ...state, patientLastName: action.payload };
    case reducerTypes.setPatientPhoneNumber:
      return {
        ...state,
        patientPhoneNumber: action.payload.phoneNumber,
        isPhoneValid: action.payload.isPhoneValid,
        phoneCountry: action.payload.country,
      };
    case reducerTypes.setPatientBirthday:
      return {
        ...state,
        patientBirthday: action.payload,
        showBirthdayPicker: false,
      };
    case reducerTypes.setPatientEmail:
      return {
        ...state,
        patientEmail: action.payload,
      };
    case reducerTypes.setShowBirthdayPicker:
      return {
        ...state,
        showBirthdayPicker: action.payload,
      };
    case reducerTypes.setAvailableTime: {
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
      return {
        ...state,
        availableTime,
        availableStartTime,
        availableEndTime,
        startTime,
        endTime,
      };
    }
    case reducerTypes.setAvailableStartTime:
      return { ...state, availableStartTime: action.payload };
    case reducerTypes.setAvailableEndTime:
      return { ...state, availableEndTime: action.payload };
    case reducerTypes.resetState:
      return initialState;
    default:
      return state;
  }
};
