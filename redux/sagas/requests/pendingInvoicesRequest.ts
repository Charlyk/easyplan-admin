import { AxiosResponse } from 'axios';
import { fetchPendingInvoices } from 'middleware/api/invoices';
import { ShortInvoice } from 'types';

export async function requestFetchPendingInvoices(): Promise<
  AxiosResponse<ShortInvoice[]>
> {
  return fetchPendingInvoices();
}
