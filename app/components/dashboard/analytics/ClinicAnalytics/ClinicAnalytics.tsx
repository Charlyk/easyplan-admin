import React, { useCallback, useEffect, useRef } from 'react';
import { CircularProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import usePrevious from 'app/hooks/usePrevious';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import { requestFetchClinicAnalytics } from 'middleware/api/analytics';
import { requestUpdateSelectedCharts } from 'middleware/api/users';
import { ChartType } from 'types/ChartType.type';
import StatisticFilter from '../StatisticFilter';
import AmountsChart from './AmountsChart';
import ClientsChart from './ClientsChart';
import styles from './ClinicAnalytics.module.scss';
import {
  hideChart,
  setAnalytics,
  setIsFetching,
  setSelectedRange,
  setShowRangePicker,
} from './ClinicAnalytics.reducer';
import { clinicAnalyticsSelector } from './ClinicAnalytics.selectors';
import { ClinicAnalyticsProps } from './ClinicAnalytics.types';
import DoctorsConversionChart from './DoctorsConversionChart';
import DoctorsIncomeChart from './DoctorsIncomeChart';
import DoctorVisitsChart from './DoctorVisitsChart';
import PatientsSourceChart from './PatientsSourceChart';
import SentMessagesChart from './SentMessagesChart';
import ServicesChart from './ServicesChart';
import TotalVisitsChart from './TotalVisistsChart';
import TreatedPatientsChart from './TreatedPatientsChart';

const ClinicAnalytics: React.FC<ClinicAnalyticsProps> = ({ currentClinic }) => {
  const dispatch = useDispatch();
  const pickerRef = useRef(null);
  const didInitialRenderHappen = useRef(false);
  const {
    isFetching,
    showRangePicker,
    selectedRange,
    analytics,
    selectedCharts,
  } = useSelector(clinicAnalyticsSelector);
  const previousCharts = usePrevious(selectedCharts);
  const [startDate, endDate] = selectedRange.map((item) => new Date(item));

  useEffect(() => {
    if (!didInitialRenderHappen.current) return;
    didInitialRenderHappen.current = true;
    if (
      selectedCharts?.length === 0 ||
      selectedCharts?.length < previousCharts?.length ||
      isEqual(selectedCharts, previousCharts)
    ) {
      return;
    }

    fetchClinicAnalytics();
  }, [selectedCharts, previousCharts]);

  const renderChart = useCallback(
    (chart: ChartType) => {
      switch (chart) {
        case ChartType.Services:
          return (
            <ServicesChart
              key={chart}
              removeable={false}
              services={analytics.services}
              visible={isVisible(ChartType.Services)}
              onClose={handleHideChart}
            />
          );
        case ChartType.Income:
          return (
            <AmountsChart
              key={chart}
              removeable={false}
              currency={currentClinic.currency}
              payments={analytics.payments}
              visible={isVisible(ChartType.Income)}
              onClose={handleHideChart}
            />
          );
        case ChartType.ClientsNewReturn:
          return (
            <ClientsChart
              key={chart}
              removeable={false}
              clients={analytics.clients}
              visible={isVisible(ChartType.ClientsNewReturn)}
              onClose={handleHideChart}
            />
          );
        case ChartType.Visits:
          return (
            <TotalVisitsChart
              key={chart}
              removeable={false}
              visits={analytics.visits}
              visible={isVisible(ChartType.Visits)}
              onClose={handleHideChart}
            />
          );
        case ChartType.Messages:
          return (
            <SentMessagesChart
              key={chart}
              removeable={false}
              messages={analytics.messages}
              visible={isVisible(ChartType.Messages)}
              onClose={handleHideChart}
            />
          );
        case ChartType.TreatedClients:
          return (
            <TreatedPatientsChart
              key={chart}
              removeable={false}
              patients={analytics.treatedPatients}
              visible={isVisible(ChartType.TreatedClients)}
              onClose={handleHideChart}
            />
          );
        case ChartType.DoctorsIncome:
          return (
            <DoctorsIncomeChart
              key={chart}
              removeable={false}
              incomes={analytics.doctorIncome}
              currency={currentClinic.currency}
              visible={isVisible(ChartType.DoctorsIncome)}
              onClose={handleHideChart}
            />
          );
        case ChartType.DoctorsVisits:
          return (
            <DoctorVisitsChart
              key={chart}
              removeable={false}
              visits={analytics.doctorVisits}
              visible={isVisible(ChartType.DoctorsVisits)}
              onClose={handleHideChart}
            />
          );
        case ChartType.DoctorsConversion:
          return (
            <DoctorsConversionChart
              key={chart}
              removeable={false}
              conversions={analytics.conversion}
              visible={isVisible(ChartType.DoctorsConversion)}
              onClose={handleHideChart}
            />
          );
        case ChartType.ClientsSource:
          return (
            <PatientsSourceChart
              key={chart}
              removeable={false}
              sources={analytics.patientsSource}
              visible={isVisible(ChartType.ClientsSource)}
              onClose={handleHideChart}
            />
          );
      }
    },
    [analytics],
  );

  useEffect(() => {
    const savedDate = JSON.parse(localStorage.getItem('dateRange'));
    if (savedDate !== null) {
      dispatch(
        setSelectedRange([
          savedDate.startDate.toString(),
          savedDate.endDate.toString(),
        ]),
      );
      fetchClinicAnalytics(savedDate.startDate, savedDate.endDate);
    }
  }, []);

  const isVisible = useCallback(
    (chart: ChartType) => selectedCharts.includes(chart),
    [selectedCharts],
  );

  const handleHideChart = useCallback(
    async (chart: ChartType) => {
      try {
        await requestUpdateSelectedCharts(
          selectedCharts.filter((item) => item !== chart),
        );
        dispatch(hideChart(chart));
      } catch (error) {
        onRequestError(error);
      }
    },
    [selectedCharts],
  );

  const fetchClinicAnalytics = async (start = startDate, end = endDate) => {
    try {
      dispatch(setIsFetching(true));
      const stringStartDate = moment(start).format('YYYY-MM-DD');
      const stringEndDate = moment(end).format('YYYY-MM-DD');
      const response = await requestFetchClinicAnalytics(
        stringStartDate,
        stringEndDate,
      );
      dispatch(setAnalytics(response.data));
    } catch (error) {
      onRequestError(error);
    } finally {
      dispatch(setIsFetching(false));
    }
  };

  const handleDatePickerClose = () => {
    dispatch(setShowRangePicker(false));
  };

  const handleDatePickerOpen = () => {
    dispatch(setShowRangePicker(true));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    dispatch(setSelectedRange([startDate.toString(), endDate.toString()]));
    localStorage.setItem('dateRange', JSON.stringify({ startDate, endDate }));
  };

  const handleFilterSubmit = async () => {
    await fetchClinicAnalytics();
  };

  return (
    <div className={styles.clinicAnalytics}>
      <StatisticFilter onUpdate={handleFilterSubmit} isLoading={isFetching}>
        <EASTextField
          readOnly
          ref={pickerRef}
          containerClass={styles.filterField}
          fieldLabel={textForKey('Period')}
          onPointerUp={handleDatePickerOpen}
          value={`${moment(startDate).format('DD MMM YYYY')} - ${moment(
            endDate,
          ).format('DD MMM YYYY')}`}
        />
      </StatisticFilter>
      <div className={styles.dataContainer}>
        {isFetching && analytics == null && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
          </div>
        )}
        {analytics != null && (
          <Grid
            container
            spacing={1}
            direction='row'
            justifyContent='space-between'
            alignItems='stretch'
            className={styles.gridContainer}
          >
            {selectedCharts.map(renderChart)}
          </Grid>
        )}
      </div>
      <EasyDateRangePicker
        open={showRangePicker}
        onChange={handleDateChange}
        onClose={handleDatePickerClose}
        pickerAnchor={pickerRef.current}
        dateRange={{ startDate, endDate }}
      />
    </div>
  );
};

export default React.memo(ClinicAnalytics, areComponentPropsEqual);
