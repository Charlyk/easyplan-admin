import React, { useEffect, useReducer, useRef } from 'react';

import moment from 'moment';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import EasyDateRangePicker from '../../../../components/EasyDateRangePicker';
import {
  clinicDoctorsSelector,
  clinicServicesSelector,
} from '../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { generateReducerActions } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';

const initialState = {
  isLoading: false,
  selectedDoctor: { id: 'all' },
  selectedService: { id: 'all' },
  dateRange: [
    moment()
      .startOf('month')
      .toDate(),
    moment()
      .endOf('month')
      .toDate(),
  ],
  doctors: [],
  services: [],
  statistics: [],
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setSelectedDoctor: 'setSelectedDoctor',
  setSelectedService: 'setSelectedService',
  setDateRange: 'setDateRange',
  setDoctors: 'setDoctors',
  setServices: 'setServices',
  setStatistics: 'setStatistics',
  setShowRangePicker: 'setShowRangePicker',
};

const reducerActions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setSelectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    case reducerTypes.setSelectedService:
      return { ...state, selectedService: action.payload };
    case reducerTypes.setDateRange:
      return { ...state, dateRange: action.payload };
    case reducerTypes.setDoctors:
      return { ...state, doctors: action.payload };
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setStatistics:
      return { ...state, statistics: action.payload };
    case reducerTypes.setShowRangePicker:
      return { ...state, showRangePicker: action.payload };
  }
};

const DoctorsStatistics = () => {
  const pickerRef = useRef(null);
  const doctors = useSelector(clinicDoctorsSelector);
  const services = useSelector(clinicServicesSelector);
  const [
    {
      isLoading,
      selectedDoctor,
      selectedService,
      showRangePicker,
      dateRange: [startDate, endDate],
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchData();
  }, []);

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

  const fetchData = async () => {
    localDispatch(reducerActions.setIsLoading(true));
    const response = await dataAPI.fetchDoctorsStatistics(
      startDate,
      endDate,
      selectedDoctor?.id || 'all',
      selectedService?.id || 'all',
    );
    if (response.isError) {
      console.error(response.message);
    } else {
      console.log(response.data);
      localDispatch(reducerActions.setStatistics(response.data));
    }
    localDispatch(reducerActions.setIsLoading(false));
  };

  return (
    <div className='statistics-doctors'>
      <StatisticFilter isLoading={isLoading}>
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>{textForKey('Services')}</Form.Label>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
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
          <Form.Label>{textForKey('Doctors')}</Form.Label>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
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
      </StatisticFilter>
      <div className='data-container'>
        <table className='data-table'>
          <thead>
            <tr>
              <td>{textForKey('Doctor')}</td>
              <td>{textForKey('Total income')}</td>
              <td>{textForKey('Doctor part')}</td>
              <td>{textForKey('Total profit')}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
          </tbody>
        </table>
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

export default DoctorsStatistics;
