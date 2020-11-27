import React, { useEffect, useReducer } from 'react';

import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';

import ConfirmationModal from '../../components/ConfirmationModal';
import MapSchedulesDataModal, {
  MappingData,
} from '../../components/MapSchedulesDataModal';
import SetupExcelModal, { UploadMode } from '../../components/SetupExcelModal';
import ImportDataModal from '../../components/UploadPatientsModal';
import {
  setAppointmentModal,
  setPaymentModal,
  toggleAppointmentsUpdate,
} from '../../redux/actions/actions';
import {
  clinicDoctorsSelector,
  clinicServicesSelector,
} from '../../redux/selectors/clinicSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import {
  fetchClinicData,
  generateReducerActions,
  logUserAction,
  uploadFileToAWS,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import AppointmentsCalendar from './comps/center/AppointmentsCalendar';
import CalendarDoctors from './comps/left/CalendarDoctors';

const reducerTypes = {
  setFilters: 'setFilters',
  setSelectedService: 'setSelectedService',
  setSelectedDoctor: 'setSelectedDoctor',
  setViewDate: 'setViewDate',
  setIsFetching: 'setIsFetching',
  setSelectedSchedule: 'setSelectedSchedule',
  setDeleteSchedule: 'setDeleteSchedule',
  setIsDeleting: 'setIsDeleting',
  setViewMode: 'setViewMode',
  setShowImportModal: 'setShowImportModal',
  setSetupExcelModal: 'setSetupExcelModal',
  setIsUploading: 'setIsUploading',
  setImportData: 'setImportData',
  setMappingModal: 'setMappingModal',
};

const reducerActions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setFilters:
      return { ...state, filters: action.payload };
    case reducerTypes.setSelectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.setSelectedDoctor:
      return {
        ...state,
        selectedDoctor: action.payload,
        selectedSchedule: null,
      };
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setViewDate:
      return { ...state, viewDate: action.payload, selectedSchedule: null };
    case reducerTypes.setSelectedSchedule:
      return { ...state, selectedSchedule: action.payload };
    case reducerTypes.setDeleteSchedule:
      return { ...state, deleteSchedule: action.payload };
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    case reducerTypes.setViewMode:
      return { ...state, viewMode: action.payload, selectedSchedule: null };
    case reducerTypes.setShowImportModal:
      return { ...state, showImportModal: action.payload };
    case reducerTypes.setSetupExcelModal:
      return { ...state, setupExcelModal: action.payload };
    case reducerTypes.setIsUploading:
      return { ...state, isUploading: action.payload };
    case reducerTypes.setImportData:
      return {
        ...state,
        importData: { ...state.importData, ...action.payload },
      };
    case reducerTypes.setMappingModal:
      return { ...state, mappingModal: action.payload };
    default:
      return state;
  }
};

const initialState = {
  filters: { doctors: [], services: [] },
  selectedService: null,
  selectedDoctor: null,
  appointmentModal: { open: false },
  isFetching: false,
  viewDate: new Date(),
  deleteSchedule: { open: false, schedule: null },
  isDeleting: false,
  viewMode: 'day',
  showImportModal: false,
  setupExcelModal: { open: false, data: null },
  isUploading: false,
  importData: {
    fileUrl: null,
    fileName: null,
    cellTypes: [],
    doctors: [],
    services: [],
  },
  mappingModal: {
    mode: MappingData.none,
    data: null,
  },
};

const Calendar = () => {
  const dispatch = useDispatch();
  const services = useSelector(clinicServicesSelector);
  const doctors = useSelector(clinicDoctorsSelector);
  const [
    {
      filters,
      selectedService,
      selectedDoctor,
      isFetching,
      viewDate,
      selectedSchedule,
      deleteSchedule,
      isDeleting,
      viewMode,
      showImportModal,
      setupExcelModal,
      isUploading,
      importData,
      mappingModal,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    const newDoctors = doctors.map(item => {
      const servicesIds = item.services.map(service => service.id);
      return {
        ...item,
        services: services.filter(service => servicesIds.includes(service.id)),
      };
    });
    localDispatch(reducerActions.setFilters({ doctors: newDoctors, services }));
    if (newDoctors.length > 0) {
      localDispatch(reducerActions.setSelectedDoctor(newDoctors[0]));
    }
  }, [doctors, services]);

  const handleAppointmentModalOpen = () => {
    dispatch(
      setAppointmentModal({
        open: true,
        doctor: selectedDoctor,
        date: viewDate,
      }),
    );
  };

  const handleDoctorSelected = doctor => {
    localDispatch(reducerActions.setSelectedDoctor(doctor));
  };

  const handleViewDateChange = newDate => {
    localDispatch(reducerActions.setViewDate(newDate));
  };

  const handleScheduleSelected = schedule => {
    localDispatch(reducerActions.setSelectedSchedule(schedule));
  };

  const handleViewModeChange = newMode => {
    localDispatch(reducerActions.setViewMode(newMode));
  };

  const handlePayDebt = debt => {
    dispatch(setPaymentModal({ open: true, invoice: debt }));
  };

  const handleEditSchedule = schedule => {
    dispatch(
      setAppointmentModal({
        open: true,
        schedule,
      }),
    );
  };

  const handleDeleteSchedule = schedule => {
    localDispatch(reducerActions.setDeleteSchedule({ open: true, schedule }));
  };

  const handleConfirmDeleteSchedule = async () => {
    if (deleteSchedule.schedule == null) {
      return;
    }
    localDispatch(reducerActions.setIsDeleting(true));
    await dataAPI.deleteSchedule(deleteSchedule.schedule.id);
    logUserAction(
      Action.DeleteAppointment,
      JSON.stringify(deleteSchedule.schedule),
    );
    localDispatch(
      reducerActions.setDeleteSchedule({ open: false, schedule: null }),
    );
    localDispatch(reducerActions.setIsDeleting(false));
    if (selectedSchedule.id === deleteSchedule.schedule.id) {
      localDispatch(reducerActions.setSelectedSchedule(null));
    }
    dispatch(toggleAppointmentsUpdate());
  };

  const handleCloseDeleteSchedule = () => {
    localDispatch(
      reducerActions.setDeleteSchedule({ open: false, schedule: null }),
    );
  };

  const handleImportFileSelected = async data => {
    localDispatch(reducerActions.setIsUploading(true));
    const fileName = data.file.name;
    const { location: fileUrl } = await uploadFileToAWS(
      'clients-uploads',
      data.file,
      true,
    );
    localDispatch(
      reducerActions.setSetupExcelModal({
        open: true,
        data: {
          fileName,
          fileUrl: encodeURI(fileUrl),
        },
      }),
    );
    localDispatch(reducerActions.setIsUploading(false));
  };

  const handleOpenImportModal = () => {
    localDispatch(reducerActions.setShowImportModal(true));
  };

  const handleCloseImportModal = () => {
    localDispatch(reducerActions.setShowImportModal(false));
  };

  const handleCloseSetupExcelModal = () => {
    localDispatch(
      reducerActions.setSetupExcelModal({ open: false, data: null }),
    );
  };

  const handleExcelCellsReady = data => {
    localDispatch(reducerActions.setImportData(data));
    localDispatch(
      reducerActions.setMappingModal({ mode: MappingData.doctors, data }),
    );
  };

  const handleCloseMappingModal = () => {
    localDispatch(
      reducerActions.setMappingModal({ mode: MappingData.none, data: null }),
    );
  };

  const handleImportSchedules = async requestBody => {
    localDispatch(reducerActions.setIsUploading(true));
    const response = await dataAPI.importSchedules(requestBody);
    if (response.isError) {
      console.error(response.message);
      localDispatch(reducerActions.setIsUploading(false));
    } else {
      setTimeout(() => {
        dispatch(toggleAppointmentsUpdate());
        localDispatch(reducerActions.setIsUploading(false));
      }, 3000);
    }
  };

  const handleMappingSubmit = result => {
    switch (result.mode) {
      case MappingData.doctors: {
        localDispatch(
          reducerActions.setImportData({ doctors: result.mappedItems }),
        );
        localDispatch(
          reducerActions.setMappingModal({
            mode: MappingData.services,
            data: {
              fileName: result.fileName,
              fileUrl: result.fileUrl,
              cellTypes: result.cellTypes,
            },
          }),
        );
        break;
      }
      case MappingData.services: {
        const requestBody = {
          ...importData,
          services: result.mappedItems,
        };

        const isDataValid =
          requestBody.fileUrl != null &&
          requestBody.fileName != null &&
          requestBody.cellTypes.length > 0 &&
          requestBody.doctors.length > 0 &&
          requestBody.services.length > 0;

        if (isDataValid) {
          handleImportSchedules(requestBody);
        }

        localDispatch(
          reducerActions.setMappingModal({
            mode: MappingData.none,
            data: null,
          }),
        );
        break;
      }
    }
  };

  return (
    <div className='calendar-root'>
      <MapSchedulesDataModal
        data={mappingModal.data}
        mode={mappingModal.mode}
        onClose={handleCloseMappingModal}
        onSubmit={handleMappingSubmit}
      />
      <SetupExcelModal
        title={textForKey('Import schedules')}
        onClose={handleCloseSetupExcelModal}
        open={setupExcelModal.open}
        data={setupExcelModal.data}
        timeout={3000}
        mode={UploadMode.schedules}
        onCellsReady={handleExcelCellsReady}
      />
      <ImportDataModal
        open={showImportModal}
        onClose={handleCloseImportModal}
        title={textForKey('Import schedules')}
        onUpload={handleImportFileSelected}
      />
      <ConfirmationModal
        isLoading={isDeleting}
        show={deleteSchedule.open}
        title={textForKey('Delete appointment')}
        message={textForKey('delete appointment message')}
        onConfirm={handleConfirmDeleteSchedule}
        onClose={handleCloseDeleteSchedule}
      />
      {viewMode !== 'day' && (
        <div className='calendar-root__content__left-container'>
          <CalendarDoctors
            isFetching={isFetching}
            selectedDoctor={selectedDoctor}
            selectedService={selectedService}
            doctors={filters.doctors}
            onSelect={handleDoctorSelected}
          />
        </div>
      )}
      <div className='calendar-root__content__center-container'>
        <AppointmentsCalendar
          isUploading={isUploading}
          onPayDebt={handlePayDebt}
          onDeleteSchedule={handleDeleteSchedule}
          onEditSchedule={handleEditSchedule}
          canAddAppointment={selectedDoctor != null}
          onAddAppointment={handleAppointmentModalOpen}
          selectedSchedule={selectedSchedule}
          onScheduleSelect={handleScheduleSelected}
          onViewDateChange={handleViewDateChange}
          onViewModeChange={handleViewModeChange}
          onImportSchedules={handleOpenImportModal}
          doctor={selectedDoctor}
          viewDate={viewDate}
        />
      </div>
    </div>
  );
};

export default Calendar;
