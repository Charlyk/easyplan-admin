export interface PatientPurchase {
  created: string;
  currency: string;
  discount: number;
  id: number;
  paid: number;
  services: string[];
  total: number;
  payments: DetailedPayment[];
}

export interface PatientPurchaseDiscounted extends PatientPurchase {
  discountedTotal: number;
}

export interface DetailedPayment {
  amount: number;
  comment: string;
  created: string;
  currency: string;
  id: number;
  userComment: string | null;
  userName: string;
}
