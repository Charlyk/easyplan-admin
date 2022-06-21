import { AxiosResponse } from 'axios';
import moment from 'moment-timezone';
import {
  PaymentReportResponse,
  ConsultationsResponse,
} from 'types/api/response';
import { get } from './request';

export const fetchPaymentReports = async (
  page: number,
  itemsPerPage: number,
  startDate: Date,
  endDate: Date,
  headers = null,
): Promise<AxiosResponse<PaymentReportResponse>> => {
  const startDateString = moment(startDate).format('YYYY-MM-DD');
  const endDateString = moment(endDate).format('YYYY-MM-DD');
  const query = new URLSearchParams({
    page: `${page}`,
    itemsPerPage: `${itemsPerPage}`,
    startDate: startDateString,
    endDate: endDateString,
  }).toString();
  return get(`/api/reports/payments?${query}`, headers);
};

export const fetchPendingConsultationsReport = async (
  page: number,
  itemsPerPage: number,
  startDate: Date,
  endDate: Date,
  headers = null,
): Promise<AxiosResponse<ConsultationsResponse>> => {
  const startDateString = moment(startDate).format('YYYY-MM-DD');
  const endDateString = moment(endDate).format('YYYY-MM-DD');
  const query = new URLSearchParams({
    page: `${page}`,
    itemsPerPage: `${itemsPerPage}`,
    startDate: startDateString,
    endDate: endDateString,
  }).toString();
  return get(`/api/reports/consultations?${query}`, headers);
};

export const fetchAppointmentsReport = async (
  page: number,
  itemsPerPage: number,
  startDate: Date,
  endDate: Date,
  headers = null,
): Promise<AxiosResponse<ConsultationsResponse>> => {
  const startDateString = moment(startDate).format('YYYY-MM-DD');
  const endDateString = moment(endDate).format('YYYY-MM-DD');
  const query = new URLSearchParams({
    page: `${page}`,
    itemsPerPage: `${itemsPerPage}`,
    startDate: startDateString,
    endDate: endDateString,
  }).toString();

  return get(`/api/reports/appointments?${query}`, headers);
};
