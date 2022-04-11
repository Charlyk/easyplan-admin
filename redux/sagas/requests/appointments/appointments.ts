import axios, { AxiosResponse } from 'axios';
import { Patient } from 'types';
import {
  AppointmentsDoctorsResponse,
  CalendarSchedulesResponse,
  ServerResponse,
  CreatePatientBody,
} from 'types/api';

export async function postCreateNewAppointment(
  body,
): Promise<AxiosResponse<any>> {
  return axios.post('/api/schedules', body);
}

export async function fetchDoctors(): Promise<
  AxiosResponse<AppointmentsDoctorsResponse[]>
> {
  return axios.get('/api/appointments/doctors');
}

export async function fetchAppointmentServices(query: { doctorId: string }) {
  const queryString = new URLSearchParams(query).toString();

  return axios.get(`/api/appointments/services?${queryString}`);
}

export async function fetchAppointmentStartHours(query: {
  doctorId: string;
  date: string;
  serviceId: string;
}) {
  const queryString = new URLSearchParams(query).toString();

  return axios.get(`/api/appointments/start-hours?${queryString}`);
}

export async function fetchAppointmentEndHours(query: {
  doctorId: string;
  date: string;
  serviceId: string;
  startTime: string;
}) {
  const queryString = new URLSearchParams(query).toString();

  return axios.get(`/api/appointments/end-hours?${queryString}`);
}

export async function fetchSchedulesByInterval(query: {
  start: string;
  end: string;
  doctorId: string;
}): Promise<AxiosResponse<CalendarSchedulesResponse>> {
  const queryParams = new URLSearchParams(query).toString();

  return axios.get(`/api/schedules/interval?${queryParams}`);
}

export async function createAppointmentPatient(
  formData: CreatePatientBody,
): Promise<ServerResponse<Patient>> {
  return axios.post('/api/patients', formData);
}
