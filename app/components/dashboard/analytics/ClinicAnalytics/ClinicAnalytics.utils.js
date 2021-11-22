import moment from 'moment-timezone';
import { colorArray } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';

export const noLegendOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      align: 'start',
      display: true,
      usePointStyle: true,
      boxWidth: 6,
    },
  },
};

export const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      align: 'start',
      display: true,
      usePointStyle: true,
      boxWidth: 6,
    },
  },
};

export const horizontalBarOptions = {
  maintainAspectRatio: false,
  responsive: true,
  indexAxis: 'y',
  plugins: {
    legend: {
      align: 'start',
      display: true,
      usePointStyle: true,
      boxWidth: 6,
    },
  },
};

export const rightLegendOptions = {
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

/**
 * Build and return chart data for services
 * @param {{ labels: string[], planned: number[], completed: number[] }?} services
 * @return {{datasets: [{backgroundColor: string, borderColor: string, data: number[], label: string, fill: boolean}, {backgroundColor: string, borderColor: string, data: number[], label: string, fill: boolean}], labels: string[]}}
 */
export const getServicesChartData = (services) => {
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

/**
 * Format dates for UI
 * @param {string[]} dates
 */
const formatDates = (dates) => {
  return dates.map((date) => moment(date).format('DD MMM'));
};

export const getBarchartTestData = () => {
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

/**
 * Get patients source chart data
 * @param {AnalyticsSourceView[]} sources
 * @return {ChartData<"bar", number[], string>}
 */
export const getHorizontalBarTestData = (sources) => {
  return {
    labels: sources.map((item) => textForKey(item.source)),
    datasets: [
      {
        label: 'Sursa pacientilor',
        data: sources.map((item) => item.amount),
        backgroundColor: '#3A83DC',
        borderColor: '#3A83DC',
        borderWidth: 1,
      },
    ],
  };
};

/**
 * Get chart data for doctor visits
 * @param {AnalyticsDoctorIncome[]} visits
 * @return {ChartData<"pie", number[], string>}
 */
export const getDoctorIncomeChartData = (incomes) => {
  return {
    labels: incomes.map((item) => item.firstName),
    datasets: [
      {
        label: '# of Votes',
        data: incomes.map((item) => item.amount),
        backgroundColor: incomes.map((_, index) => colorArray[index]),
        borderWidth: 1,
      },
    ],
  };
};

/**
 * Get chart data for doctor visits
 * @param {AnalyticsDoctorVisits[]} visits
 * @return {ChartData<"pie", number[], string>}
 */
export const getDoctorVisitsData = (visits) => {
  return {
    type: 'pie',
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
