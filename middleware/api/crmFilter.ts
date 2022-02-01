import { AxiosResponse } from 'axios';
import { CrmFilterType } from 'types';
import { SaveCrmFilterRequest } from 'types/api';
import { get, put } from './request';

export async function fetchCrmFilter(
  headers?: Record<string, string>,
): Promise<AxiosResponse<CrmFilterType>> {
  return get('/api/crm-filter', headers);
}

export async function updateCrmFilter(
  body: SaveCrmFilterRequest,
  headers?: Record<string, string>,
): Promise<AxiosResponse<CrmFilterType>> {
  return put('/api/crm-filter', headers, body);
}
