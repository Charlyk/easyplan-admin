export interface Tag {
  id: number;
  title: string;
}

export type Patient = {
  id: number;
  avatar: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  countryCode: string | null;
  discount: number | null;
  tags: Tag[];
};
