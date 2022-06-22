import React, { useEffect, useMemo, useRef, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconDownload from '@material-ui/icons/CloudDownload';
import axios from 'axios';
import moment, { now } from 'moment-timezone';
import { useRouter } from 'next/router';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import LoadingButton from 'app/components/common/LoadingButton';
import StatisticFilter from 'app/components/dashboard/analytics/StatisticFilter';
import { HeaderKeys } from 'app/utils/constants';
import { baseApiUrl } from 'eas.config';
import {
  authTokenSelector,
  currentClinicSelector,
} from 'redux/selectors/appDataSelector';
import {
  appointmentsReportsDataSelector,
  isAppointmentsReportsLoadingSelector,
} from 'redux/selectors/appointmentsReportSelector';
import { fetchAppointmentReports } from 'redux/slices/appointmentsReportSlice';
import { AppointmentReportsPayload } from 'types/api';
import styles from './Appointments.module.scss';

const statusesOrder = [
  'Pending',
  'Confirmed',
  'WaitingForPatient',
  'Late',
  'DidNotCome',
  'Canceled',
  'OnSite',
  'AtDoctor',
  'CompletedNotPaid',
  'PartialPaid',
  'CompletedPaid',
  'Rescheduled',
  'CompletedFree',
];

interface AppointmentsQuery {
  startDate: string;
  endDate: string;
}

interface PaymentsProps {
  query: AppointmentsQuery;
}

const Appointments: React.FC<PaymentsProps> = ({ query }) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const router = useRouter();
  const appointmentsReports = useSelector(appointmentsReportsDataSelector);
  const isPaymentReportsLoading = useSelector(
    isAppointmentsReportsLoadingSelector,
  );
  const currentClinic = useSelector(currentClinicSelector);
  const authToken = useSelector(authTokenSelector);
  const pickerRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [dateRange, setDateRange] = useState([
    moment(query.startDate).toDate(),
    moment(query.endDate).toDate(),
  ]);

  const [request, setRequest] = useState<AppointmentReportsPayload>({
    startDate: moment(query.startDate).toDate(),
    endDate: moment(query.endDate).toDate(),
  });

  const intervalName = useMemo(() => {
    return `${moment(dateRange[0]).format('DD MMM YYYY')} - ${moment(
      dateRange[1],
    ).format('DD MMM YYYY')}`;
  }, [dateRange]);

  useEffect(() => {
    const startDate = moment(query.startDate).toDate();
    const endDate = moment(query.endDate).toDate();
    setDateRange([startDate, endDate]);
    setRequest({
      startDate,
      endDate,
    });
  }, [query]);

  useEffect(() => {
    dispatch(fetchAppointmentReports(request));
  }, [request]);

  const handleFilterSubmit = async () => {
    await reloadPage();
  };

  const reloadPage = async (
    startDate = dateRange[0],
    endDate = dateRange[1],
  ) => {
    const startDateStr = moment(startDate).format('YYYY-MM-DD');
    const endDateStr = moment(endDate).format('YYYY-MM-DD');
    await router.replace(
      `/reports/appointments?startDate=${startDateStr}&endDate=${endDateStr}`,
    );
  };

  const handleDatePickerOpen = () => setShowDatePicker(true);

  const handleDatePickerClose = () => setShowDatePicker(false);

  const handleDateChange = (data: {
    range1: { startDate: Date; endDate: Date };
  }) => {
    const { startDate, endDate } = data.range1;
    setDateRange([startDate, endDate]);
  };

  const handleDownloadFile = () => {
    setIsDownloading(true);
    const startDate = moment(dateRange[0]).format('YYYY-MM-DD');
    const endDate = moment(dateRange[1]).format('YYYY-MM-DD');
    axios
      .get(
        `${baseApiUrl}/reports/users/download?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            [HeaderKeys.authorization]: String(authToken),
            [HeaderKeys.clinicId]: String(currentClinic.id),
          },
          responseType: 'blob',
        },
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setIsDownloading(false);
      });
  };

  return (
    <div className={styles.pendingConsultations}>
      <StatisticFilter
        onUpdate={handleFilterSubmit}
        isLoading={isPaymentReportsLoading}
      >
        <EASTextField
          ref={pickerRef}
          containerClass={styles.selectControlRoot}
          fieldLabel={textForKey('period')}
          readOnly
          onPointerUp={handleDatePickerOpen}
          value={intervalName}
        />
      </StatisticFilter>
      <div className={styles.dataContainer}>
        {isPaymentReportsLoading && appointmentsReports.length === 0 && (
          <div className={styles.progressWrapper}>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
        {!isPaymentReportsLoading && appointmentsReports.length === 0 && (
          <span className={styles.noDataLabel}>{textForKey('no results')}</span>
        )}
        {appointmentsReports.length > 0 && (
          <TableContainer classes={{ root: styles['table-container'] }}>
            <Table classes={{ root: styles['data-table'] }}>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('user')}</TableCell>
                  {statusesOrder.map((status) => (
                    <TableCell key={status} align={'center'}>
                      {textForKey(status.toLowerCase())}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {appointmentsReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      {report.firstName + ' ' + report.lastName}
                    </TableCell>
                    {report.statuses.map((status) => (
                      <TableCell key={status.id} align={'center'}>
                        {status.count}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <div className={styles.pageFooter}>
        <LoadingButton
          variant='text'
          onClick={handleDownloadFile}
          className={styles.primaryButton}
          isLoading={isDownloading}
        >
          <IconDownload />
          {textForKey('export_excel')}
        </LoadingButton>
      </div>
      <EasyDateRangePicker
        onChange={handleDateChange}
        onClose={handleDatePickerClose}
        dateRange={{
          startDate: dateRange[0],
          endDate: dateRange[1],
        }}
        open={showDatePicker}
        pickerAnchor={pickerRef.current}
      />
    </div>
  );
};

export default Appointments;
