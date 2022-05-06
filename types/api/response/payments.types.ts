export type PaymentSubscription = {
  id: string;
  totalSeats: number;
  availableSeats: number;
  nextPayment: string;
  nextAmount: number;
  nextCurrency: string;
  interval: 'MONTH' | 'YEAR';
};

export type PaymentInvoices = {
  id: string;
  number: string;
  created: string;
  amount: number;
  currency: string;
  invoicePdf: string;
};

export type PaymentMethod = {
  id: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  holder: string;
};
