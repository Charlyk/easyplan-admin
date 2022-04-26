import axios, { AxiosResponse } from 'axios';
import { PaymentSubscription, PaymentInvoices, PaymentMethod } from 'types/api';

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
