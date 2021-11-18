import React, { useMemo, useReducer, useRef } from "react";
import sortBy from "lodash/sortBy";
import moment from "moment-timezone";
import Grid from "@material-ui/core/Grid";
import { textForKey } from "../../../../utils/localization";
import { Role } from "../../../../utils/constants";
import EasyDateRangePicker from "../../../common/EasyDateRangePicker";
import EASTextField from "../../../common/EASTextField";
import EASSelect from "../../../common/EASSelect";
import StatisticFilter from "../StatisticFilter";
import ServicesChart from "./ServicesChart";
import DoctorVisitsChart from "./DoctorVisitsChart";
import DoctorsIncomeChart from "./DoctorsIncomeChart";
import DoctorsConversionChart from "./DoctorsConversionChart";
import TotalVisitsChart from "./TotalVisistsChart";
import SentMessagesChart from "./SentMessagesChart";
import TreatedPatientsChart from './TreatedPatientsChart';
import AmountsChart from "./AmountsChart";
import ClientsChart from "./ClientsChart";
import reducer, {
  initialState,
  setSelectedDoctor,
  setInitialQuery,
  setSelectedRange,
  setDoctors,
  setShowRangePicker
} from './ClinicAnalytics.reducer';
import styles from './ClinicAnalytics.module.scss';
import PatientsSourceChart from "./PatientsSourceChart";

const ClinicAnalytics = ({ currentUser, currentClinic }) => {
  const pickerRef = useRef(null);
  const [
    {
      selectedDoctor,
      showRangePicker,
      selectedRange
    },
    localDispatch
  ] = useReducer(reducer, initialState);
  const [startDate, endDate] = selectedRange

  const doctors = useMemo(() => {
    return sortBy(
      currentClinic?.users?.filter(user => user.roleInClinic === Role.doctor) || [],
      user => user.fullName.toLowerCase(),
    ).map(({ id, fullName, isHidden }) => ({
      id,
      name: `${fullName} ${isHidden ? `(${textForKey('Fired')})` : ''}`
    }))
  }, [currentClinic]);

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
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
    }
    if (selectedDoctor.id !== -1) {
      params.doctorId = selectedDoctor.id
    }
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
          direction="row"
          alignItems="stretch"
          className={styles.gridContainer}
        >
          <ServicesChart />
          <AmountsChart />
          <ClientsChart />
          <TotalVisitsChart />
          <SentMessagesChart />
          <TreatedPatientsChart />
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
