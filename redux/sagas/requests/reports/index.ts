import { AxiosResponse } from 'axios';
import {
  fetchPaymentReports,
  fetchPendingConsultationsReport,
} from 'middleware/api/reports';
import {
  PaymentReportResponse,
  PendingConsultationsGetRequest,
  PendingConsultationsResponse,
} from 'types/api';
import { PaymentReportsGetRequest } from 'types/api/request';

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
): Promise<AxiosResponse<PendingConsultationsResponse>> {
  return fetchPendingConsultationsReport(
    data.page,
    data.itemsPerPage,
    data.startDate,
    data.endDate,
  );
}
