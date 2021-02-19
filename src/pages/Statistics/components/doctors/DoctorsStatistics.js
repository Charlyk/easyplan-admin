import React, { useEffect, useReducer, useRef } from 'react';

import sum from 'lodash/sum';
import moment from 'moment-timezone';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import EasyDateRangePicker from '../../../../components/EasyDateRangePicker';
import {
  clinicDoctorsSelector,
  clinicServicesSelector,
} from '../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { Action } from '../../../../utils/constants';
import {
  generateReducerActions,
  logUserAction,
} from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';

const initialState = {
  isLoading: false,
  selectedDoctor: { id: -1 },
  selectedService: { id: -1 },
  showRangePicker: false,
  dateRange: [
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ],
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
      statistics,
      dateRange: [startDate, endDate],
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchData();
  }, []);

  const handleServiceChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(reducerActions.setSelectedService({ id: newValue }));
      return;
    }
    const service = services.find((item) => item.id === newValue);
    localDispatch(reducerActions.setSelectedService(service));
  };

  const handleDoctorChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(reducerActions.setSelectedDoctor({ id: newValue }));
      return;
    }
    const doctor = doctors.find((item) => item.id === newValue);
    localDispatch(reducerActions.setSelectedDoctor(doctor));
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

  const fetchData = async () => {
    localDispatch(reducerActions.setIsLoading(true));
    const requestData = {
      fromDate: startDate,
      toDate: endDate,
      doctorId: selectedDoctor?.id || -1,
      serviceId: selectedService?.id || -1,
    };
    logUserAction(
      Action.ViewDoctorsStatistics,
      JSON.stringify({ filter: requestData }),
    );
    const response = await dataAPI.fetchDoctorsStatistics(requestData);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      localDispatch(reducerActions.setStatistics(response.data));
    }
    localDispatch(reducerActions.setIsLoading(false));
  };

  return (
    <div className='statistics-doctors'>
      <StatisticFilter isLoading={isLoading} onUpdate={fetchData}>
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>{textForKey('Services')}</Form.Label>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleServiceChange}
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
          <Form.Label>{textForKey('Doctors')}</Form.Label>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleDoctorChange}
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
      </StatisticFilter>
      <div className='data-container'>
        {!isLoading && statistics.length === 0 && (
          <span className='no-data-label'>{textForKey('No results')}</span>
        )}
        {statistics.length > 0 && (
          <table className='data-table'>
            <thead>
              <tr>
                <td>{textForKey('Doctor')}</td>
                <td>{textForKey('Total income')}</td>
                <td>{textForKey('Doctor part')}</td>
                <td>{textForKey('Clinic profit')}</td>
              </tr>
            </thead>
            <tbody>
              {statistics.map((item) => (
                <tr key={item.id}>
                  <td>{item.user.fullName}</td>
                  <td>{Math.round(item.totalAmount)} MDL</td>
                  <td>{Math.round(item.doctorAmount)} MDL</td>
                  <td>{Math.round(item.clinicAmount)} MDL</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td />
                <td />
                <td />
                <td align='left'>
                  {textForKey('Total')}:{' '}
                  {Math.round(sum(statistics.map((it) => it.clinicAmount)))} MDL
                </td>
              </tr>
            </tfoot>
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

export default DoctorsStatistics;
