export interface PatientVisit {
  id: number;
  created: string;
  note?: string | null;
  doctor: VisitDoctor;
  planServices: VisitService[];
}

export interface VisitDoctor {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface VisitService {
  id: number;
  destination: string | null;
  toothId: string | null;
  service: VisitClinicService;
}

export interface VisitClinicService {
  id: number;
  color: string;
  currency: string;
  name: string;
  price: number;
}
