import { Doctor } from 'types';

export interface ClinicCabinet {
  id: number;
  name: string;
  users: Doctor[];
}
