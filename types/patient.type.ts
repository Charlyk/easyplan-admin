export interface Tag {
  id: number;
  title: string;
}

export type Patient = {
  id: number;
  phoneNumber: string | null;
  countryCode: string | null;
  fullName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  discount?: number | null;
  name?: string | null;
  label?: string | null;
  source?: PatientSource | null;
  tags?: Tag[] | [];
  address?: string | null;
  identityCard: string | null;
  identificationNumber: number | null;
};

export enum PatientSource {
  Unknown = 'Unknown',
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Twitter = 'Twitter',
  LinkedIn = 'LinkedIn',
  TV = 'TV',
  Radio = 'Radio',
  Friend = 'Friend',
  Internet = 'Internet',
  Imported = 'Imported',
  Google = 'Google',
  Other = 'Other',
}
