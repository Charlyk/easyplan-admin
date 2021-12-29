import { AxiosResponse } from 'axios';
import { requestUndoPayment } from 'middleware/api/invoices';
import { ShortInvoice } from 'types';

export async function requestUndoInvoicePayments(
  invoiceId: number,
): Promise<AxiosResponse<ShortInvoice>> {
  return requestUndoPayment(invoiceId);
}
