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
  id: [number];
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

export const addDoctor = async (body: DoctorCRUDParams, headers = null) => {
  const reqBody = {
    id: body.id,
    add: true,
  };
  return put(`/api/cabinets/${body.cabinet}`, headers, reqBody);
};

export const deleteDoctor = async (body: DoctorCRUDParams, headers = null) => {
  const reqBody = {
    id: body.id,
    add: false,
  };

  return put(`/api/cabinets/${body.cabinet}`, headers, reqBody);
};
