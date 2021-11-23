import React, { useEffect, useReducer, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import { textForKey } from 'app/utils/localization';
import { API } from 'types/api';
import StatisticFilter from '../StatisticFilter';
import AmountsChart from './AmountsChart';
import ClientsChart from './ClientsChart';
import styles from './ClinicAnalytics.module.scss';
import reducer, {
  initialState,
  setSelectedRange,
  setShowRangePicker,
} from './ClinicAnalytics.reducer';
import { ClinicAnalyticsProps } from './ClinicAnalytics.types';
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
  analytics,
}) => {
  const router = useRouter();
  const pickerRef = useRef(null);
  const [{ selectedDoctor, showRangePicker, selectedRange }, localDispatch] =
    useReducer(reducer, initialState);
  const [startDate, endDate] = selectedRange;

  useEffect(() => {
    if (query == null) {
      return;
    }
    const startDate = moment(query.startDate).toDate();
    const endDate = moment(query.endDate).toDate();
    localDispatch(setSelectedRange([startDate, endDate]));
  }, [query]);

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

  const handleFilterSubmit = async () => {
    const params: API.AnalyticsFilter = {
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    };
    if (selectedDoctor != null) {
      params.doctorId = selectedDoctor.id;
    }
    await router.replace({
      pathname: '/analytics/general',
      query: params,
    });
  };

  return (
    <div className={styles.clinicAnalytics}>
      <StatisticFilter onUpdate={handleFilterSubmit}>
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
        <Grid
          container
          spacing={1}
          direction='row'
          alignItems='stretch'
          className={styles.gridContainer}
        >
          <ServicesChart services={analytics.services} />
          <AmountsChart
            currency={currentClinic.currency}
            payments={analytics.payments}
          />
          <ClientsChart clients={analytics.clients} />
          <TotalVisitsChart visits={analytics.visits} />
          <SentMessagesChart messages={analytics.messages} />
          <TreatedPatientsChart patients={analytics.treatedPatients} />
          <DoctorVisitsChart visits={analytics.doctorVisits} />
          <DoctorsIncomeChart incomes={analytics.doctorIncome} />
          <DoctorsConversionChart conversions={analytics.conversion} />
          <PatientsSourceChart sources={analytics.patientsSource} />
        </Grid>
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

export default ClinicAnalytics;
