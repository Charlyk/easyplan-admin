import { InvoiceStatus } from 'types';
import { get, post, put } from './request';

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
  return fetchClinicInvoices(InvoiceStatus.PendingPayment, headers);
}

/**
 * Create new invoice and register a payment for it
 * @param {{
 *     doctorId: number?,
 *     patientId: number?,
 *     paidAmount: number,
 *     discount: number,
 *     totalAmount: string,
 *     scheduleId: string?,
 *     services: [{
 *       id: number,
 *       serviceId: number,
 *       count: number,
 *       price: number,
 *       currency: string,
 *     }]
 *   }} requestBody
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function createNewInvoice(requestBody, headers = null) {
  return post('/api/invoices', headers, requestBody);
}

/**
 * Register payment for an invoice
 * @param {number} invoiceId
 * @param {{
 *     paidAmount: number,
 *     discount: number,
 *     totalAmount: string,
 *     services: [{
 *       id: number,
 *       serviceId: number,
 *       count: number,
 *       price: number,
 *       currency: string,
 *     }]
 *   }} requestBody
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function registerInvoicePayment(
  invoiceId,
  requestBody,
  headers = null,
) {
  return put(`/api/invoices/${invoiceId}`, headers, requestBody);
}

/**
 * Fetch all details for an invoice
 * @param {number} invoiceId
 * @param {Object|null} headers
 * @return {Promise<AxiosResponse<*>>}
 */
export async function fetchDetailsForInvoice(invoiceId, headers = null) {
  return get(`/api/invoices/${invoiceId}`, headers);
}

export async function requestUndoPayment(invoiceId, headers = null) {
  return put(`/api/invoices/${invoiceId}/undo`, headers, {});
}
