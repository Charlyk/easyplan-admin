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
import moment from 'moment-timezone';
import { parse } from 'query-string';
import { Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import EasyDateRangePicker from '../../../../components/EasyDateRangePicker';
import { setPatientDetails } from '../../../../redux/actions/actions';
import {
  clinicDoctorsSelector,
  clinicServicesSelector,
} from '../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { Action, ScheduleStatuses } from '../../../../utils/constants';
import {
  generateReducerActions,
  logUserAction,
} from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter/StatisticFilter';
import styles from './ServicesStatistics.module.scss';

const reducerTypes = {
  setSelectedDoctor: 'setSelectedDoctor',
  setSelectedService: 'setSelectedService',
  setSelectedStatus: 'setSelectedStatus',
  setStatistics: 'setStatistics',
  setIsLoading: 'setIsLoading',
  setShowRangePicker: 'setShowRangePicker',
  setDateRange: 'setDateRange',
  setUrlParams: 'setUrlParams',
  setPage: 'setPage',
  setRowsPerPage: 'setRowsPerPage',
};

const reducerActions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setSelectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    case reducerTypes.setSelectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.setSelectedStatus:
      return { ...state, selectedStatus: action.payload };
    case reducerTypes.setStatistics:
      return {
        ...state,
        statistics: action.payload.data,
        totalItems: action.payload.total,
      };
    case reducerTypes.setDoctors:
      return { ...state, doctors: action.payload };
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setShowRangePicker:
      return { ...state, showRangePicker: action.payload };
    case reducerTypes.setDateRange:
      return { ...state, dateRange: action.payload };
    case reducerTypes.setUrlParams: {
      const { doctorId, status, startDate, endDate } = action.payload;
      const fromDate = startDate
        ? moment(startDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        : moment().startOf('month').toDate();
      const toDate = endDate
        ? moment(endDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        : moment().endOf('month').toDate();
      return {
        ...state,
        selectedDoctor: { id: doctorId || -1 },
        selectedStatus: { id: status || 'All' },
        dateRange: [fromDate, toDate],
        params: action.payload,
      };
    }
    case reducerTypes.setPage:
      return { ...state, page: action.payload };
    case reducerTypes.setRowsPerPage:
      return { ...state, rowsPerPage: parseInt(action.payload), page: 0 };
  }
};

const initialState = {
  selectedDoctor: { id: -1 },
  selectedService: { id: -1 },
  selectedStatus: { id: 'All' },
  statistics: [],
  doctors: [],
  services: [],
  isLoading: false,
  showRangePicker: false,
  urlParams: {},
  totalItems: 0,
  dateRange: [
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ],
  page: 0,
  rowsPerPage: 25,
};

const ServicesStatistics = () => {
  const dispatch = useDispatch();
  const doctors = useSelector(clinicDoctorsSelector);
  const services = useSelector(clinicServicesSelector);
  const location = useLocation();
  const params = parse(location.search);
  const pickerRef = useRef(null);

  const [
    {
      isLoading,
      statistics,
      selectedDoctor,
      selectedService,
      selectedStatus,
      showRangePicker,
      totalItems,
      params: urlParams,
      dateRange: [startDate, endDate],
      page,
      rowsPerPage,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  if (!isEqual(params, urlParams)) {
    localDispatch(reducerActions.setUrlParams(params));
  }

  useEffect(() => {
    fetchData();
  }, [urlParams, page, rowsPerPage]);

  const fetchData = async () => {
    localDispatch(reducerActions.setIsLoading(true));
    const requestData = {
      fromDate: startDate,
      toDate: endDate,
      doctorId: selectedDoctor?.id || -1,
      serviceId: selectedService?.id || -1,
      status: selectedStatus?.id || 'All',
    };
    logUserAction(
      Action.ViewServicesStatistics,
      JSON.stringify({ filter: requestData }),
    );
    const response = await dataAPI.fetchServicesStatistics(
      requestData,
      page,
      rowsPerPage,
    );
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(reducerActions.setStatistics(response.data));
    }
    localDispatch(reducerActions.setIsLoading(false));
  };

  const handleFilterSubmit = () => {
    fetchData();
  };

  const handleDatePickerOpen = () => {
    localDispatch(reducerActions.setShowRangePicker(true));
  };

  const handleDatePickerClose = () => {
    localDispatch(reducerActions.setShowRangePicker(false));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(
      reducerActions.setDateRange([
        startDate,
        moment(endDate).endOf('day').toDate(),
      ]),
    );
  };

  const handleDoctorChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(reducerActions.setSelectedDoctor({ id: -1 }));
      return;
    }
    const doctor = doctors.find((it) => it.id === newValue);
    localDispatch(reducerActions.setSelectedDoctor(doctor));
  };

  const handleServiceChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(reducerActions.setSelectedService({ id: -1 }));
      return;
    }
    const service = services.find((it) => it.id === newValue);
    localDispatch(reducerActions.setSelectedService(service));
  };

  const handleStatusChange = (event) => {
    const newValue = event.target.value;
    if (newValue === 'All') {
      localDispatch(reducerActions.setSelectedStatus({ id: 'All' }));
      return;
    }
    const status = ScheduleStatuses.find((it) => it.id === newValue);
    localDispatch(reducerActions.setSelectedStatus(status));
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
    localDispatch(reducerActions.setPage(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    localDispatch(reducerActions.setRowsPerPage(event.target.value));
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
              >{`${doctor.firstName} ${doctor.lastName}`}</option>
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
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
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
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={textForKey('Rows per page')}
        page={page}
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

export default ServicesStatistics;
