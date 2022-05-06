export type PaymentCardData = {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
  cardHolder: string;
  address: {
    country: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    state?: string;
    zip: string;
  };
};
