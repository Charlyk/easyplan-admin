import { ParsedUrlQueryInput } from 'querystring';

declare namespace API {
  export interface AnalyticsFilter extends ParsedUrlQueryInput {
    startDate: string;
    endDate: string;
    doctorId?: number;
  }
}
