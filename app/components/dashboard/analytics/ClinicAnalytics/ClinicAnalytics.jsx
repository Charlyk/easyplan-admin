import React, { useEffect, useReducer, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import { textForKey } from 'app/utils/localization';
import StatisticFilter from '../StatisticFilter';
import AmountsChart from './AmountsChart';
import ClientsChart from './ClientsChart';
import styles from './ClinicAnalytics.module.scss';
import reducer, {
  initialState,
  setSelectedRange,
  setShowRangePicker,
} from './ClinicAnalytics.reducer';
import DoctorsConversionChart from './DoctorsConversionChart';
import DoctorsIncomeChart from './DoctorsIncomeChart';
import DoctorVisitsChart from './DoctorVisitsChart';
import PatientsSourceChart from './PatientsSourceChart';
import SentMessagesChart from './SentMessagesChart';
import ServicesChart from './ServicesChart';
import TotalVisitsChart from './TotalVisistsChart';
import TreatedPatientsChart from './TreatedPatientsChart';

const ClinicAnalytics = ({ query, currentClinic, analytics }) => {
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
    const params = {
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    };
    if (selectedDoctor.id !== -1) {
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
          ref={pickerRef}
          containerClass={styles.filterField}
          fieldLabel={textForKey('Period')}
          readOnly
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
          <ClientsChart />
          <TotalVisitsChart visits={analytics.visits} />
          <SentMessagesChart messages={analytics.messages} />
          <TreatedPatientsChart patients={analytics.treatedPatients} />
          <DoctorVisitsChart />
          <DoctorsIncomeChart />
          <DoctorsConversionChart />
          <PatientsSourceChart />
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

ClinicAnalytics.propTypes = {
  query: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
  analytics: PropTypes.shape({
    services: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
      planned: PropTypes.arrayOf(PropTypes.number),
      completed: PropTypes.arrayOf(PropTypes.number),
    }),
    payments: PropTypes.shape({
      paidAmount: PropTypes.number,
      debtAmount: PropTypes.number,
    }),
    visits: PropTypes.number,
    messages: PropTypes.number,
    treatedPatients: PropTypes.number,
  }),
};

ClinicAnalytics.defaultProps = {
  analytics: {
    services: {
      labels: [],
      planned: [],
      completed: [],
    },
    payments: {
      paidAmount: 0,
      debtAmount: 0,
    },
    visits: 0,
    messages: 0,
    treatedPatients: 0,
  },
};
