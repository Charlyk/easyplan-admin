import React, { useEffect, useReducer } from "react";

import PropTypes from 'prop-types';
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";

import TeethContainer from "./TeethContainer";
import { textForKey } from "../../../../utils/localization";
import { Statuses } from "../../../utils/constants";
import ServicesWrapper from "./ServicesWrapper";
import { reducer, actions, initialState } from "./PatientTreatmentPlan.reducer";
import styles from './PatientTreatmentPlan.module.scss';

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
