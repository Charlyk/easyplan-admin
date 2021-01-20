import React, { useEffect, useReducer, useRef } from 'react';

import { Paper } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';
import sum from 'lodash/sum';
import moment from 'moment';
import { Form, Modal, Spinner } from 'react-bootstrap';
import { Menu, MenuItem, Typeahead } from 'react-bootstrap-typeahead';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import IconAvatar from '../../assets/icons/iconAvatar';
import FinalizeTreatmentModal from '../../components/FinalizeTreatmentModal';
import LoadingButton from '../../components/LoadingButton';
import PatientDetails from '../../pages/Patients/comps/details/PatientDetails';
import {
  setPatientNoteModal,
  setPatientXRayModal,
} from '../../redux/actions/actions';
import { clinicServicesSelector } from '../../redux/selectors/clinicSelector';
import { userSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action, teeth } from '../../utils/constants';
import { generateReducerActions, logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import sessionManager from '../../utils/settings/sessionManager';
import FinalServiceItem from './components/FinalServiceItem';
import ToothView from './components/ToothView';

import '../../components/PatientDetailsModal/styles.scss';
import './styles.scss';

const areSameServices = (first, second) => {
  return (
    first.id === second.id &&
    first.toothId === second.toothId &&
    first.destination === second.destination
  );
};

const TabId = {
  appointmentsNotes: 'AppointmentsNotes',
  appointments: 'Appointments',
  notes: 'Notes',
  xRay: 'X-Ray',
  treatmentPlans: 'TreatmentPlans',
  orthodonticPlan: 'OrthodonticPlan',
};

const initialState = {
  isLoading: false,
  patient: null,
  toothServices: [],
  allServices: [],
  bracesServices: [],
  selectedServices: [],
  completedServices: [],
  schedule: null,
  shouldFillTreatmentPlan: null,
  treatmentPlan: null,
  showFinalizeTreatment: false,
  isFinalizing: false,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setPatient: 'setPatient',
  setToothServices: 'setToothServices',
  setAllServices: 'setAllServices',
  setSelectedServices: 'setSelectedServices',
  setSchedule: 'setSchedule',
  setShouldFillTreatmentPlan: 'setShouldFillTreatmentPlan',
  setTreatmentPlan: 'setTreatmentPlan',
  setShowFinalizeTreatment: 'setShowFinalizeTreatment',
  setIsFinalizing: 'setIsFinalizing',
  setServices: 'setServices',
  setScheduleDetails: 'setScheduleDetails',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setPatient:
      return { ...state, patient: action.payload };
    case reducerTypes.setToothServices: {
      return { ...state, toothServices: action.payload };
    }
    case reducerTypes.setAllServices:
      return { ...state, allServices: action.payload };
    case reducerTypes.setSelectedServices: {
      const { services, canRemove } = action.payload;
      return {
        ...state,
        selectedServices: services.map(item => ({
          ...item,
          canRemove: canRemove,
        })),
        servicesFieldValue: '',
      };
    }
    case reducerTypes.setSchedule:
      return { ...state, schedule: action.payload };
    case reducerTypes.setShouldFillTreatmentPlan:
      return { ...state, shouldFillTreatmentPlan: action.payload };
    case reducerTypes.setShowFinalizeTreatment:
      return { ...state, showFinalizeTreatment: action.payload };
    case reducerTypes.setIsFinalizing:
      return { ...state, isFinalizing: action.payload };
    case reducerTypes.setServices: {
      // get services aplicable on all teeth
      const allTeethServices = action.payload.filter(
        it => it.serviceType === 'All',
      );
      // get services applicable on a single tooth
      const toothServices = action.payload.filter(
        item => item.serviceType === 'Single',
      );
      // get all braces services
      const allBracesServices = action.payload.filter(
        it => it.serviceType === 'Braces',
      );
      // map braces serivces to add mandible destination
      const mandibleBracesServices = allBracesServices.map(item => ({
        ...item,
        destination: 'Mandible',
      }));
      // map maxillary services to add maxillary destination
      const maxillaryBracesServices = allBracesServices.map(item => ({
        ...item,
        destination: 'Maxillary',
      }));

      // create an array with all services
      const allServices = [
        ...allTeethServices,
        ...mandibleBracesServices,
        ...maxillaryBracesServices,
      ];

      // save filtered services to state
      return {
        ...state,
        allServices: sortBy(allServices, item => item.name),
        toothServices: sortBy(toothServices, item => item.name),
        bracesServices: sortBy(toothServices, item => item.name),
      };
    }
    case reducerTypes.setScheduleDetails: {
      const { patient, treatmentPlan } = action.payload;
      const existentSelectedServices = cloneDeep(state.selectedServices);

      // combine services and braces in one array
      const newSelectedServices = [
        ...treatmentPlan.services
          .filter(item => !item.completed)
          .map(it => ({ ...it, canRemove: false })),
        ...treatmentPlan.braces
          .filter(item => !item.completed)
          .map(it => ({ ...it, canRemove: false })),
      ];

      // remove unused services from selected
      const diffsToRemove = existentSelectedServices.filter(
        item =>
          item.serviceType == null &&
          !newSelectedServices.some(it => areSameServices(it, item)),
      );
      remove(existentSelectedServices, item =>
        diffsToRemove.some(it => areSameServices(it, item)),
      );

      // add new services to selected
      const diffsToAdd = newSelectedServices.filter(
        item => !existentSelectedServices.some(it => areSameServices(it, item)),
      );
      diffsToAdd.forEach(item => existentSelectedServices.push(item));

      return {
        ...state,
        patient,
        schedule: action.payload,
        selectedServices: existentSelectedServices,
        completedServices: [
          ...treatmentPlan.services.filter(item => item.completed),
          ...treatmentPlan.braces.filter(item => item.completed),
        ],
      };
    }
    default:
      return state;
  }
};

const DoctorPatientDetails = () => {
  const dispatch = useDispatch();
  const { scheduleId } = useParams();
  const history = useHistory();
  const servicesRef = useRef(null);
  const clinicServices = useSelector(clinicServicesSelector);
  const currentUser = useSelector(userSelector);
  const [
    {
      isLoading,
      patient,
      toothServices,
      allServices,
      selectedServices,
      schedule,
      showFinalizeTreatment,
      isFinalizing,
      completedServices,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchScheduleDetails();
  }, [scheduleId]);

  useEffect(() => {
    // get services provided by current user
    const userServicesIds = (
      currentUser.clinics.find(
        item => item.clinicId === sessionManager.getSelectedClinicId(),
      )?.services || []
    ).map(it => it.serviceId);
    // filter clinic services to get only provided by current user services
    localDispatch(
      actions.setServices(
        clinicServices.filter(item => userServicesIds.includes(item.id)),
      ),
    );
  }, [clinicServices]);

  const fetchScheduleDetails = async () => {
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.fetchDoctorPatientDetails(scheduleId);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const { data } = response;
      localDispatch(actions.setScheduleDetails(data));
    }
    localDispatch(actions.setIsLoading(false));
  };

  const handleAddNote = () => {
    dispatch(
      setPatientNoteModal({ open: true, patientId: patient.id, mode: 'notes' }),
    );
  };

  const handleAddXRay = () => {
    dispatch(setPatientXRayModal({ open: true, patientId: patient.id }));
  };

  const handleEditAppointmentNote = visit => {
    dispatch(
      setPatientNoteModal({
        open: true,
        patientId: patient.id,
        mode: 'visits',
        visit: visit,
        scheduleId,
      }),
    );
  };

  const handleToothServicesChange = ({ toothId, services }) => {
    let newServices = cloneDeep(selectedServices);
    remove(newServices, item => item.toothId === toothId);
    for (let service of services) {
      newServices.unshift({ ...service, toothId });
    }
    localDispatch(
      actions.setSelectedServices({ services: newServices, canRemove: true }),
    );
  };

  const handleRemoveSelectedService = service => {
    let newServices = cloneDeep(selectedServices);
    remove(
      newServices,
      item =>
        item.id === service.id &&
        item.toothId === service.toothId &&
        item.destination === service.destination,
    );
    localDispatch(
      actions.setSelectedServices({ services: newServices, canRemove: true }),
    );
  };

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    } else if (patient?.firstName) {
      return patient.firstName;
    } else if (patient?.lastName) {
      return patient.lastName;
    } else {
      return patient?.phoneNumber || '';
    }
  };

  const getTotalPrice = () => {
    const prices = selectedServices.map(item => item.price);
    return sum(prices);
  };

  const handleSaveTreatmentPlan = () => {
    fetchScheduleDetails();
  };

  const handleSelectedItemsChange = selectedItems => {
    if (selectedItems.length === 0) return;
    const newServices = cloneDeep(selectedServices);
    console.log(selectedItems);
    const serviceExists = newServices.some(
      item =>
        item.id === selectedItems[0].id &&
        item.destination === selectedItems[0].destination,
    );
    if (!serviceExists) {
      newServices.push(selectedItems[0]);
      localDispatch(
        actions.setSelectedServices({ services: newServices, canRemove: true }),
      );
    }
  };

  const handleFinalizeTreatment = () => {
    localDispatch(actions.setShowFinalizeTreatment(true));
  };

  const handleCloseFinalizeTreatment = () => {
    localDispatch(actions.setShowFinalizeTreatment(false));
  };

  const finalizeTreatment = async plannedServices => {
    handleCloseFinalizeTreatment();
    localDispatch(actions.setIsFinalizing(true));

    const requestBody = {
      scheduleId,
      services: plannedServices.map(item => ({
        id: item.id,
        toothId: item.toothId,
        completed: item.selected,
        destination: item.destination,
        isBraces: item.isBraces,
        count: item.count,
        price: item.price,
        isSelected: item.isSelected,
      })),
    };

    logUserAction(Action.FinalizeTreatment, JSON.stringify(requestBody));

    const response = await dataAPI.finalizeTreatment(patient.id, requestBody);

    if (response.isError) {
      toast.error(textForKey(response.message));
      localDispatch(actions.setIsFinalizing(false));
    } else {
      history.goBack();
    }
  };

  const isFinished =
    schedule?.scheduleStatus === 'CompletedNotPaid' ||
    schedule?.scheduleStatus === 'CompletedPaid' ||
    schedule?.scheduleStatus === 'PartialPaid';

  const canFinalize = schedule?.scheduleStatus === 'OnSite';

  return (
    <div className='doctor-patient-root'>
      <FinalizeTreatmentModal
        onSave={finalizeTreatment}
        totalPrice={getTotalPrice()}
        services={selectedServices}
        open={showFinalizeTreatment}
        onClose={handleCloseFinalizeTreatment}
      />
      <Modal
        centered
        className='loading-modal'
        show={isLoading || isFinalizing}
        onHide={() => null}
      >
        <Modal.Body>
          <Spinner animation='border' />
          {isLoading && textForKey('Loading patient...')}
          {isFinalizing && textForKey('Finalizing treatment...')}
        </Modal.Body>
      </Modal>
      <div className='left-container'>
        <div className='patient-info'>
          <IconAvatar />
          <div className='personal-data-container'>
            <span className='patient-name'>{getPatientName()}</span>
            <div className='patient-info-row'>
              <span className='patient-info-title'>{textForKey('Date')}:</span>
              <span className='patient-info-value'>
                {schedule
                  ? moment(schedule.startTime).format('DD MMM YYYY HH:mm')
                  : ''}
              </span>
            </div>
            <div className='patient-info-row'>
              <span className='patient-info-title'>
                {textForKey('Doctor')}:
              </span>
              <span className='patient-info-value'>{currentUser.fullName}</span>
            </div>
          </div>
        </div>
        <div className='tooth-container'>
          <div className='top-left'>
            {teeth
              .filter(it => it.type === 'top-left')
              .map(item => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  selectedServices={selectedServices}
                  completedServices={completedServices.filter(
                    service => service.toothId != null,
                  )}
                  toothId={item.toothId}
                />
              ))}
          </div>
          <div className='top-right'>
            {teeth
              .filter(it => it.type === 'top-right')
              .map(item => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  selectedServices={selectedServices}
                  completedServices={completedServices.filter(
                    service => service.toothId != null,
                  )}
                  toothId={item.toothId}
                />
              ))}
          </div>
          <div className='bottom-left'>
            {teeth
              .filter(it => it.type === 'bottom-left')
              .map(item => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  selectedServices={selectedServices}
                  completedServices={completedServices.filter(
                    service => service.toothId != null,
                  )}
                  toothId={item.toothId}
                  direction='top'
                />
              ))}
          </div>
          <div className='bottom-right'>
            {teeth
              .filter(it => it.type === 'bottom-right')
              .map(item => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  selectedServices={selectedServices}
                  completedServices={completedServices.filter(
                    service => service.toothId != null,
                  )}
                  toothId={item.toothId}
                  direction='top'
                />
              ))}
          </div>
        </div>
        <Paper classes={{ root: 'services-container' }}>
          <div className='input-wrapper'>
            <Form.Group>
              <Typeahead
                ref={servicesRef}
                placeholder={textForKey('Enter service name')}
                id='services'
                options={allServices}
                filterBy={['name']}
                labelKey='name'
                selected={[]}
                onChange={handleSelectedItemsChange}
                renderMenu={(results, menuProps) => {
                  return (
                    <Menu {...menuProps}>
                      {results.map((result, index) => (
                        <MenuItem
                          key={`${result.id}-${result.destination}`}
                          option={result}
                          position={index}
                        >
                          {result.name}{' '}
                          {result.destination &&
                            `(${textForKey(result.destination)})`}
                        </MenuItem>
                      ))}
                    </Menu>
                  );
                }}
              />
            </Form.Group>
          </div>

          <div className='selected-services-wrapper'>
            <table style={{ width: '100%' }}>
              <tbody>
                {selectedServices
                  .filter(it => !it.completed)
                  .map(service => (
                    <FinalServiceItem
                      canRemove={service.canRemove}
                      onRemove={handleRemoveSelectedService}
                      key={`${service.id}-${service.toothId}-${service.name}-${service.destination}`}
                      service={service}
                    />
                  ))}
              </tbody>
            </table>
          </div>

          <div className='selected-services-footer'>
            <LoadingButton
              isLoading={isFinalizing}
              onClick={handleFinalizeTreatment}
              disabled={
                selectedServices.length === 0 || isFinished || !canFinalize
              }
              className='positive-button'
            >
              {isFinished
                ? textForKey(schedule.scheduleStatus)
                : textForKey('Finalize')}
            </LoadingButton>
          </div>
        </Paper>
      </div>
      <div className='right-container'>
        {patient && (
          <PatientDetails
            isDoctor
            scheduleId={scheduleId}
            onAddXRay={handleAddXRay}
            onAddNote={handleAddNote}
            onSaveOrthodonticPlan={handleSaveTreatmentPlan}
            onEditAppointmentNote={handleEditAppointmentNote}
            patient={patient}
            defaultTab={TabId.notes}
            showTabs={[
              TabId.orthodonticPlan,
              TabId.appointmentsNotes,
              TabId.xRay,
              TabId.notes,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorPatientDetails;
