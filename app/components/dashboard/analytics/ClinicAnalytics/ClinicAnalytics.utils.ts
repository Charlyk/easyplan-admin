import { ChartData, ChartOptions } from 'chart.js';
import moment from 'moment-timezone';
import { colorArray } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import {
  AnalyticsDoctorIncome,
  AnalyticsDoctorVisits,
  AnalyticsServices,
  AnalyticsSourceView,
} from './ClinicAnalytics.types';

const formatDates = (dates: string[]) => {
  return dates.map((date) => moment(date).format('DD MMM'));
};

export const getChartOptions = (
  align: 'start' | 'center' | 'end',
  maintainAspectRatio: boolean,
  indexAxis: 'x' | 'y' = null,
): ChartOptions => ({
  maintainAspectRatio,
  responsive: true,
  indexAxis,
  plugins: {
    legend: {
      align: align,
      display: true,
    },
  },
});

export const getServicesChartData = (
  services: AnalyticsServices,
): ChartData<'line'> => {
  return {
    labels: formatDates(services?.labels || []),
    datasets: [
      {
        label: textForKey('analytics_executed'),
        data: services?.completed || [],
        fill: false,
        backgroundColor: '#3A83DC',
        borderColor: '#3A83DC',
      },
      {
        label: textForKey('analytics_planned'),
        data: services?.planned || [],
        fill: false,
        backgroundColor: '#FDC534',
        borderColor: '#FDC534',
      },
    ],
  };
};

export const getBarchartTestData = (): ChartData<'bar'> => {
  return {
    labels: ['Vasile', 'Gheorge', 'Ion', 'Grigore', 'Petrica', 'Eugen'],
    datasets: [
      {
        label: 'Doctors conversion',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#3A83DC',
        borderColor: '#3A83DC',
      },
    ],
  };
};

export const getPatientsSourceData = (
  sources: AnalyticsSourceView[],
): ChartData<'bar'> => {
  return {
    labels: sources.map((item) => textForKey(item.source)),
    datasets: [
      {
        label: textForKey('analytics_clients_source'),
        data: sources.map((item) => item.amount),
        backgroundColor: '#3A83DC',
        borderColor: '#3A83DC',
        borderWidth: 1,
      },
    ],
  };
};

export const getDoctorIncomeChartData = (
  incomes: AnalyticsDoctorIncome[],
): ChartData<'polarArea'> => {
  return {
    labels: incomes.map((item) => item.firstName),
    datasets: [
      {
        label: '',
        data: incomes.map((item) => item.amount),
        backgroundColor: incomes.map((_, index) => colorArray[index]),
        borderWidth: 1,
      },
    ],
  };
};

export const getDoctorVisitsData = (
  visits: AnalyticsDoctorVisits[],
): ChartData<'pie'> => {
  return {
    labels: visits.map((item) => item.firstName),
    datasets: [
      {
        label: '',
        data: visits.map((item) => item.visits),
        backgroundColor: visits.map((_, index) => colorArray[index]),
        borderWidth: 1,
      },
    ],
  };
};
