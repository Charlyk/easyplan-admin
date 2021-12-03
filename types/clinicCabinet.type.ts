export interface ClinicCabinetUser {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  roleInClinic: string;
}

export interface ClinicCabinet {
  id: number;
  name: string;
  users: ClinicCabinetUser[];
}
