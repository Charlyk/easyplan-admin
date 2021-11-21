import moment from 'moment-timezone';

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

export const getHorizontalBarTestData = () => {
  return {
    labels: [
      'Facebook',
      'Instagram',
      'Twitter',
      'TV',
      'Radio',
      'Other',
      'Facebook',
      'Instagram',
      'Twitter',
      'TV',
      'Radio',
      'Other',
    ],
    datasets: [
      {
        label: 'Sursa pacientilor',
        data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
        backgroundColor: '#3A83DC',
        borderColor: '#3A83DC',
        borderWidth: 1,
      },
    ],
  };
};

export const getDoctorIncomeChartData = () => {
  return {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

export const getDoctorVisitsData = () => {
  return {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};
