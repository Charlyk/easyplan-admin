import axios, { AxiosResponse } from 'axios';
import {
  PaymentSubscription,
  PaymentInvoices,
  PaymentMethod,
  PaymentCardData,
} from 'types/api';

export async function requestSubscriptionInfo(): Promise<
  AxiosResponse<PaymentSubscription>
> {
  return axios.get('/api/payments/subscription');
}

export async function requestInvoices(): Promise<
  AxiosResponse<PaymentInvoices[]>
> {
  return axios.get('/api/payments/invoices');
}

export async function requestPaymentMethods(): Promise<
  AxiosResponse<PaymentMethod[]>
> {
  return axios.get('/api/payments/methods');
}

export async function postNewPaymentMethod(
  data: PaymentCardData,
): Promise<AxiosResponse<PaymentMethod[]>> {
  return axios.post('/api/payments/methods', data);
}

export async function deletePaymentMethod(
  data: string | number,
): Promise<AxiosResponse<PaymentMethod[]>> {
  return axios.delete(`/api/payments/methods?id=${data}`);
}

export async function setPaymentMethodAsDefault(data: {
  id: string;
}): Promise<AxiosResponse<PaymentMethod[]>> {
  return axios.put('/api/payments/methods', data);
}

export async function requestPurchaseSeats(data: {
  seats: number;
  interval: 'MONTH' | 'YEAR';
}): Promise<AxiosResponse<PaymentSubscription>> {
  return axios.post('/api/payments/seats', data);
}

export async function requestRemoveSeats(data: {
  seats: number;
}): Promise<AxiosResponse<PaymentSubscription>> {
  return axios.put('/api/payments/seats', data);
}

export async function requestBillingPeriodChange(data: {
  period: 'MONTH' | 'YEAR';
}): Promise<AxiosResponse<PaymentSubscription>> {
  return axios.put('/api/payments/billing', data);
}

export async function requestCancelSubscription() {
  return axios.delete('/api/payments/subscription');
}
