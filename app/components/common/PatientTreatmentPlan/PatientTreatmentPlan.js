import React, { useEffect, useMemo, useReducer } from "react";

import PropTypes from 'prop-types';
import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";

import TeethContainer from "./TeethContainer";
import { textForKey } from "../../../../utils/localization";
import { Statuses } from "../../../utils/constants";
import ServicesWrapper from "./ServicesWrapper";
import { actions, initialState, reducer } from "./PatientTreatmentPlan.reducer";
import styles from './PatientTreatmentPlan.module.scss';
import { deletePatientPlanService } from "../../../../middleware/api/patients";

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

  const setupInitialSchedule = (initialSchedule) => {
    console.log(initialSchedule)
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
    const newService = selectedItems[0];
    const newServices = cloneDeep(selectedServices);
    const serviceExists = newServices.some(
      (item) =>
        item.id === newService.id &&
        !item.completed &&
        (item.toothId == null || item.toothId === newService.toothId) &&
        (item.destination == null ||
          item.destination === newService.destination)
    );
    if (!serviceExists) {
      console.log(newService)
      newServices.unshift({
        ...newService,
        scheduleId: schedule.id,
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
    console.log(service)
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
