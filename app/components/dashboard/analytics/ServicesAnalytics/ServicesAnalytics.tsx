import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import { Role, ScheduleStatuses } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { setPatientDetails } from 'redux/actions/actions';
import { currentClinicSelector } from 'redux/selectors/appDataSelector';
import { ServicesStatisticResponse, ScheduleStatus } from 'types';
import styles from './ServicesAnalytics.module.scss';
import reducer, {
  initialState,
  setSelectedDoctors,
  setSelectedServices,
  setSelectedStatuses,
  setDateRange,
  setDoctors,
  setInitialQuery,
  setPage,
  setRowsPerPage,
  setServices,
  setShowRangePicker,
} from './ServicesAnalytics.reducer';

const EasyDateRangePicker = dynamic(
  () => import('app/components/common/EasyDateRangePicker'),
);
const StatisticFilter = dynamic(() => import('../StatisticFilter'));

interface ServicesAnalyticsQuery {
  page: string | number;
  rowsPerPage: string | number;
  statuses?: ScheduleStatus[];
  doctorsId?: string[] | number[];
  servicesId?: string[] | number[];
  fromDate: string;
  toDate: string;
}

interface ServicesAnalyticsProps {
  statistics: ServicesStatisticResponse;
  query: ServicesAnalyticsQuery;
}

const ServicesAnalytics: React.FC<ServicesAnalyticsProps> = ({
  statistics: { data: statistics, total: totalItems },
  query: initialQuery,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pickerRef = useRef(null);
  const currentClinic = useSelector(currentClinicSelector);
  const doctors = useMemo(() => {
    return orderBy(
      currentClinic.users.filter((user) => user.roleInClinic === Role.doctor),
      ['isHidden', 'fullName'],
      ['asc', 'asc'],
    ).map(({ id, fullName, isHidden }) => ({
      id,
      name: `${fullName} ${isHidden ? `(${textForKey('Fired')})` : ''}`,
    }));
  }, [currentClinic]);
  const services = sortBy(currentClinic.services, (service) =>
    service.name.toLowerCase(),
  );

  const [
    {
      isLoading,
      showRangePicker,
      selectedDoctors,
      selectedServices,
      selectedStatuses,
      dateRange: [startDate, endDate],
      page,
      rowsPerPage,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(setInitialQuery(initialQuery));
  }, []);

  useEffect(() => {
    if (currentClinic == null) {
      return;
    }
    const doctors = currentClinic.users.filter(
      (user) => user.roleInClinic === Role.doctor,
    );
    localDispatch(setDoctors(doctors));
    localDispatch(setServices(currentClinic.services));
  }, [currentClinic]);

  const handleFilterUpdated = async (p = page, rp = rowsPerPage) => {
    const query: Record<string, string> = {
      page: String(p),
      rowsPerPage: String(rp),
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
      statuses: selectedStatuses.map((status) => status.id).join(','),
    };

    if (!selectedDoctors.some((doctor) => doctor.id === -1)) {
      query.doctorsId = selectedDoctors.map((doctor) => doctor.id).join(',');
    }

    if (!selectedServices.some((services) => services.id === -1)) {
      query.servicesId = selectedServices
        .map((service) => service.id)
        .join(',');
    }

    if (isEqual(query, initialQuery)) {
      return;
    }

    const queryString = new URLSearchParams(query).toString();
    await router.replace(`/analytics/services?${queryString}`);
  };

  const handleFilterSubmit = async () => {
    await handleFilterUpdated(0);
  };

  const handleDatePickerOpen = () => {
    localDispatch(setShowRangePicker(true));
  };

  const handleDatePickerClose = () => {
    localDispatch(setShowRangePicker(false));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(
      setDateRange([startDate, moment(endDate).endOf('day').toDate()]),
    );
  };

  const handleDoctorChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedDoctors([{ id: -1 }]));
      return;
    }
    const newDoctors = doctors.filter((doctor) =>
      newValue.some((item) => item === doctor.id),
    );
    localDispatch(
      setSelectedDoctors(newDoctors.filter((doctor) => doctor.id !== -1)),
    );
  };

  const handleServiceChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedServices([{ id: -1 }]));
      return;
    }
    const newServices = services.filter((service) =>
      newValue.some((item) => item === service.id),
    );
    localDispatch(
      setSelectedServices(newServices.filter((service) => service.id !== -1)),
    );
  };

  const handleStatusChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === 'All') {
      localDispatch(setSelectedStatuses([{ id: 'All' }]));
      return;
    }
    const newStatuses = ScheduleStatuses.filter((status) =>
      newValue.some((item) => item === status.id),
    );
    localDispatch(
      setSelectedStatuses(newStatuses.filter((status) => status.id !== 'All')),
    );
  };

  const titleForStatus = (status) => {
    const data = ScheduleStatuses.find((it) => it.id === status);
    return data?.name;
  };

  const colorForStatus = (status) => {
    const data = ScheduleStatuses.find((it) => it.id === status);
    return data?.color;
  };

  const handleChangePage = async (event, newPage) => {
    localDispatch(setPage(newPage));
    await handleFilterUpdated(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const rows = parseInt(event.target.value);
    localDispatch(setRowsPerPage(rows));
    await handleFilterUpdated(page, rows);
  };

  const handlePatientClick = (patientId) => () => {
    dispatch(
      setPatientDetails({
        show: true,
        patientId,
        canDelete: false,
      }),
    );
  };

  return (
    <div className={styles['statistics-services']}>
      <StatisticFilter onUpdate={handleFilterSubmit} isLoading={isLoading}>
        <EASSelect
          multiple
          checkable
          rootClass={styles.selectControlRoot}
          label={textForKey('Services')}
          labelId='services-select-label'
          options={services}
          value={selectedServices.map((item) => item.id)}
          defaultOption={{
            id: -1,
            name: textForKey('All services'),
          }}
          onChange={handleServiceChange}
        />
        <EASSelect
          multiple
          checkable
          rootClass={styles.selectControlRoot}
          label={textForKey('Doctors')}
          labelId='doctors-select-label'
          options={doctors}
          value={selectedDoctors.map((item) => item.id)}
          defaultOption={{
            id: -1,
            name: textForKey('All doctors'),
          }}
          onChange={handleDoctorChange}
        />
        <EASTextField
          ref={pickerRef}
          containerClass={styles.selectControlRoot}
          fieldLabel={textForKey('Period')}
          readOnly
          onPointerUp={handleDatePickerOpen}
          value={`${moment(startDate).format('DD MMM YYYY')} - ${moment(
            endDate,
          ).format('DD MMM YYYY')}`}
        />
        <EASSelect
          multiple
          checkable
          rootClass={styles.selectControlRoot}
          label={textForKey('Statuses')}
          labelId='statuses-select-label'
          options={ScheduleStatuses}
          value={selectedStatuses.map((item) => item.id)}
          defaultOption={{
            id: 'All',
            name: textForKey('All statuses'),
          }}
          onChange={handleStatusChange}
        />
      </StatisticFilter>
      <div className={styles['data-container']}>
        {isLoading && statistics.length === 0 && (
          <div className={styles.progressWrapper}>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
        {!isLoading && statistics.length === 0 && (
          <span className={styles['no-data-label']}>
            {textForKey('No results')}
          </span>
        )}
        {statistics.length > 0 && (
          <TableContainer classes={{ root: styles['table-container'] }}>
            <Table classes={{ root: styles['data-table'] }}>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('Date')}</TableCell>
                  <TableCell>{textForKey('Doctor')}</TableCell>
                  <TableCell>{textForKey('Service')}</TableCell>
                  <TableCell>{textForKey('Patient')}</TableCell>
                  <TableCell>{textForKey('Phone number')}</TableCell>
                  <TableCell>{textForKey('Status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {moment(item.dateAndTime).format('DD MMM YYYY HH:mm')}
                    </TableCell>
                    <TableCell>{item.doctor}</TableCell>
                    <TableCell>{item.serviceName}</TableCell>
                    <TableCell
                      className={styles['patient-name-label']}
                      onClick={handlePatientClick(item.patientId)}
                    >
                      {item.patient}
                    </TableCell>
                    <TableCell
                      className={styles['patient-name-label']}
                      onClick={handlePatientClick(item.patientId)}
                    >
                      <a
                        href={`tel:${item.patientPhoneNumber.replace('+', '')}`}
                      >
                        {item.patientPhoneNumber}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span
                        className={styles['status-label']}
                        style={{
                          color: colorForStatus(item.status),
                          backgroundColor: `${colorForStatus(item.status)}1A`,
                        }}
                      >
                        {titleForStatus(item.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <TablePagination
        classes={{ root: styles['table-pagination'] }}
        rowsPerPageOptions={[25, 50, 100]}
        colSpan={4}
        count={totalItems}
        rowsPerPage={parseInt(String(rowsPerPage))}
        labelRowsPerPage={textForKey('Rows per page')}
        page={parseInt(String(page))}
        component='div'
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: true,
        }}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onPageChange={handleChangePage}
      />
      <EasyDateRangePicker
        onChange={handleDateChange}
        onClose={handleDatePickerClose}
        dateRange={{ startDate, endDate }}
        open={showRangePicker}
        pickerAnchor={pickerRef.current}
      />
    </div>
  );
};

export default ServicesAnalytics;
