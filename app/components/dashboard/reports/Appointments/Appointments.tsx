import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconDownload from '@material-ui/icons/CloudDownload';
import axios from 'axios';
import moment, { now } from 'moment-timezone';
import { useRouter } from 'next/router';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
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
import { fetchPendingConsultations } from 'redux/slices/pendingConsultationsSlice';
import { PaymentReportsGetRequest } from 'types/api';
import styles from './Appointments.module.scss';

interface AppointmentsQuery {
  page: number;
  itemsPerPage: number;
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

  const [dateRange, setDateRange] = useState([
    moment(query.startDate).toDate(),
    moment(query.endDate).toDate(),
  ]);

  const [request, setRequest] = useState<PaymentReportsGetRequest>({
    startDate: moment(query.startDate).toDate(),
    endDate: moment(query.endDate).toDate(),
    page: query.page,
    itemsPerPage: query.itemsPerPage,
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
      page: query.page,
      itemsPerPage: query.itemsPerPage,
    });
  }, [query]);

  useEffect(() => {
    dispatch(fetchPendingConsultations(request));
  }, [request]);

  const handleFilterSubmit = async () => {
    await reloadPage(request.itemsPerPage, 0);
  };

  const handleChangePage = async (event, newPage) => {
    await reloadPage(request.itemsPerPage, newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const rows = parseInt(event.target.value);
    await reloadPage(rows, 0);
  };

  const reloadPage = async (
    rows = request.itemsPerPage,
    page = request.page,
    startDate = dateRange[0],
    endDate = dateRange[1],
  ) => {
    const startDateStr = moment(startDate).format('YYYY-MM-DD');
    const endDateStr = moment(endDate).format('YYYY-MM-DD');
    await router.replace(
      `/reports/appointments?page=${page}&startDate=${startDateStr}&endDate=${endDateStr}&itemsPerPage=${rows}`,
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
    const startDate = moment(dateRange[0]).format('YYYY-MM-DD');
    const endDate = moment(dateRange[1]).format('YYYY-MM-DD');
    axios
      .get(
        `${baseApiUrl}/reports/consultations/download?startDate=${startDate}&endDate=${endDate}`,
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
        {isPaymentReportsLoading && appointmentsReports?.data.length === 0 && (
          <div className={styles.progressWrapper}>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
        {!isPaymentReportsLoading && appointmentsReports?.data.length === 0 && (
          <span className={styles.noDataLabel}>{textForKey('no results')}</span>
        )}
        {[1, 2].length > 0 && (
          <TableContainer classes={{ root: styles['table-container'] }}>
            <Table classes={{ root: styles['data-table'] }}>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('date')}</TableCell>
                  <TableCell>{textForKey('patient')}</TableCell>
                  <TableCell>{textForKey('phone number')}</TableCell>
                  <TableCell>{textForKey('doctor')}</TableCell>
                  <TableCell>{textForKey('patient_guide')}</TableCell>
                  <TableCell align='right' size='small'>
                    {textForKey('status')}
                  </TableCell>
                  <TableCell align='right'>
                    {textForKey('user_comment')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*{consultations.data.map((item) => (*/}
                {/*  <TableRow key={item.id}>*/}
                {/*    <TableCell>*/}
                {/*      {moment(item.date).format('DD MMM YYYY HH:mm')}*/}
                {/*    </TableCell>*/}
                {/*    <TableCell>{item.patient.name}</TableCell>*/}
                {/*    <TableCell className={styles.patientNameLabel}>*/}
                {/*      <a href={`tel:${item.patient.phone.replace('+', '')}`}>*/}
                {/*        {item.patient.phone}*/}
                {/*      </a>*/}
                {/*    </TableCell>*/}
                {/*    <TableCell>{item.doctor.name}</TableCell>*/}
                {/*    <TableCell>{item.guide ? item.guide.name : '-'}</TableCell>*/}
                {/*    <TableCell size='small' align='right'>*/}
                {/*      <span*/}
                {/*        className={styles.statusLabel}*/}
                {/*        style={{*/}
                {/*          color: colorForStatus(item.status),*/}
                {/*          backgroundColor: `${colorForStatus(item.status)}1A`,*/}
                {/*        }}*/}
                {/*      >*/}
                {/*        {titleForStatus(item.status)}*/}
                {/*      </span>*/}
                {/*    </TableCell>*/}
                {/*    <TableCell size='small' align='right'>*/}
                {/*      {item.comment}*/}
                {/*    </TableCell>*/}
                {/*  </TableRow>*/}
                {/*))}*/}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <div className={styles.pageFooter}>
        <Button
          variant='text'
          onClick={handleDownloadFile}
          classes={{
            root: styles.primaryButton,
            disabled: styles.buttonDisabled,
          }}
        >
          <IconDownload />
          {textForKey('export_excel')}
        </Button>
        <TablePagination
          classes={{ root: styles.tablePagination }}
          rowsPerPageOptions={[25, 50, 100]}
          colSpan={4}
          count={appointmentsReports?.total}
          rowsPerPage={request.itemsPerPage}
          labelRowsPerPage={textForKey('rows per page')}
          page={request.page}
          component='div'
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onPageChange={handleChangePage}
        />
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
