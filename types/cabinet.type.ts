export interface Cabinet {
  id: number;
  name: string;
  users: CabinetUser[];
}

export interface CabinetUser {
  id: number;
  roleInClinic: 'ADMIN' | 'MANAGER' | 'DOCTOR' | 'RECEPTION' | 'NONE';
  user: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
