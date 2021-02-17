import React, { useEffect, useReducer, useRef } from 'react';

import { Paper } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
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
import {
  clinicCurrencySelector,
  clinicServicesSelector,
} from '../../redux/selectors/clinicSelector';
import { userSelector } from '../../redux/selectors/rootSelector';
import { deleteScheduleSelector } from '../../redux/selectors/scheduleSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action, Statuses, teeth } from '../../utils/constants';
import {
  generateReducerActions,
  getServiceName,
  logUserAction,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import sessionManager from '../../utils/settings/sessionManager';
import FinalServiceItem from './components/FinalServiceItem';
import ToothView from './components/ToothView';
import '../../components/PatientDetailsModal/styles.scss';
import './styles.scss';

const areSameServices = (first, second) => {
  return (
    first.id === second.id &&
    ((first.toothId == null && second.toothId == null) ||
      first.toothId === second.toothId) &&
    ((first.destination == null && second.destination == null) ||
      first.destination === second.destination)
  );
};

const updateService = (invoice, clinicCurrency) => (service) => {
  const invoiceService = invoice?.services.find(
    (item) =>
      item.serviceId === service.id &&
      ((item.toothId == null && service.toothId == null) ||
        item.toothId === service.toothId) &&
      ((item.destination == null && service.destination == null) ||
        item.destination === service.destination),
  );
  return {
    ...service,
    canRemove: false,
    currency: invoiceService == null ? clinicCurrency : invoiceService.currency,
    count: invoiceService == null ? 1 : invoiceService.count,
    price: invoiceService == null ? service.price : invoiceService.amount,
  };
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
      const { services } = action.payload;
      return {
        ...state,
        selectedServices: services.map((item) => ({
          ...item,
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
      // get services applicable on all teeth
      const allTeethServices = action.payload.filter(
        (it) => it.serviceType === 'All',
      );
      // get services applicable on a single tooth
      const toothServices = action.payload.filter(
        (item) => item.serviceType === 'Single',
      );
      // get all braces services
      const allBracesServices = action.payload.filter(
        (it) => it.serviceType === 'Braces',
      );
      // map braces services to add mandible destination
      const mandibleBracesServices = allBracesServices.map((item) => ({
        ...item,
        destination: 'Mandible',
      }));
      // map maxillary services to add maxillary destination
      const maxillaryBracesServices = allBracesServices.map((item) => ({
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
        allServices: sortBy(allServices, (item) => item.name),
        toothServices: sortBy(toothServices, (item) => item.name),
        bracesServices: sortBy(toothServices, (item) => item.name),
      };
    }
    case reducerTypes.setScheduleDetails: {
      const { data, clinicCurrency } = action.payload;
      const { patient, treatmentPlan, invoice } = data;
      const existentSelectedServices = cloneDeep(state.selectedServices);

      // update treatmentPlanServices
      const planServices = treatmentPlan.services
        .map(updateService(invoice, clinicCurrency))
        .map((item) => ({ ...item, isExistent: true }));
      // update plan braces
      const planBraces = treatmentPlan.braces
        .map(updateService(invoice, clinicCurrency))
        .map((item) => ({ ...item, isExistent: true }));

      // combine services and braces in one array
      const newSelectedServices = [...planServices, ...planBraces];

      // remove unused services from selected
      const diffsToRemove = existentSelectedServices.filter(
        (item) => !newSelectedServices.some((it) => areSameServices(it, item)),
      );
      remove(existentSelectedServices, (item) =>
        diffsToRemove.some((it) => areSameServices(it, item)),
      );

      // add new services to selected
      const diffsToAdd = newSelectedServices.filter(
        (item) =>
          !existentSelectedServices.some((it) => areSameServices(it, item)),
      );
      diffsToAdd.forEach((item) => existentSelectedServices.push(item));

      const sortedSelectedServices = orderBy(
        existentSelectedServices,
        ['completed', 'created'],
        ['asc', 'desc'],
      );

      return {
        ...state,
        patient,
        schedule: data,
        selectedServices: sortedSelectedServices,
        completedServices: [
          ...treatmentPlan.services.filter((item) => item.completed),
          ...treatmentPlan.braces.filter((item) => item.completed),
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
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
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
  const scheduleStatus = Statuses.find(
    (item) => item.id === schedule?.scheduleStatus,
  );

  const isFinished =
    schedule?.scheduleStatus === 'CompletedNotPaid' ||
    schedule?.scheduleStatus === 'CompletedPaid' ||
    schedule?.scheduleStatus === 'PartialPaid';

  const canFinalize =
    schedule?.scheduleStatus === 'OnSite' ||
    schedule?.scheduleStatus === 'CompletedNotPaid';

  useEffect(() => {
    if (scheduleId != null && clinicCurrency != null) {
      fetchScheduleDetails();
    }
  }, [scheduleId, clinicCurrency]);

  useEffect(() => {
    if (deleteSchedule?.id !== parseFloat(scheduleId)) {
      return;
    }
    toast.warn(textForKey('Schedule was deleted'));
    history.goBack();
  }, [deleteSchedule]);

  useEffect(() => {
    // get services provided by current user
    const userServicesIds = (
      currentUser.clinics.find(
        (item) => item.clinicId === sessionManager.getSelectedClinicId(),
      )?.services || []
    ).map((it) => it.serviceId);
    // filter clinic services to get only provided by current user services
    localDispatch(
      actions.setServices(
        clinicServices.filter((item) => userServicesIds.includes(item.id)),
      ),
    );
  }, [clinicServices]);

  /**
   * Fetch current schedule details from server
   */
  const fetchScheduleDetails = async () => {
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.fetchDoctorPatientDetails(scheduleId);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const { data } = response;
      localDispatch(actions.setScheduleDetails({ data, clinicCurrency }));
    }
    localDispatch(actions.setIsLoading(false));
  };

  /**
   * Handle start adding a note for patient
   */
  const handleAddNote = () => {
    dispatch(
      setPatientNoteModal({ open: true, patientId: patient.id, mode: 'notes' }),
    );
  };

  /**
   * Handle start adding x-ray image
   */
  const handleAddXRay = () => {
    dispatch(setPatientXRayModal({ open: true, patientId: patient.id }));
  };

  /**
   * Handle appointment note change started
   * @param {Object} visit
   */
  const handleEditAppointmentNote = (visit) => {
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

  /**
   * Handle tooth services list changed
   * @param {string} toothId
   * @param {Array.<Object>} services
   */
  const handleToothServicesChange = ({ toothId, services }) => {
    let newServices = cloneDeep(selectedServices);
    remove(newServices, (item) => item.toothId === toothId && !item.completed);
    for (let service of services) {
      newServices.unshift({
        ...service,
        toothId,
        canRemove: true,
        count: 1,
        isExistent: false,
      });
    }
    localDispatch(actions.setSelectedServices({ services: newServices }));
  };

  /**
   * Handle remove service from services list
   * @param {Object} service
   */
  const handleRemoveSelectedService = (service) => {
    let newServices = cloneDeep(selectedServices);
    remove(
      newServices,
      (item) =>
        item.id === service.id &&
        item.toothId === service.toothId &&
        item.destination === service.destination,
    );
    localDispatch(actions.setSelectedServices({ services: newServices }));
  };

  /**
   * Get patient full name
   * @return {string}
   */
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

  /**
   * Get treatment total price
   * @return {*}
   */
  const getTotalPrice = () => {
    const prices = selectedServices.map((item) => item.price);
    return sum(prices);
  };

  /**
   * Get final services list (services that are not complete or are completed but are related to this schedule
   * @return {Array.<Object>}
   */
  const finalServicesList = () => {
    return selectedServices.filter((service) => {
      const isCompletedInAnotherSchedule =
        service.completed && service.scheduleId !== parseInt(scheduleId);
      return !isCompletedInAnotherSchedule;
    });
  };

  /**
   * Check if submit button is disabled
   * @return {boolean}
   */
  const isButtonDisabled = () => {
    const newServices = selectedServices.filter((item) => !item.isExistent);
    return (
      (!canFinalize && newServices.length === 0) ||
      finalServicesList().length === 0
    );
  };

  /**
   * Handle orthodontic plan saved
   */
  const handleSaveTreatmentPlan = () => {
    fetchScheduleDetails();
  };

  /**
   * Handle new service selected from search box
   * @param {Array.<Object>} selectedItems
   */
  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems.length === 0) return;
    const newServices = cloneDeep(selectedServices);
    const serviceExists = newServices.some(
      (item) =>
        item.id === selectedItems[0].id &&
        (item.toothId == null || item.toothId === selectedItems[0].toothId) &&
        (item.destination == null ||
          item.destination === selectedItems[0].destination) &&
        (!item.completed || item.scheduleId === parseInt(scheduleId)),
    );
    if (!serviceExists) {
      newServices.unshift({
        ...selectedItems[0],
        canRemove: true,
        count: 1,
        isExistent: false,
      });
      localDispatch(actions.setSelectedServices({ services: newServices }));
    }
  };

  /**
   * Initiate treatment finalization
   */
  const handleFinalizeTreatment = () => {
    if (isButtonDisabled()) {
      // can't finalize or save this plan
      return;
    }
    if (canFinalize) {
      localDispatch(actions.setShowFinalizeTreatment(true));
    } else {
      finalizeTreatment(selectedServices);
    }
  };

  /**
   * Close finalize treatment modal
   */
  const handleCloseFinalizeTreatment = () => {
    localDispatch(actions.setShowFinalizeTreatment(false));
  };

  /**
   * Get submit button text
   * @return {string}
   */
  const buttonText = () => {
    const newServices = selectedServices.filter((item) => !item.isExistent);
    let text = textForKey('Finalize');
    if ((!canFinalize && newServices.length > 0) || isFinished) {
      text = textForKey('Edit');
    }
    if (!canFinalize && newServices.length === 0 && isFinished) {
      text = scheduleStatus?.name;
    }
    return text;
  };

  /**
   * Save patient treatment plan services
   * @param {Array.<Object>} plannedServices
   * @return {Promise<void>}
   */
  const finalizeTreatment = async (plannedServices) => {
    if (isButtonDisabled()) {
      // user can't finalize this treatment plan
      return;
    }
    handleCloseFinalizeTreatment();
    localDispatch(actions.setIsFinalizing(true));

    let services = plannedServices;
    if (!canFinalize) {
      services = plannedServices.filter((item) => !item.isExistent);
    }

    const requestBody = {
      scheduleId,
      patientId: patient.id,
      services: services.map((item) => ({
        id: item.planServiceId,
        serviceId: item.id,
        toothId: item.toothId,
        completed: item.isSelected,
        destination: item.destination,
        isBraces: item.isBraces,
        count: item.count || 1,
        price: item.price,
        currency: item.currency || clinicCurrency,
      })),
    };

    logUserAction(Action.FinalizeTreatment, JSON.stringify(requestBody));

    const response = canFinalize
      ? await dataAPI.savePatientTreatmentPlan(requestBody)
      : await dataAPI.updatePatientTreatmentPlan(requestBody);

    if (response.isError) {
      toast.error(textForKey(response.message));
      console.error(response);
      localDispatch(actions.setIsFinalizing(false));
    } else {
      if (!canFinalize) {
        toast.success(textForKey('Saved successfully'));
      }
      history.goBack();
    }
  };

  /**
   * Get unique html key for a service item
   * @param {Object} service
   * @return {string}
   */
  const keyForService = (service) => {
    return `${service.id}-${service.toothId}-${service.name}-${service.destination}-${service.completed}-${service.completedAt}`;
  };

  return (
    <div className='doctor-patient-root'>
      <FinalizeTreatmentModal
        onSave={finalizeTreatment}
        totalPrice={getTotalPrice()}
        services={finalServicesList()}
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
              .filter((it) => it.type === 'top-left')
              .map((item) => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  selectedServices={selectedServices}
                  completedServices={completedServices.filter(
                    (service) => service.toothId != null,
                  )}
                  toothId={item.toothId}
                />
              ))}
          </div>
          <div className='top-right'>
            {teeth
              .filter((it) => it.type === 'top-right')
              .map((item) => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  selectedServices={selectedServices}
                  completedServices={completedServices.filter(
                    (service) => service.toothId != null,
                  )}
                  toothId={item.toothId}
                />
              ))}
          </div>
          <div className='bottom-left'>
            {teeth
              .filter((it) => it.type === 'bottom-left')
              .map((item) => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  selectedServices={selectedServices}
                  completedServices={completedServices.filter(
                    (service) => service.toothId != null,
                  )}
                  toothId={item.toothId}
                  direction='top'
                />
              ))}
          </div>
          <div className='bottom-right'>
            {teeth
              .filter((it) => it.type === 'bottom-right')
              .map((item) => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  selectedServices={selectedServices}
                  completedServices={completedServices.filter(
                    (service) => service.toothId != null,
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
                          {getServiceName(result)}
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
                {selectedServices.map((service, index) => (
                  <FinalServiceItem
                    canRemove={service.canRemove}
                    onRemove={handleRemoveSelectedService}
                    key={`${keyForService(service)}#${index}`}
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
              disabled={isButtonDisabled()}
              className='positive-button'
            >
              {buttonText()}
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
              TabId.appointments,
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
