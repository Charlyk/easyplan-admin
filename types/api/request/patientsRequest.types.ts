export type CreatePatientBody = {
  firstName: string;
  lastName: string;
  source: string;
  phoneNumber: string;
  countryCode: string;
};

export type FetchPatientsRequest = {
  page: number;
  rowsPerPage?: number | null;
  query?: string | null;
  gender?: string | null;
  fromAge?: string | number | null;
  toAge?: string | number | null;
  diagnosis?: string | null;
};
