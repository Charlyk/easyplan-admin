import { get } from "./request";

/**
 * Fetch clinic invoices by status
 * @param {string} status
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchClinicInvoices(status, headers = null) {
  return get(`/api/invoices?status=${status}`, headers);
}

/**
 * Fetch pending invoices for clinic
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchPendingInvoices(headers = null) {
  return fetchClinicInvoices('PendingPayment', headers);
}
