import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { HYDRATE } from 'next-redux-wrapper';
import { textForKey } from 'app/utils/localization';
import initialState from 'redux/initialState';
import { ChartType, ClinicUser } from 'types';
import { Analytics, ClinicAnalyticsQuery } from './ClinicAnalytics.types';

const allCharts = [
  ChartType.Services,
  ChartType.Income,
  ChartType.ClientsNewReturn,
  ChartType.Visits,
  ChartType.Messages,
  ChartType.TreatedClients,
  ChartType.DoctorsIncome,
  ChartType.DoctorsVisits,
  ChartType.DoctorsConversion,
  ChartType.ClientsSource,
];

const defaultRange: [string, string] = [
  moment().startOf('week').toDate().toString(),
  moment().endOf('week').toDate().toString(),
];

const clinicAnalyticsSlice = createSlice({
  name: 'clinicAnalytics',
  initialState: initialState.clinicAnalytics,
  reducers: {
    setSelectedCharts(state, action: PayloadAction<ChartType[]>) {
      state.selectedCharts = action.payload;
      state.actions = allCharts
        .filter((item) => !state.selectedCharts.includes(item))
        .map((item) => ({
          key: item,
          name: textForKey(`chart_${item}`),
          type: 'default',
        }));
      state.isFetching = false;
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },
    setDoctors(state, action: PayloadAction<ClinicUser[]>) {
      state.doctors = action.payload;
    },
    setSelectedDoctor(state, action: PayloadAction<ClinicUser>) {
      state.selectedDoctor = action.payload;
    },
    setShowRangePicker(state, action: PayloadAction<boolean>) {
      state.showRangePicker = action.payload;
    },
    setSelectedRange(state, action: PayloadAction<[string, string]>) {
      state.selectedRange = action.payload;
    },
    setAnalytics(state, action: PayloadAction<Analytics>) {
      state.analytics = action.payload;
    },
    setInitialQuery(state, action: PayloadAction<ClinicAnalyticsQuery>) {
      const { doctorId, startDate, endDate } = action.payload;
      state.selectedDoctor = state.doctors.find(
        (doctor) => doctor.id === parseInt(doctorId),
      );
      state.selectedRange = [
        moment(startDate).toDate().toString(),
        moment(endDate).toDate().toString(),
      ];
    },
    hideChart(state, action: PayloadAction<ChartType>) {
      state.selectedCharts = state.selectedCharts.filter(
        (item) => item !== action.payload,
      );
      state.actions = allCharts
        .filter((item) => !state.selectedCharts.includes(item))
        .map((item) => ({
          key: item,
          name: textForKey(`chart_${item}`),
          type: 'default',
        }));
    },
    showChart(state, action: PayloadAction<ChartType>) {
      if (!state.selectedCharts.includes(action.payload)) {
        state.selectedCharts = [...state.selectedCharts, action.payload];
        state.actions = allCharts
          .filter((item) => !state.selectedCharts.includes(item))
          .map((item) => ({
            key: item,
            name: textForKey(`chart_${item}`),
            type: 'default',
          }));
      }
    },
    setShowActions(state, action: PayloadAction<boolean>) {
      state.showActions = action.payload;
    },
    setInitialData(
      state,
      action: PayloadAction<[[string, string], ChartType[]]>,
    ) {
      const [range, charts] = action.payload;
      state.selectedRange = range ?? defaultRange;
      state.selectedCharts = charts;
      state.actions = allCharts
        .filter((item) => !state.selectedCharts.includes(item))
        .map((item) => ({
          key: item,
          name: textForKey(`chart_${item}`),
          type: 'default',
        }));
      state.isFetching = false;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => ({
      ...state,
      ...action.payload.clinicAnalytics,
    }),
  },
});

export const {
  setIsFetching,
  setSelectedDoctor,
  setInitialQuery,
  setSelectedRange,
  setShowRangePicker,
  setDoctors,
  hideChart,
  showChart,
  setAnalytics,
  setSelectedCharts,
  setShowActions,
  setInitialData,
} = clinicAnalyticsSlice.actions;

export default clinicAnalyticsSlice.reducer;
