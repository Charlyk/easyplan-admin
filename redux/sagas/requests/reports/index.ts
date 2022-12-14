import { AxiosResponse } from 'axios';
import {
  fetchAppointmentsReport,
  fetchPaymentReports,
  fetchPendingConsultationsReport,
} from 'middleware/api/reports';
import {
  PaymentReportResponse,
  PendingConsultationsGetRequest,
  ConsultationsResponse,
  AppointmentReportResponse,
} from 'types/api';
import { PaymentReportsGetRequest } from 'types/api/request';
import { AppointmentReportsPayload } from 'types/api/request/appointmentsRequest.types';

export async function requestFetchPaymentReports(
  data: PaymentReportsGetRequest,
): Promise<AxiosResponse<PaymentReportResponse>> {
  return fetchPaymentReports(
    data.page,
    data.itemsPerPage,
    data.startDate,
    data.endDate,
  );
}

export async function requestFetchPendingConsultations(
  data: PendingConsultationsGetRequest,
): Promise<AxiosResponse<ConsultationsResponse>> {
  return fetchPendingConsultationsReport(
    data.page,
    data.itemsPerPage,
    data.startDate,
    data.endDate,
  );
}

export async function requestAppointmentReports(
  data: AppointmentReportsPayload,
): Promise<AxiosResponse<AppointmentReportResponse>> {
  const { startDate, endDate } = data;

  return fetchAppointmentsReport(startDate, endDate);
}
