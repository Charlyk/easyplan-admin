import { ChartType } from 'types/ChartType.type';
import { AnalyticsDoctorVisits } from '../ClinicAnalytics.types';

export interface DoctorVisitsChartProps {
  visits: AnalyticsDoctorVisits[];
  visible?: boolean;
  onClose?: (chart: ChartType) => void;
  removeable?: boolean;
}
