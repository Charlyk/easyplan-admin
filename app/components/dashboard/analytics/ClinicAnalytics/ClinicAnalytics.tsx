import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { CircularProgress, Zoom } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import ActionsSheet from 'app/components/common/ActionsSheet';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import IconPlus from 'app/components/icons/iconPlus';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import usePrevious from 'app/utils/hooks/usePrevious';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import { requestFetchClinicAnalytics } from 'middleware/api/analytics';
import {
  requestFetchSelectedCharts,
  requestUpdateSelectedCharts,
} from 'middleware/api/users';
import { ChartType } from 'types/ChartType.type';
import StatisticFilter from '../StatisticFilter';
import AmountsChart from './AmountsChart';
import ClientsChart from './ClientsChart';
import styles from './ClinicAnalytics.module.scss';
import reducer, {
  hideChart,
  initialState,
  setAnalytics,
  setIsFetching,
  setSelectedCharts,
  setSelectedRange,
  setShowActions,
  setShowRangePicker,
  showChart,
  setInitialData,
} from './ClinicAnalytics.reducer';
import { ChartAction, ClinicAnalyticsProps } from './ClinicAnalytics.types';
import DoctorsConversionChart from './DoctorsConversionChart';
import DoctorsIncomeChart from './DoctorsIncomeChart';
import DoctorVisitsChart from './DoctorVisitsChart';
import PatientsSourceChart from './PatientsSourceChart';
import SentMessagesChart from './SentMessagesChart';
import ServicesChart from './ServicesChart';
import TotalVisitsChart from './TotalVisistsChart';
import TreatedPatientsChart from './TreatedPatientsChart';

const ClinicAnalytics: React.FC<ClinicAnalyticsProps> = ({
  query,
  currentClinic,
}) => {
  const router = useRouter();
  const fabRef = useRef(null);
  const pickerRef = useRef(null);
  const [
    {
      isFetching,
      showRangePicker,
      selectedRange,
      analytics,
      selectedCharts,
      actions,
      showActions,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const previousCharts = usePrevious(selectedCharts);
  const [startDate, endDate] = selectedRange;

  useEffect(() => {
    initializeComponentData();
  }, []);

  useEffect(() => {
    if (
      selectedCharts.length === 0 ||
      selectedCharts.length < previousCharts.length ||
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

  const initializeComponentData = useCallback(async () => {
    try {
      localDispatch(setIsFetching(true));
      const response = await requestFetchSelectedCharts();
      if (query == null) {
        localDispatch(setSelectedCharts(response.data));
        return;
      }
      const startDate = moment(query.startDate).toDate();
      const endDate = moment(query.endDate).toDate();
      localDispatch(setInitialData([[startDate, endDate], response.data]));
    } catch (error) {
      onRequestError(error);
      localDispatch(setIsFetching(true));
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
        localDispatch(hideChart(chart));
      } catch (error) {
        onRequestError(error);
      }
    },
    [selectedCharts],
  );

  const handleActionSelected = useCallback(
    async (action: ChartAction) => {
      handleCloseActions();
      try {
        await requestUpdateSelectedCharts([...selectedCharts, action.key]);
        localDispatch(showChart(action.key));
      } catch (error) {
        onRequestError(error);
      }
    },
    [selectedCharts],
  );

  const fetchClinicAnalytics = async (start = startDate, end = endDate) => {
    try {
      localDispatch(setIsFetching(true));
      const stringStartDate = moment(start).format('YYYY-MM-DD');
      const stringEndDate = moment(end).format('YYYY-MM-DD');
      const response = await requestFetchClinicAnalytics(
        stringStartDate,
        stringEndDate,
      );
      localDispatch(setAnalytics(response.data));
      // update query params
      await router.push({
        pathname: '/analytics/general',
        query: {
          startDate: stringStartDate,
          endDate: stringEndDate,
        },
      });
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setIsFetching(false));
    }
  };

  const handleDatePickerClose = () => {
    localDispatch(setShowRangePicker(false));
  };

  const handleDatePickerOpen = () => {
    localDispatch(setShowRangePicker(true));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(setSelectedRange([startDate, endDate]));
  };

  const handleCloseActions = () => {
    localDispatch(setShowActions(false));
  };

  const handleOpenActions = () => {
    localDispatch(setShowActions(true));
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
      <Zoom unmountOnExit in={actions.length > 0} timeout={300}>
        <Fab
          ref={fabRef}
          size='medium'
          aria-label='charts'
          className={styles.chartsFab}
          onClick={handleOpenActions}
        >
          <IconPlus />
        </Fab>
      </Zoom>
      <ActionsSheet
        open={showActions}
        anchorEl={fabRef.current}
        placement='top-end'
        actions={actions}
        onClose={handleCloseActions}
        onSelect={handleActionSelected}
      />
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
