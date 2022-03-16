export interface PatientVisit {
  id: number;
  created: string;
  note?: string | null;
  doctor: VisitDoctor;
  treatmentServices: VisitService[];
}

export interface VisitDoctor {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface VisitService {
  id: number;
  name: string | null;
  color: string | null;
  teeth: string[];
  group: string | null;
}
