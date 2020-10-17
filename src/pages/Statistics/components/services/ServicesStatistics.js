import React, { useEffect, useReducer, useRef } from 'react';

import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { parse } from 'query-string';
import { Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import EasyDateRangePicker from '../../../../components/EasyDateRangePicker';
import {
  clinicDoctorsSelector,
  clinicServicesSelector,
} from '../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { Statuses } from '../../../../utils/constants';
import { generateReducerActions } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';

const reducerTypes = {
  setSelectedDoctor: 'setSelectedDoctor',
  setSelectedService: 'setSelectedService',
  setSelectedStatus: 'setSelectedStatus',
  setStatistics: 'setStatistics',
  setIsLoading: 'setIsLoading',
  setShowRangePicker: 'setShowRangePicker',
  setDateRange: 'setDateRange',
  setUrlParams: 'setUrlParams',
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
      return { ...state, statistics: action.payload };
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
        : moment()
            .startOf('day')
            .toDate();
      const toDate = endDate
        ? moment(endDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        : moment()
            .endOf('day')
            .toDate();
      return {
        ...state,
        selectedDoctor: { id: doctorId || 'all' },
        selectedStatus: { id: status || 'all' },
        dateRange: [fromDate, toDate],
        params: action.payload,
      };
    }
  }
};

const initialState = {
  selectedDoctor: { id: 'all' },
  selectedService: { id: 'all' },
  selectedStatus: { id: 'all' },
  statistics: [],
  doctors: [],
  services: [],
  isLoading: false,
  showRangePicker: false,
  params: {},
  dateRange: [
    moment()
      .startOf('month')
      .toDate(),
    moment()
      .endOf('month')
      .toDate(),
  ],
};

const ServicesStatistics = () => {
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
      params: urlParams,
      dateRange: [startDate, endDate],
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    setTimeout(fetchData, 50);
  }, [urlParams]);

  useEffect(() => {
    if (!isEqual(params, urlParams)) {
      localDispatch(reducerActions.setUrlParams(params));
    }
  }, [params]);

  const fetchData = async () => {
    localDispatch(reducerActions.setIsLoading(true));
    const response = await dataAPI.fetchServicesStatistics(
      startDate,
      endDate,
      selectedDoctor?.id || 'all',
      selectedService?.id || 'all',
      selectedStatus?.id || 'all',
    );
    if (response.isError) {
      console.error(response.message);
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

  const handleDateChange = data => {
    const { startDate, endDate } = data.range1;
    localDispatch(
      reducerActions.setDateRange([
        startDate,
        moment(endDate)
          .endOf('day')
          .toDate(),
      ]),
    );
  };

  const handleDoctorChange = event => {
    const newValue = event.target.value;
    if (newValue === 'all') {
      localDispatch(reducerActions.setSelectedDoctor({ id: 'all' }));
      return;
    }
    const doctor = doctors.find(it => it.id === newValue);
    localDispatch(reducerActions.setSelectedDoctor(doctor));
  };

  const handleServiceChange = event => {
    const newValue = event.target.value;
    if (newValue === 'all') {
      localDispatch(reducerActions.setSelectedService({ id: 'all' }));
      return;
    }
    const service = services.find(it => it.id === newValue);
    localDispatch(reducerActions.setSelectedService(service));
  };

  const handleStatusChange = event => {
    const newValue = event.target.value;
    if (newValue === 'all') {
      localDispatch(reducerActions.setSelectedStatus({ id: 'all' }));
      return;
    }
    const status = Statuses.find(it => it.id === newValue);
    localDispatch(reducerActions.setSelectedStatus(status));
  };

  const titleForStatus = status => {
    const data = Statuses.find(it => it.id === status);
    return data?.name;
  };

  const colorForStatus = status => {
    const data = Statuses.find(it => it.id === status);
    return data?.color;
  };

  return (
    <div className='statistics-services'>
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
            <option value='all'>{textForKey('All services')}</option>
            {services.map(service => (
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
            <option value='all'>{textForKey('All doctors')}</option>
            {doctors.map(doctor => (
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
            <option value='all'>{textForKey('All statuses')}</option>
            {Statuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </StatisticFilter>
      <div className='data-container'>
        {isLoading && statistics.length === 0 && (
          <Spinner animation='border' className='statistics-loading-spinner' />
        )}
        {!isLoading && statistics.length === 0 && (
          <span className='no-data-label'>{textForKey('No results')}</span>
        )}
        {statistics.length > 0 && (
          <table className='data-table'>
            <thead>
              <tr>
                <td>{textForKey('Date')}</td>
                <td>{textForKey('Doctor')}</td>
                <td>{textForKey('Service')}</td>
                <td>{textForKey('Patient')}</td>
                <td>{textForKey('Status')}</td>
              </tr>
            </thead>
            <tbody>
              {statistics.map(item => (
                <tr key={item.id}>
                  <td>
                    {moment(item.dateAndTime).format('DD MMM YYYY HH:mm')}
                  </td>
                  <td>{item.doctorName}</td>
                  <td>{item.serviceName}</td>
                  <td>{item.patientName}</td>
                  <td>
                    <span
                      className='status-label'
                      style={{
                        color: colorForStatus(item.status),
                        backgroundColor: `${colorForStatus(item.status)}1A`,
                      }}
                    >
                      {titleForStatus(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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
