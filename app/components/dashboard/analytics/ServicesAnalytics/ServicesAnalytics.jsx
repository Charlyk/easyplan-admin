import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import dynamic from 'next/dynamic';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { setPatientDetails } from '../../../../../redux/actions/actions';
import { Role, ScheduleStatuses } from '../../../../utils/constants';
import handleRequestError from '../../../../../utils/handleRequestError';
import redirectToUrl from '../../../../../utils/redirectToUrl';
import redirectUserTo from '../../../../../utils/redirectUserTo';
import { textForKey } from '../../../../../utils/localization';
import { getServicesStatistics } from "../../../../../middleware/api/analytics";
import { fetchAppData } from "../../../../../middleware/api/initialization";
import parseCookies from "../../../../../utils/parseCookies";
import EASSelect from "../../../common/EASSelect";
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
} from "./ServicesAnalytics.reducer";
import styles from './ServicesAnalytics.module.scss';
import EASTextField from "../../../common/EASTextField";

const EasyDateRangePicker = dynamic(() => import('../../../common/EasyDateRangePicker'));
const StatisticFilter = dynamic(() => import('../StatisticFilter'));

const ServicesAnalytics = (
  {
    currentClinic,
    statistics: { data: statistics, total: totalItems },
    query: initialQuery,
  }
) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const pickerRef = useRef(null);
  const doctors = useMemo(() => {
    return orderBy(
      currentClinic.users.filter(user => user.roleInClinic === Role.doctor),
      ['isHidden', 'fullName'],
      ['asc', 'asc']
    ).map(({ id, fullName, isHidden }) => ({
      id,
      name: `${fullName} ${isHidden ? `(${textForKey('Fired')})` : ''}`
    }));
  }, [currentClinic])
  const services = sortBy(currentClinic.services, service => service.name.toLowerCase());

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
    const doctors = currentClinic.users.filter(user => user.roleInClinic === Role.doctor);
    localDispatch(setDoctors(doctors));
    localDispatch(setServices(currentClinic.services));
  }, [currentClinic]);

  const handleFilterUpdated = (p = page, rp = rowsPerPage) => {
    const query = {
      page: p,
      rowsPerPage: rp,
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
      statuses: selectedStatuses.map(status => status.id),
    }

    if (!selectedDoctors.some(doctor => doctor.id === -1)) {
      query.doctorsId = selectedDoctors.map(doctor => doctor.id);
    }

    if (!selectedServices.some(services => services.id === -1)) {
      query.servicesId = selectedServices.map(service => service.id);
    }

    if (isEqual(query, initialQuery)) {
      return;
    }

    const queryString = new URLSearchParams(query).toString();
    router.replace(`/analytics/services?${queryString}`);
  }

  const handleFilterSubmit = () => {
    handleFilterUpdated(0);
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
      setDateRange([
        startDate,
        moment(endDate).endOf('day').toDate(),
      ]),
    );
  };

  const handleDoctorChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1]
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedDoctors([{ id: -1 }]));
      return;
    }
    const newDoctors = doctors.filter((doctor) =>
      newValue.some(item => item === doctor.id)
    );
    localDispatch(setSelectedDoctors(newDoctors.filter(doctor => doctor.id !== -1)));
  };

  const handleServiceChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1]
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedServices([{ id: -1 }]));
      return;
    }
    const newServices = services.filter((service) =>
      newValue.some(item => item === service.id)
    );
    localDispatch(setSelectedServices(newServices.filter(service => service.id !== -1)));
  };

  const handleStatusChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1]
    if (newValue.length === 0 || lastSelected === 'All') {
      localDispatch(setSelectedStatuses([{ id: 'All' }]));
      return;
    }
    const newStatuses = ScheduleStatuses.filter((status) =>
      newValue.some(item => item === status.id)
    );
    localDispatch(setSelectedStatuses(newStatuses.filter(status => status.id !== 'All')));
  };

  const titleForStatus = (status) => {
    const data = ScheduleStatuses.find((it) => it.id === status);
    return data?.name;
  };

  const colorForStatus = (status) => {
    const data = ScheduleStatuses.find((it) => it.id === status);
    return data?.color;
  };

  const handleChangePage = (event, newPage) => {
    localDispatch(setPage(newPage));
    handleFilterUpdated(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const rows = parseInt(event.target.value);
    localDispatch(setRowsPerPage(rows));
    handleFilterUpdated(page, rows);
  };

  const handlePatientClick = (patientId) => () => {
    dispatch(
      setPatientDetails({
        show: true,
        patientId,
        onDelete: null,
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
          labelId="services-select-label"
          options={services}
          value={selectedServices.map(item => item.id)}
          defaultOption={{
            id: -1,
            name: textForKey('All services')
          }}
          onChange={handleServiceChange}
        />
        <EASSelect
          multiple
          checkable
          rootClass={styles.selectControlRoot}
          label={textForKey('Doctors')}
          labelId="doctors-select-label"
          options={doctors}
          value={selectedDoctors.map(item => item.id)}
          defaultOption={{
            id: -1,
            name: textForKey('All doctors')
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
          labelId="statuses-select-label"
          options={ScheduleStatuses}
          value={selectedStatuses.map(item => item.id)}
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
            <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
          </div>
        )}
        {!isLoading && statistics.length === 0 && (
          <span className={styles['no-data-label']}>{textForKey('No results')}</span>
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
        rowsPerPage={parseInt(rowsPerPage)}
        labelRowsPerPage={textForKey('Rows per page')}
        page={parseInt(page)}
        component='div'
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: true,
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
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

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    if (query.page == null) {
      query.page = 0;
    }

    if (query.rowsPerPage == null) {
      query.rowsPerPage = 25;
    }

    if (query.fromDate == null) {
      query.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    }

    if (query.toDate == null) {
      query.toDate = moment().endOf('month').format('YYYY-MM-DD');
    }

    if (query.status == null) {
      query.status = 'All'
    }
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/services');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const { data: statistics } = await getServicesStatistics(query, req.headers);
    return {
      props: {
        authToken,
        statistics,
        query,
        ...appData,
      }
    };
  } catch (error) {
    await handleRequestError(error, req, res)
    return {
      props: {
        statistics: [],
        query: {},
      },
    };
  }
}

export default ServicesAnalytics;
