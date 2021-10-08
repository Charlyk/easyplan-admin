import React, { useEffect, useMemo, useReducer } from "react";
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";

import { textForKey } from "../../../utils/localization";
import { Statuses } from "../../../utils/constants";
import { deletePatientPlanService } from "../../../../middleware/api/patients";
import reducer, {
  initialState,
  setInitialData,
  setSelectedServices,
  setTeethModal,
} from "./PatientTreatmentPlan.reducer";
import styles from './PatientTreatmentPlan.module.scss';

const TeethContainer = dynamic(() => import('./TeethContainer'));
const TeethModal = dynamic(() => import("../modals/TeethModal"));
const ServicesWrapper = dynamic(() => import("./ServicesWrapper"));

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
      teethModal,
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

  /**
   * Get final services list (services that are not complete or are completed but are related to this schedule
   * @return {Array.<Object>}
   */
  const finalServicesList = useMemo(() => {
    return selectedServices.filter((service) => {
      return !service.completed || service.scheduleId === schedule.id;
    })
  }, [selectedServices, schedule]);

  /**
   * Check if submit button is disabled
   * @return {boolean}
   */
  const isButtonDisabled = useMemo(() => {
    const newServices = selectedServices.filter((item) => !item.isExistent);
    return (
      (!canFinalize && newServices.length === 0) ||
      finalServicesList.length === 0
    );
  }, [selectedServices, finalServicesList]);

  const doesServiceExists = (service) => {
    return selectedServices.some(
      (item) =>
        item.id === service.id &&
        !item.completed &&
        (item.toothId == null || item.toothId === service.toothId) &&
        (item.destination == null ||
          item.destination === service.destination)
    );
  }

  const mappedService = (service, toothId = null) => {
    return {
      ...service,
      toothId: toothId ?? service.toothId ?? null,
      scheduleId: schedule.id,
      canRemove: true,
      count: 1,
      isExistent: false,
    }
  }

  const setupInitialSchedule = (initialSchedule) => {
    const userServicesIds = (
      currentUser.clinics.find(
        (item) => item.clinicId === currentClinic.id,
      )?.services || []
    ).map((it) => it.serviceId);
    // filter clinic services to get only provided by current user services
    localDispatch(
      setInitialData({
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
      newServices.unshift(mappedService(service, toothId));
    }
    localDispatch(setSelectedServices({ services: newServices }));
  };

  /**
   * Handle new service selected from search box
   */
  const handleSelectedItemsChange = (event, newService) => {
    if (newService.serviceType === 'Single' && newService.toothId == null) {
      localDispatch(setTeethModal({ open: true, service: newService }));
      return;
    }

    const newServices = cloneDeep(selectedServices);
    const serviceExists = doesServiceExists(newService)
    if (!serviceExists) {
      newServices.unshift(mappedService(newService));
      localDispatch(setSelectedServices({ services: newServices }));
    }
  };

  /**
   * Called when user click on save in teeth modal
   * @param {any} service
   * @param {string[]} teeth
   */
  const handleSaveTeethService = (service, teeth) => {
    const updatedServices = []
    for (const toothId of teeth) {
      updatedServices.push({
        ...service,
        toothId,
      });
    }

    const newServices = cloneDeep(selectedServices);
    for (const newService of updatedServices) {
      if (doesServiceExists(newService)) {
        continue;
      }
      newServices.unshift(mappedService(newService))
    }
    localDispatch(setSelectedServices({ services: newServices }));
  }

  const handleCloseTeethModal = () => {
    localDispatch(setTeethModal({ open: false }));
  };

  /**
   * Initiate treatment finalization
   */
  const handleFinalizeTreatment = () => {
    if (isButtonDisabled) {
      // can't finalize or save this plan
      return;
    }

    onFinalize?.(finalServicesList, selectedServices);
  };

  /**
   * Handle remove service from services list
   * @param {Object} service
   */
  const handleRemoveSelectedService = async (service) => {
    let newServices = cloneDeep(selectedServices);
    remove(
      newServices,
      (item) =>
        item.id === service.id &&
        item.toothId === service.toothId &&
        item.destination === service.destination,
    );
    if (service.isExistent && service.planServiceId != null) {
      // delete service from server
      await deletePatientPlanService(scheduleData.patient.id, service.planServiceId);
    }
    localDispatch(setSelectedServices({ services: newServices }));
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
      <TeethModal
        open={teethModal.open}
        service={teethModal.service}
        onSave={handleSaveTeethService}
        onClose={handleCloseTeethModal}
      />
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
        isButtonDisabled={isButtonDisabled}
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
