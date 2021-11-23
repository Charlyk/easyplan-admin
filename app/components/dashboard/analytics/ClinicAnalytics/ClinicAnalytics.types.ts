export type ClinicAnalyticsProps = {
  query: ClinicAnalyticsQuery;
  analytics: Analytics;
  currentClinic: Easyplan.CurrentClinic;
};

export type ClinicAnalyticsQuery = {
  startDate: string;
  endDate: string;
  doctorId?: string;
};

export type Analytics = {
  services: AnalyticsServices;
  payments: AnalyticsPayments;
  visits: number;
  messages: number;
  treatedPatients: number;
  doctorVisits: AnalyticsDoctorVisits[];
  doctorIncome: AnalyticsDoctorIncome[];
  patientsSource: AnalyticsSourceView[];
  clients: AnalyticsClients;
  conversion: AnalyticsConversion[];
};

export type AnalyticsServices = {
  labels: string[];
  planned: number[];
  completed: number[];
};

export type AnalyticsPayments = {
  paidAmount: number;
  debtAmount: number;
};

export type AnalyticsDoctorVisits = {
  id: number;
  firstName: string;
  lastName: string;
  visits: number;
};

export type AnalyticsDoctorIncome = {
  id: number;
  firstName: string;
  lastName: string;
  amount: number;
};

export type AnalyticsSourceView = {
  source: string;
  amount: number;
};

export type AnalyticsClients = {
  new: number;
  repeated: number;
};

export type AnalyticsConversion = {
  id: number;
  firstName: string;
  lastName: string;
  converted: number;
};

export type ClinicAnalyticsState = {
  doctors: Easyplan.ClinicUser[];
  selectedDoctor?: Easyplan.ClinicUser;
  showRangePicker: boolean;
  selectedRange: [Date, Date];
};
