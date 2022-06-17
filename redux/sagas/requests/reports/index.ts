import { AxiosResponse } from 'axios';
import { fetchPaymentReports } from 'middleware/api/reports';
import { PaymentReportResponse } from 'types/api';
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
