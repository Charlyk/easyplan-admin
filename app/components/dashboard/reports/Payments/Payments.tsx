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
import formattedAmount from 'app/utils/formattedAmount';
import { baseApiUrl } from 'eas.config';
import {
  isPaymentReportsLoadingSelector,
  paymentReportsDataSelector,
} from 'redux/selectors/paymentReportsSelector';
import { fetchPaymentReports } from 'redux/slices/paymentReportsSlice';
import { PaymentReportsGetRequest } from 'types/api';
import {
  authTokenSelector,
  currentClinicSelector,
} from '../../../../../redux/selectors/appDataSelector';
import { HeaderKeys } from '../../../../utils/constants';
import styles from './Payments.module.scss';

interface PaymentsQuery {
  page: number;
  itemsPerPage: number;
  startDate: string;
  endDate: string;
}

interface PaymentsProps {
  query: PaymentsQuery;
}

const Payments: React.FC<PaymentsProps> = ({ query }) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const router = useRouter();
  const payments = useSelector(paymentReportsDataSelector);
  const isLoading = useSelector(isPaymentReportsLoadingSelector);
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
    dispatch(fetchPaymentReports(request));
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
      `/reports/payments?page=${page}&startDate=${startDateStr}&endDate=${endDateStr}&itemsPerPage=${rows}`,
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
        `${baseApiUrl}/reports/payments/download?startDate=${startDate}&endDate=${endDate}`,
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
    <div className={styles.reportPayments}>
      <StatisticFilter onUpdate={handleFilterSubmit} isLoading={isLoading}>
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
        {isLoading && payments.data.length === 0 && (
          <div className={styles.progressWrapper}>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
        {!isLoading && payments.data.length === 0 && (
          <span className={styles.noDataLabel}>{textForKey('no results')}</span>
        )}
        {payments.data.length > 0 && (
          <TableContainer classes={{ root: styles['table-container'] }}>
            <Table classes={{ root: styles['data-table'] }}>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('date')}</TableCell>
                  <TableCell>{textForKey('patient')}</TableCell>
                  <TableCell>{textForKey('phone number')}</TableCell>
                  <TableCell>{textForKey('user')}</TableCell>
                  <TableCell>{textForKey('amount')}</TableCell>
                  <TableCell align='right'>
                    {textForKey('payment_method')}
                  </TableCell>
                  <TableCell align='right'>{textForKey('services')}</TableCell>
                  <TableCell align='right'>
                    {textForKey('user_comment')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {moment(item.created).format('DD MMM YYYY HH:mm')}
                    </TableCell>
                    <TableCell>
                      {item.patient.firstName} {item.patient.lastName}
                    </TableCell>
                    <TableCell className={styles['patient-name-label']}>
                      <a
                        href={`tel:${item.patient.phoneWithCode.replace(
                          '+',
                          '',
                        )}`}
                      >
                        {item.patient.phoneWithCode}
                      </a>
                    </TableCell>
                    <TableCell>
                      {item.user.firstName} {item.user.lastName}
                    </TableCell>
                    <TableCell>
                      {formattedAmount(item.amount, item.currency)}
                    </TableCell>
                    <TableCell align='right'>{item.paymentMethod}</TableCell>
                    <TableCell size='small' align='right'>
                      {item.comment}
                    </TableCell>
                    <TableCell size='small' align='right'>
                      {item.userComment}
                    </TableCell>
                  </TableRow>
                ))}
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
          count={payments.total}
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

export default Payments;
