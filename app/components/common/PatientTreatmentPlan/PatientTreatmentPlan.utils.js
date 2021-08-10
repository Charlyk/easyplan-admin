import cloneDeep from "lodash/cloneDeep";
import remove from "lodash/remove";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";

export const areSameServices = (first, second) => {
  return (
    first.id === second.id &&
    ((first.toothId == null && second.toothId == null) ||
      first.toothId === second.toothId) &&
    ((first.destination == null && second.destination == null) ||
      first.destination === second.destination)
  );
};

export const updateService = (invoice, clinicCurrency) => (service) => {
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

export const getScheduleDetails = (data, clinicCurrency, state) => {
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

export const getServicesData = (clinicServices) => {
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
    ...toothServices,
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
