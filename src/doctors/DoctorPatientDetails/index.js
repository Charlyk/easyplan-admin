import React, { useEffect, useReducer } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import sum from 'lodash/sum';
import moment from 'moment';
import { Form, Modal, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import './styles.scss';
import IconAvatar from '../../assets/icons/iconAvatar';
import FinalizeTreatmentModal from '../../components/FinalizeTreatmentModal';
import LoadingButton from '../../components/LoadingButton';
import PatientDetails from '../../pages/Patients/comps/details/PatientDetails';
import {
  setPatientNoteModal,
  setPatientXRayModal,
} from '../../redux/actions/actions';
import { clinicServicesSelector } from '../../redux/selectors/clinicSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action, teeth } from '../../utils/constants';
import { generateReducerActions, logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import FinalServiceItem from './components/FinalServiceItem';
import ToothView from './components/ToothView';
import '../../components/PatientDetailsModal/styles.scss';

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

const historyToService = it => ({
  id: it.serviceId,
  historyId: it.id,
  name: it.serviceName,
  color: it.serviceColor,
  toothId: it.toothId,
  price: it.servicePrice || 0,
  destination: it.destination,
});

const serviceExists = (list, service, destination) => {
  return list.some(
    it =>
      it.id === service.id &&
      it.toothId === service.toothId &&
      it.destination === destination,
  );
};

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
    case reducerTypes.setSelectedServices:
      return { ...state, selectedServices: action.payload };
    case reducerTypes.setSchedule:
      return { ...state, schedule: action.payload };
    case reducerTypes.setShouldFillTreatmentPlan:
      return { ...state, shouldFillTreatmentPlan: action.payload };
    case reducerTypes.setTreatmentPlan: {
      const { mandible, maxillary } = action.payload;
      const completedServices = state.completedServices;
      let newServices = cloneDeep(state.selectedServices);
      const mandibleServices = [
        ...mandible.braces
          .filter(
            item =>
              !serviceExists(
                [...newServices, ...completedServices],
                item,
                'mandible',
              ),
          )
          .map(item => ({
            ...item,
            bracket: true,
            name: `${item.name} (${textForKey('Mandible')})`,
            destination: 'mandible',
          })),
        ...mandible.treatmentTypes
          .filter(
            item =>
              !serviceExists(
                [...newServices, ...completedServices],
                item,
                'mandible',
              ),
          )
          .map(item => ({
            ...item,
            bracket: true,
            name: `${item.name} (${textForKey('Mandible')})`,
            destination: 'mandible',
          })),
      ];
      const maxillaryServices = [
        ...maxillary.braces
          .filter(
            item =>
              !serviceExists(
                [...newServices, ...completedServices],
                item,
                'maxillary',
              ),
          )
          .map(item => ({
            ...item,
            bracket: true,
            name: `${item.name} (${textForKey('Maxillary')})`,
            destination: 'maxillary',
          })),
        ...maxillary.treatmentTypes
          .filter(
            item =>
              !serviceExists(
                [...newServices, ...completedServices],
                item,
                'maxillary',
              ),
          )
          .map(item => ({
            ...item,
            bracket: true,
            name: `${item.name} (${textForKey('Maxillary')})`,
            destination: 'maxillary',
          })),
      ];
      remove(newServices, item => item.bracket);
      newServices = [...newServices, ...mandibleServices, ...maxillaryServices];
      return {
        ...state,
        treatmentPlan: action.payload,
        selectedServices: newServices,
      };
    }
    case reducerTypes.setShowFinalizeTreatment:
      return { ...state, showFinalizeTreatment: action.payload };
    case reducerTypes.setIsFinalizing:
      return { ...state, isFinalizing: action.payload };
    case reducerTypes.setServices: {
      return {
        ...state,
        allServices: action.payload.filter(it => it.serviceType === 'all'),
        toothServices: action.payload.filter(it => it.serviceType !== 'all'),
      };
    }
    case reducerTypes.setScheduleDetails: {
      const { services, patient, schedule } = action.payload;
      return {
        ...state,
        patient,
        schedule,
        completedServices: services
          .filter(it => it.completed)
          .map(historyToService),
        selectedServices: services
          .filter(it => !it.completed)
          .map(historyToService),
      };
    }
    default:
      return state;
  }
};

const DoctorPatientDetails = () => {
  const dispatch = useDispatch();
  const { patientId, scheduleId } = useParams();
  const history = useHistory();
  const services = useSelector(clinicServicesSelector);
  const [
    {
      isLoading,
      patient,
      toothServices,
      allServices,
      selectedServices,
      schedule,
      treatmentPlan,
      showFinalizeTreatment,
      isFinalizing,
      completedServices,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const simpleServices = allServices.filter(
    item => !item.bracket && !item.bracesService,
  );

  useEffect(() => {
    fetchScheduleDetails();
  }, [patientId]);

  useEffect(() => {
    localDispatch(actions.setServices(services));
  }, [services]);

  const fetchOrthodonticPlan = async () => {
    const response = await dataAPI.fetchTreatmentPlan(patientId);
    if (response.isError) {
      console.error(response.message);
    } else if (response.data != null) {
      handleSaveTreatmentPlan(response.data);
    }
  };

  const fetchScheduleDetails = async () => {
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.fetchDoctorPatientDetails(
      patientId,
      scheduleId,
    );
    if (!response.isError) {
      const { data } = response;
      localDispatch(actions.setScheduleDetails(data));
      await fetchOrthodonticPlan();
    }
    localDispatch(actions.setIsLoading(false));
  };

  const handleServiceChecked = event => {
    const serviceId = event.target.id;
    const newServices = cloneDeep(selectedServices);
    const service = allServices.find(item => item.id === serviceId);
    if (newServices.some(item => item.id === serviceId)) {
      remove(
        newServices,
        item => item.id === serviceId && item.toothId == null,
      );
    } else {
      newServices.unshift(service);
    }
    localDispatch(actions.setSelectedServices(newServices));
  };

  const handleAddNote = () => {
    dispatch(setPatientNoteModal({ open: true, patientId, mode: 'notes' }));
  };

  const handleAddXRay = () => {
    dispatch(setPatientXRayModal({ open: true, patientId }));
  };

  const handleEditAppointmentNote = visit => {
    dispatch(
      setPatientNoteModal({
        open: true,
        patientId,
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
    localDispatch(actions.setSelectedServices(newServices));
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

  const handleSaveTreatmentPlan = plan => {
    localDispatch(actions.setTreatmentPlan(plan));
  };

  const handleFinalizeTreatment = () => {
    localDispatch(actions.setShowFinalizeTreatment(true));
  };

  const handleCloseFinalizeTreatment = () => {
    localDispatch(actions.setShowFinalizeTreatment(false));
  };

  const finalizeTreatment = async (services, selectedServices) => {
    handleCloseFinalizeTreatment();
    localDispatch(actions.setIsFinalizing(true));

    const requestBody = {
      scheduleId,
      services: services.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        toothId: item.toothId,
        destination: item.destination,
      })),
      selectedServices: selectedServices.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        toothId: item.toothId,
        destination: item.destination,
      })),
      treatmentPlan,
    };

    logUserAction(Action.FinalizeTreatment, JSON.stringify(requestBody));

    const response = await dataAPI.finalizeTreatment(patientId, requestBody);

    if (response.isError) {
      console.error(response.message);
      localDispatch(actions.setIsFinalizing(false));
    } else {
      history.goBack();
    }
  };

  const isFinished =
    schedule?.status === 'CompletedNotPaid' ||
    schedule?.status === 'CompletedPaid' ||
    schedule?.status === 'PartialPaid';

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
                  ? moment(schedule.dateAndTime).format('DD MMM YYYY HH:mm')
                  : ''}
              </span>
            </div>
            <div className='patient-info-row'>
              <span className='patient-info-title'>
                {textForKey('Doctor')}:
              </span>
              <span className='patient-info-value'>{schedule?.doctorName}</span>
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
                    service => service.toothId === item.toothId,
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
                    service => service.toothId === item.toothId,
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
                    service => service.toothId === item.toothId,
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
                    service => service.toothId === item.toothId,
                  )}
                  toothId={item.toothId}
                  direction='top'
                />
              ))}
          </div>
        </div>
        <div className='services-container'>
          <div className='available-services'>
            <span className='total-title'>{textForKey('Services')}</span>
            {simpleServices.map(service => (
              <Form.Group key={service.id} controlId={service.id}>
                <Form.Check
                  onChange={handleServiceChecked}
                  type='checkbox'
                  checked={selectedServices.some(
                    item => item.id === service.id,
                  )}
                  label={service.name}
                />
              </Form.Group>
            ))}
          </div>
          <div className='services-total'>
            <span className='total-title'>
              {textForKey('Provided services')}
            </span>

            {selectedServices.length === 0 && (
              <span className='no-data-label'>
                {textForKey('No selected services')}
              </span>
            )}

            {selectedServices
              .filter(it => !it.completed)
              .map(service => (
                <FinalServiceItem
                  key={`${service.id}-${service.toothId}-${service.name}-${service.destination}`}
                  service={service}
                />
              ))}

            {selectedServices.length > 0 && (
              <span className='total-price'>
                {textForKey('Total')}: {getTotalPrice()} MDL
              </span>
            )}

            <LoadingButton
              isLoading={isFinalizing}
              onClick={handleFinalizeTreatment}
              disabled={selectedServices.length === 0 || isFinished}
              className='positive-button'
            >
              {isFinished
                ? textForKey(schedule.status)
                : textForKey('Finalize')}
            </LoadingButton>
          </div>
        </div>
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
