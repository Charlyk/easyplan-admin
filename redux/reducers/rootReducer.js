import { combineReducers } from '@reduxjs/toolkit';
import appNotification from 'app/components/common/GlobalNotificationView/GlobalNotificationView.reducer';
import exchangeRates from 'app/components/common/MainComponent/ExchageRates/ExchangeRates.slice';
import changeLogModal from 'app/components/common/modals/ChangeLogsModal/ChangeLogModal.reducer';
import crmFilters from 'app/components/crm/CrmMain/CrmFilters/CrmFilters.reducer';
import clinicAnalytics from 'app/components/dashboard/analytics/ClinicAnalytics/ClinicAnalytics.reducer';
import invoicesButton from 'app/components/dashboard/InvoicesButton/InvoicesButton.slice';
import patientVisits from 'app/components/dashboard/patients/PatientDetailsModal/AppointmentNotes/AppointmentNotes.reducer';
import patientPhoneCalls from 'app/components/dashboard/patients/PatientDetailsModal/PatientPhoneRecords/PatientPhoneRecords.reducer';
import patientPurchases from 'app/components/dashboard/patients/PatientDetailsModal/PatientPurchasesList/PatientPurchasesList.reducer';
import clinicSettings from 'app/components/dashboard/settings/ApplicationSettings/ClinicSettings/ClinicSettings.reducer';
import moizvonkiConnection from 'app/components/dashboard/settings/CrmSettings/Integrations/MoizvonkiIntegration/MoizvonkiIntegration.reducer';
import appData from 'redux/slices/appDataSlice';
import appointments from 'redux/slices/appointmentSlice';
import cabinetsData from 'redux/slices/cabinetsData';
import calendarData from 'redux/slices/calendarData';
import clinicData from 'redux/slices/clinicDataSlice';
import appointmentModal from 'redux/slices/createAppointmentModalSlice';
import createReminderModal from 'redux/slices/CreateReminderModal.reducer';
import crmBoard from 'redux/slices/crmBoardSlice';
import crm from 'redux/slices/crmSlice';
import doctorScheduleDetails from 'redux/slices/doctorScheduleDetailsSlice';
import globalNotifications from 'redux/slices/globalNotificationsSlice';
import main from 'redux/slices/mainReduxSlice';
import patientList from 'redux/slices/patientsListSlice';
import patients from 'redux/slices/patientsSlice';
import payments from 'redux/slices/paymentSlice';
import pubnubMessages from 'redux/slices/pubnubMessagesSlice';
import servicesList from 'redux/slices/servicesListSlice';
import usersList from 'redux/slices/usersListSlice';
import appointmentsReports from '../slices/appointmentsReportSlice';
import patientsAutocomplete from '../slices/patientsAutocompleteSlice';
import paymentReports from '../slices/paymentReportsSlice';
import pendingConsultations from '../slices/pendingConsultationsSlice';
import addPaymentModal from './addPaymentModal';
import calendar from './calendar';
import clinic from './clinic';
import exchangeRatesModal from './exchangeRatesModal';
import imageModal from './imageModal';
import invoices from './invoiceReducer';
import patientNoteModal from './patientNoteModal';
import patient from './patientReducer';
import patientXRayModal from './patientXRayModal';
import paymentModal from './paymentModal';
import schedule from './scheduleReducer';
import serviceDetailsModal from './serviceDetailsReducer';
import services from './servicesReducer';
import users from './usersReducer';

const rootReducer = combineReducers({
  main,
  clinic,
  patientNoteModal,
  patientXRayModal,
  appointmentModal,
  paymentModal,
  calendar,
  imageModal,
  serviceDetailsModal,
  addPaymentModal,
  exchangeRatesModal,
  patient,
  schedule,
  invoices,
  services,
  users,
  crm,
  clinicData,
  calendarData,
  appData,
  cabinetsData,
  usersList,
  servicesList,
  doctorScheduleDetails,
  globalNotifications,
  patientList,
  invoicesButton,
  exchangeRates,
  clinicAnalytics,
  crmBoard,
  pubnubMessages,
  patientPhoneCalls,
  patientVisits,
  patientPurchases,
  changeLogModal,
  appNotification,
  clinicSettings,
  moizvonkiConnection,
  crmFilters,
  createReminderModal,
  patients,
  appointments,
  patientsAutocomplete,
  paymentsState: payments,
  paymentReports,
  pendingConsultations,
  appointmentsReports,
});

export default rootReducer;
