import { Country } from 'types/api';

export type BillingDetailsProps = {
  countries: Country[];
};

export type BillingDetailsViewMode =
  | 'payment-history'
  | 'payment-method'
  | 'manage-seats'
  | 'payment-plan';
