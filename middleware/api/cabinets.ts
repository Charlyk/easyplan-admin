import { AxiosResponse } from 'axios';
import { Cabinet } from '../../types';
import { del, get, put, post } from './request';

export const getAllCabinetsInfo = async (headers = null) => {
  return get('/api/cabinets', headers);
};

interface CreateCabinetBodyParams {
  name: string;
  users: number[];
}

export const createCabinet = async (
  body: CreateCabinetBodyParams,
  headers = null,
) => {
  return post('/api/cabinets', headers, body);
};

interface DeleteCabinetParams {
  id: number;
}

export const deleteCabinet = async (
  body: DeleteCabinetParams,
  headers = null,
) => {
  return del(`/api/cabinets/${body.id}`, headers);
};

interface DoctorCRUDParams {
  id: [number] | number[];
  cabinet: number;
}

interface updateCabinetParams {
  id: number;
  name: string;
}

export const updateCabinet = async (
  reqBody: updateCabinetParams,
  headers = null,
) => {
  const body = {
    name: reqBody.name,
  };
  return put(`/api/cabinets/${reqBody.id}`, headers, body);
};

export const addDoctor = async (params: DoctorCRUDParams, headers = null) => {
  const body = {
    users: params.id,
    add: true,
  };
  return put(`/api/cabinets/${params.cabinet}/doctors`, headers, body);
};

export const deleteDoctor = async (
  params: DoctorCRUDParams,
  headers = null,
) => {
  const body = {
    users: params.id,
    add: false,
  };

  return put(`/api/cabinets/${params.cabinet}/doctors`, headers, body);
};

export async function requestChangeCabinetCalendarOrder(
  cabinetId: number,
  orderId: number,
  headers?: Record<string, string> | null,
): Promise<AxiosResponse<Cabinet>> {
  return put(
    `/api/cabinets/${cabinetId}/calendar-order?orderId=${orderId}`,
    headers,
    {},
  );
}
