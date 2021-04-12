import React, { useEffect, useReducer, useRef } from 'react';

import sum from 'lodash/sum';
import moment from 'moment-timezone';
import { Form } from 'react-bootstrap';

import EasyDateRangePicker from '../../../components/common/EasyDateRangePicker';
import {
  generateReducerActions,
  handleRequestError, redirectToUrl, redirectUserTo,
} from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import StatisticFilter from '../../../components/analytics/StatisticFilter';
import { Role } from "../../../utils/constants";
import MainComponent from "../../../components/common/MainComponent";
import sortBy from "lodash/sortBy";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@material-ui/core";
import { useRouter } from "next/router";
import isEqual from "lodash/isEqual";
import { getDoctorsStatistics } from "../../../middleware/api/analytics";
import styles from '../../../styles/ServicesStatistics.module.scss';
import { fetchAppData } from "../../../middleware/api/initialization";
import { parseCookies } from "../../../utils";

const initialState = {
  isLoading: false,
  selectedDoctor: { id: -1 },
  selectedService: { id: -1 },
  showRangePicker: false,
  services: [],
  doctors: [],
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
  setInitialQuery: 'setInitialQuery',
};

const actions = generateReducerActions(reducerTypes);

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
    case reducerTypes.setDoctors:
      return { ...state, doctors: action.payload };
    case reducerTypes.setServices:
      return { ...state, services: action.payload };
    case reducerTypes.setInitialQuery:
      const { doctorId, serviceId, fromDate, toDate } = action.payload;
      return {
        ...state,
        selectedDoctor: { id: parseInt(doctorId) },
        selectedService: { id: parseInt(serviceId) },
        dateRange: [
          moment(fromDate).toDate(),
          moment(toDate).toDate(),
        ]
      }
    default:
      return state
  }
};

const DoctorsStatistics = ({ currentUser, currentClinic, statistics, query: initialQuery, authToken }) => {
  const pickerRef = useRef(null);
  const router = useRouter();
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
      showRangePicker,
      dateRange: [startDate, endDate],
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(actions.setInitialQuery(initialQuery));
  }, []);

  const handleServiceChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(actions.setSelectedService({ id: newValue }));
      return;
    }
    const service = services.find((item) => item.id === newValue);
    localDispatch(actions.setSelectedService(service));
  };

  const handleDoctorChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(actions.setSelectedDoctor({ id: newValue }));
      return;
    }
    const doctor = doctors.find((item) => item.id === newValue);
    localDispatch(actions.setSelectedDoctor(doctor));
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

  const handleFilterSubmit = () => {
    const query = {
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
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
    router.replace(`/analytics/doctors?${queryString}`);
  }

  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/analytics/doctors'
      authToken={authToken}
    >
      <div className={styles['statistics-doctors']}>
        <StatisticFilter isLoading={isLoading} onUpdate={handleFilterSubmit}>
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
        <div className={styles['data-container']}>
          {!isLoading && statistics?.length === 0 && (
            <span className={styles['no-data-label']}>{textForKey('No results')}</span>
          )}
          {statistics?.length > 0 && (
            <TableContainer classes={{ root: styles['table-container'] }}>
              <Table classes={{ root: styles['data-table'] }}>
                <TableHead>
                <TableRow>
                  <TableCell>{textForKey('Doctor')}</TableCell>
                  <TableCell>{textForKey('Total income')}</TableCell>
                  <TableCell>{textForKey('Doctor part')}</TableCell>
                  <TableCell>{textForKey('Clinic profit')}</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {statistics.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.doctor.fullName}</TableCell>
                    <TableCell>{Math.round(item.totalAmount)} MDL</TableCell>
                    <TableCell>{Math.round(item.doctorAmount)} MDL</TableCell>
                    <TableCell>{Math.round(item.clinicAmount)} MDL</TableCell>
                  </TableRow>
                ))}
                </TableBody>
                <TableFooter>
                <TableRow>
                  <TableCell/>
                  <TableCell/>
                  <TableCell/>
                  <TableCell align='left'>
                    {textForKey('Total')}:{' '}
                    {Math.round(sum(statistics.map((it) => it.clinicAmount)))} MDL
                  </TableCell>
                </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
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
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    if (query.fromDate == null) {
      query.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    }
    if (query.toDate == null) {
      query.toDate = moment().endOf('month').format('YYYY-MM-DD');
    }
    if (query.doctorId == null) {
      query.doctorId = -1;
    }
    if (query.serviceId == null) {
      query.serviceId = -1;
    }
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/doctors');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const { data: statistics } = await getDoctorsStatistics(query, req.headers);
    return {
      props: {
        authToken,
        statistics,
        query,
        ...appData,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        statistics: [],
        query: {},
      }
    };
  }
}

export default DoctorsStatistics;
