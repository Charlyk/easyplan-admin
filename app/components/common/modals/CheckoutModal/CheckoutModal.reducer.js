import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';
import generateReducerActions from 'app/utils/generateReducerActions';
import roundToTwo from 'app/utils/roundToTwo';

export const computeServicePrice = (services, exchangeRates) => {
  return services.map((service) => {
    const serviceExchange = exchangeRates.find(
      (rate) => rate.currency === service.currency,
    ) || { value: 1 };
    const teethCount = service.teeth?.length > 0 ? service.teeth?.length : 1;
    const servicePrice =
      serviceExchange.value * (service.amount * service.count * teethCount);
    return {
      ...service,
      teeth: service.teeth?.map((item) => item.replace('_', '')),
      created: moment(service.created).toDate(),
      totalPrice: roundToTwo(servicePrice),
      childServices: service.childServices.map((item) => {
        const serviceExchange = exchangeRates.find(
          (rate) => rate.currency === item.currency,
        ) || { value: 1 };
        return {
          ...item,
          totalPrice:
            serviceExchange.value * (item.amount * item.count * teethCount),
        };
      }),
    };
  });
};

export const getDiscount = (total, discount) => {
  const discountAmount = total * (discount / 100);
  let discountedTotal = total - discountAmount;
  // check if discounted total is not less than 0 or not greater then total amount
  if (discountedTotal > total) discountedTotal = total;
  if (discountedTotal < 0) discountedTotal = 0;
  return roundToTwo(discountedTotal);
};

export const initialState = {
  isLoading: false,
  isFetching: false,
  isDebt: false,
  payAmount: '0',
  discount: '0',
  services: [],
  showConfirmationMenu: false,
  isSearchingPatient: false,
  teethModal: {
    open: false,
    service: null,
  },
  invoiceStatus: 'PendingPayment',
  searchResults: [],
  invoiceDetails: {
    status: 'PendingPayment',
    services: [],
    totalAmount: 0,
    discount: 0,
    paidAmount: 0,
    schedule: null,
    doctor: {
      id: -1,
      name: '',
    },
    patient: {
      id: -1,
      name: '',
    },
  },
  totalAmount: 0,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setPayAmount: 'setPayAmount',
  setDiscount: 'setDiscount',
  setupInvoiceData: 'setupInvoiceData',
  resetState: 'resetState',
  setServices: 'setServices',
  setShowConfirmationMenu: 'setShowConfirmationMenu',
  setInvoiceStatus: 'setInvoiceStatus',
  setIsFetching: 'setIsFetching',
  setDoctor: 'setDoctor',
  setPatient: 'setPatient',
  setIsSearchingPatient: 'setIsSearchingPatient',
  setSearchResults: 'setSearchResults',
  setScheduleDetails: 'setScheduleDetails',
  setTeethModal: 'setTeethModal',
};

export const actions = generateReducerActions(reducerTypes);

/**
 * Payment modal reducer
 * @param {Object} state
 * @param {{ type: string, payload: any}} action
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setPayAmount:
      return { ...state, payAmount: action.payload };
    case reducerTypes.setDiscount: {
      // compute new total amount
      const newDiscount = action.payload;
      const servicesTotal = sumBy(state.services, (item) => item.totalPrice);
      let discountedTotal = getDiscount(servicesTotal, newDiscount);
      // check if current entered pay amount is not greater than discounted total
      let currentPayAmount = state.payAmount;
      if (currentPayAmount > discountedTotal) {
        currentPayAmount = discountedTotal;
      }
      return {
        ...state,
        discount: newDiscount,
        totalAmount: roundToTwo(discountedTotal),
        payAmount: roundToTwo(currentPayAmount),
      };
    }
    case reducerTypes.setServices: {
      // get data from state and payload
      const { services, exchangeRates } = action.payload;
      const { invoiceDetails, payAmount, discount } = state;
      // get invoice status
      const isDebt = invoiceDetails.status === 'PartialPaid';
      // compute services total price
      const updatedServices = computeServicePrice(services, exchangeRates);
      const servicesPrice = parseFloat(
        sumBy(
          updatedServices,
          (item) =>
            item.totalPrice +
            sumBy(item.childServices, (child) => child.totalPrice),
        ),
      ).toFixed(2);
      // compute new total amount
      const newTotalAmount = isDebt
        ? invoiceDetails.totalAmount - invoiceDetails.paidAmount
        : roundToTwo(servicesPrice);
      // apply the discount to new total amount
      const discountedTotal = getDiscount(newTotalAmount, discount);
      return {
        ...state,
        services: updatedServices,
        payAmount: payAmount < discountedTotal ? payAmount : discountedTotal,
        totalAmount: discountedTotal,
      };
    }
    case reducerTypes.setShowConfirmationMenu:
      return { ...state, showConfirmationMenu: action.payload };
    case reducerTypes.setInvoiceStatus:
      return { ...state, invoiceStatus: action.payload };
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setupInvoiceData: {
      const { invoiceDetails, exchangeRates } = action.payload;
      const isDebt = invoiceDetails.status === 'PartialPaid';
      const updatedServices = computeServicePrice(
        invoiceDetails.services,
        exchangeRates,
      );
      const servicesPrice = parseFloat(
        sumBy(
          updatedServices,
          (item) =>
            item.totalPrice +
            sumBy(item.childServices, (child) => child.totalPrice),
        ),
      ).toFixed(2);

      const invoiceTotal = isDebt
        ? invoiceDetails.totalAmount
        : roundToTwo(servicesPrice);
      const invoiceDiscount = isDebt
        ? invoiceDetails.discount
        : invoiceDetails.patient.discount;
      const discountedAmount = getDiscount(invoiceTotal, invoiceDiscount);
      return {
        ...state,
        invoiceDetails: {
          ...invoiceDetails,
          services: updatedServices,
        },
        payAmount: discountedAmount - invoiceDetails.paidAmount,
        totalAmount: discountedAmount - invoiceDetails.paidAmount,
        discount: invoiceDiscount,
        services: updatedServices,
        invoiceStatus: invoiceDetails.status,
        isDebt,
      };
    }
    case reducerTypes.resetState:
      return initialState;
    case reducerTypes.setDoctor: {
      const doctor = action.payload;
      return {
        ...state,
        invoiceDetails: {
          ...state.invoiceDetails,
          doctor: doctor == null ? initialState.invoiceDetails.doctor : doctor,
        },
      };
    }
    case reducerTypes.setPatient: {
      const patient = action.payload;
      return {
        ...state,
        invoiceDetails: {
          ...state.invoiceDetails,
          patient:
            patient == null ? initialState.invoiceDetails.patient : patient,
          discount: patient?.discount || 0,
        },
      };
    }
    case reducerTypes.setIsSearchingPatient:
      return { ...state, isSearchingPatient: action.payload };
    case reducerTypes.setSearchResults:
      return {
        ...state,
        searchResults: action.payload,
      };
    case reducerTypes.setScheduleDetails: {
      const { doctor, patient } = action.payload;
      return {
        ...state,
        invoiceDetails: {
          ...state.invoiceDetails,
          doctor,
          schedule: action.payload,
          patient: {
            ...patient,
            name: patient.fullName,
          },
        },
      };
    }
    case reducerTypes.setTeethModal:
      return { ...state, teethModal: action.payload };
    default:
      return state;
  }
};
