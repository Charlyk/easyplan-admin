export type PaymentSubscription = {
  id: string;
  totalSeats: number;
  availableSeats: number;
  nextPayment: string;
  nextAmount: number;
  nextCurrency: string;
};
