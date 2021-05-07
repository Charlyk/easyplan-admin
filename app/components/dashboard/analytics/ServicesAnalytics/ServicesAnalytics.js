import React, { useEffect, useReducer, useRef } from 'react';

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination, CircularProgress,
} from '@material-ui/core';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
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
import { reducer, initialState, actions } from "./ServicesAnalytics.reducer";

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
  const doctors = sortBy(
    currentClinic.users.filter(user => user.roleInClinic === Role.doctor),
    user => user.fullName.toLowerCase(),
  );
  const services = sortBy(currentClinic.services, service => service.name.toLowerCase());

  const [
    {
      isLoading,
      selectedDoctor,
      selectedService,
      selectedStatus,
      showRangePicker,
      dateRange: [startDate, endDate],
      page,
      rowsPerPage,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(actions.setInitialQuery(initialQuery));
  }, []);

  useEffect(() => {
    if (currentClinic == null) {
      return;
    }
    const doctors = currentClinic.users.filter(user => user.roleInClinic === Role.doctor);
    localDispatch(actions.setDoctors(doctors));
    localDispatch(actions.setServices(currentClinic.services));
  }, [currentClinic]);

  const handleFilterUpdated = (p = page, rp = rowsPerPage) => {
    const query = {
      page: p,
      rowsPerPage: rp,
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
      status: selectedStatus.id,
    }

    if (selectedDoctor.id !== -1) {
      query.doctorId = selectedDoctor.id;
    }

    if (selectedService.id !== -1) {
      query.serviceId = selectedService.id;
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
    localDispatch(actions.setShowRangePicker(true));
  };

  const handleDatePickerClose = () => {
    localDispatch(actions.setShowRangePicker(false));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(
      actions.setDateRange([
        startDate,
        moment(endDate).endOf('day').toDate(),
      ]),
    );
  };

  const handleDoctorChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(actions.setSelectedDoctor({ id: -1 }));
      return;
    }
    const doctor = doctors.find((it) => it.id === newValue);
    localDispatch(actions.setSelectedDoctor(doctor));
  };

  const handleServiceChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(actions.setSelectedService({ id: -1 }));
      return;
    }
    const service = services.find((it) => it.id === newValue);
    localDispatch(actions.setSelectedService(service));
  };

  const handleStatusChange = (event) => {
    const newValue = event.target.value;
    if (newValue === 'All') {
      localDispatch(actions.setSelectedStatus({ id: 'All' }));
      return;
    }
    const status = ScheduleStatuses.find((it) => it.id === newValue);
    localDispatch(actions.setSelectedStatus(status));
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
    localDispatch(actions.setPage(newPage));
    handleFilterUpdated(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const rows = parseInt(event.target.value);
    localDispatch(actions.setRowsPerPage(rows));
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
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>{textForKey('Service')}</Form.Label>
          <Form.Control
            onChange={handleServiceChange}
            disabled={isLoading}
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            value={selectedService.id}
            custom
          >
            <option value={-1}>{textForKey('All services')}</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>{textForKey('Doctor')}</Form.Label>
          <Form.Control
            onChange={handleDoctorChange}
            disabled={isLoading}
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            value={selectedDoctor.id}
            custom
          >
            <option value={-1}>{textForKey('All doctors')}</option>
            {doctors.map((doctor) => (
              <option
                key={doctor.id}
                value={doctor.id}
              >
                {`${doctor.firstName} ${doctor.lastName}`} {doctor.isHidden ? `(${textForKey('Fired')})` : ''}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
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
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>{textForKey('Status')}</Form.Label>
          <Form.Control
            onChange={handleStatusChange}
            disabled={isLoading}
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            value={selectedStatus.id}
            custom
          >
            <option value='All'>{textForKey('All statuses')}</option>
            {ScheduleStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
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
