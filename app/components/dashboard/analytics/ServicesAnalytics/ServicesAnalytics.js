import React, { useEffect, useReducer, useRef } from 'react';

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination, CircularProgress, FormControl, Select, MenuItem, InputLabel,
} from '@material-ui/core';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import EasyDateRangePicker from '../../../../../components/common/EasyDateRangePicker';
import { setPatientDetails } from '../../../../../redux/actions/actions';
import { Role, ScheduleStatuses } from '../../../../utils/constants';
import {
  handleRequestError,
  redirectToUrl,
  redirectUserTo,
} from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';
import { getServicesStatistics } from "../../../../../middleware/api/analytics";
import { fetchAppData } from "../../../../../middleware/api/initialization";
import { parseCookies } from "../../../../../utils";
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
} from "./ServicesAnalytics.reducer";

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
  const doctors = orderBy(
    currentClinic.users.filter(user => user.roleInClinic === Role.doctor),
    ['isHidden', 'fullName'],
    ['desc', 'asc']
  )
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

  const getDoctorFullName = (doctor) => {
    if (doctor.isHidden) {
      return `${doctor.fullName} (${textForKey('Fired')})`
    }
    return doctor.fullName;
  }

  return (
    <div className={styles['statistics-services']}>
      <StatisticFilter onUpdate={handleFilterSubmit} isLoading={isLoading}>
        <FormControl classes={{ root: styles.selectControlRoot }}>
          <InputLabel id="services-select-label">{textForKey('Services')}</InputLabel>
          <Select
            multiple
            disableUnderline
            labelId='services-select-label'
            value={selectedServices.map(item => item.id)}
            onChange={handleServiceChange}
          >
            <MenuItem
              value={-1}
              className={styles.analyticsMenuItemRoot}
            >
              {textForKey('All services')}
            </MenuItem>
            {services.map((service) => (
              <MenuItem
                key={service.id}
                value={service.id}
                className={styles.analyticsMenuItemRoot}
              >
                {service.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl classes={{ root: styles.selectControlRoot }}>
          <InputLabel id="doctors-select-label">{textForKey('Doctors')}</InputLabel>
          <Select
            multiple
            disableUnderline
            labelId='doctors-select-label'
            value={selectedDoctors.map(item => item.id)}
            onChange={handleDoctorChange}
          >
            <MenuItem
              value={-1}
              className={styles.analyticsMenuItemRoot}
            >
              {textForKey('All doctors')}
            </MenuItem>
            {doctors.map((doctor) => (
              <MenuItem
                key={doctor.id}
                value={doctor.id}
                className={styles.analyticsMenuItemRoot}
              >
                {getDoctorFullName(doctor)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Form.Group ref={pickerRef}>
          <Form.Label>{textForKey('Period')}</Form.Label>
          <Form.Control
            disabled={isLoading}
            value={`${moment(startDate).format('DD MMM YYYY')} - ${moment(
              endDate,
            ).format('DD MMM YYYY')}`}
            readOnly
            onClick={handleDatePickerOpen}
          />
        </Form.Group>
        <FormControl classes={{ root: styles.selectControlRoot }}>
          <InputLabel id="statuses-select-label">{textForKey('Statuses')}</InputLabel>
          <Select
            multiple
            disableUnderline
            labelId='statuses-select-label'
            value={selectedStatuses.map(item => item.id)}
            onChange={handleStatusChange}
          >
            <MenuItem
              value='All'
              className={styles.analyticsMenuItemRoot}
            >
              {textForKey('All statuses')}
            </MenuItem>
            {ScheduleStatuses.map((status) => (
              <MenuItem
                key={status.id}
                value={status.id}
                className={styles.analyticsMenuItemRoot}
              >
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
    const { currentUser, currentClinic } = appData;
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
