import React, { useEffect, useReducer } from "react";

import PropTypes from 'prop-types';
import TeethContainer from "../TeethContainer";
import ServicesWrapper from "../ServicesWrapper";
import { toast } from "react-toastify";
import { fetchDoctorScheduleDetails } from "../../../middleware/api/schedules";
import styles from '../../../styles/PatientTreatmentPlan.module.scss';
import { generateReducerActions } from "../../../utils/helperFuncs";
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";
import { textForKey } from "../../../utils/localization";
import { Statuses } from "../../../utils/constants";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";

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

const getScheduleDetails = (data, clinicCurrency, state) => {
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
    patient,
    schedule: data,
    selectedServices: sortedSelectedServices,
    completedServices: [
      ...treatmentPlan.services.filter((item) => item.completed),
      ...treatmentPlan.braces.filter((item) => item.completed),
    ],
  };
};

const getServicesData = (clinicServices) => {
  // get services applicable on all teeth
  const allTeethServices = clinicServices.filter(
    (it) => it.serviceType === 'All',
  );
  // get services applicable on a single tooth
  const toothServices = clinicServices.filter(
    (item) => item.serviceType === 'Single',
  );
  // get all braces services
  const allBracesServices = clinicServices.filter(
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
    allServices: sortBy(allServices, (item) => item.name),
    toothServices: sortBy(toothServices, (item) => item.name),
    bracesServices: sortBy(toothServices, (item) => item.name),
  };
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
  setInitialData: 'setInitialData',
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
      return {
        ...state,
        ...getServicesData(action.payload),
      };
    }
    case reducerTypes.setScheduleDetails: {
      const { data, clinicCurrency } = action.payload;
      return {
        ...state,
        ...getScheduleDetails(data, clinicCurrency, state),
      }
    }
    case reducerTypes.setInitialData: {
      const { schedule, currency, services } = action.payload;
      return {
        ...state,
        ...getScheduleDetails(schedule, currency, state),
        ...getServicesData(services),
      };
    }
    default:
      return state;
  }
};

const PatientTreatmentPlan = (
  {
    scheduleData,
    currentUser,
    currentClinic,
    servicesClasses,
    readOnly,
    onFinalize
  }
) => {
  const [
    {
      toothServices,
      allServices,
      selectedServices,
      isFinalizing,
      completedServices,
      schedule,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const clinicServices = currentClinic.services?.filter((item) => !item.deleted) || [];
  const clinicCurrency = currentClinic.currency;
  const isFinished =
    schedule?.scheduleStatus === 'CompletedNotPaid' ||
    schedule?.scheduleStatus === 'CompletedPaid' ||
    schedule?.scheduleStatus === 'PartialPaid';

  const canFinalize =
    schedule?.scheduleStatus === 'OnSite' ||
    schedule?.scheduleStatus === 'CompletedNotPaid';

  const scheduleStatus = Statuses.find(
    (item) => item.id === schedule?.scheduleStatus,
  );

  useEffect(() => {
    if (scheduleData == null) return;
    setupInitialSchedule(scheduleData);
  }, [scheduleData]);

  const setupInitialSchedule = (initialSchedule) => {
    const userServicesIds = (
      currentUser.clinics.find(
        (item) => item.clinicId === currentClinic.id,
      )?.services || []
    ).map((it) => it.serviceId);
    // filter clinic services to get only provided by current user services
    localDispatch(
      actions.setInitialData({
        schedule: initialSchedule,
        currency: clinicCurrency,
        services: clinicServices.filter((item) => userServicesIds.includes(item.id))
      })
    );
  }

  /**
   * Handle tooth services list changed
   * @param {string} toothId
   * @param {Array.<Object>} services
   */
  const handleToothServicesChange = ({ toothId, services }) => {
    const newServices = selectedServices.filter((item) => item.toothId !== toothId || item.completed)
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
        (!item.completed || item.scheduleId === schedule.id),
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
   * Get final services list (services that are not complete or are completed but are related to this schedule
   * @return {Array.<Object>}
   */
  const finalServicesList = () => {
    return selectedServices.filter((service) => {
      const isCompletedInAnotherSchedule =
        service.completed && service.scheduleId !== schedule.id;
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
   * Initiate treatment finalization
   */
  const handleFinalizeTreatment = () => {
    if (isButtonDisabled()) {
      // can't finalize or save this plan
      return;
    }

    onFinalize?.(finalServicesList(), selectedServices);
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

  return (
    <div className={styles.patientTreatmentPlan}>
      <TeethContainer
        readOnly={readOnly}
        toothServices={toothServices}
        selectedServices={selectedServices}
        completedServices={completedServices}
        onServicesChange={handleToothServicesChange}
      />
      <ServicesWrapper
        paperClasses={servicesClasses}
        readOnly={readOnly}
        allServices={allServices}
        selectedServices={selectedServices}
        isLoading={isFinalizing}
        isButtonDisabled={isButtonDisabled()}
        buttonText={buttonText()}
        onItemSelected={handleSelectedItemsChange}
        onItemRemove={handleRemoveSelectedService}
        onFinalize={handleFinalizeTreatment}
      />
    </div>
  )
}

export default PatientTreatmentPlan;

PatientTreatmentPlan.propTypes = {
  currentUser: PropTypes.object.isRequired,
  currentClinic: PropTypes.object.isRequired,
  servicesClasses: PropTypes.any,
  onFinalize: PropTypes.func,
  readOnly: PropTypes.bool
}

PatientTreatmentPlan.defaultProps = {
  readOnly: false,
}
