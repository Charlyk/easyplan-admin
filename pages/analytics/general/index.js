import React, { useEffect, useReducer, useRef } from 'react';

import moment from 'moment-timezone';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/router';

import IconCheckMark from '../../../components/icons/iconCheckMark';
import IconClock from '../../../components/icons/iconClock';
import IconCreditCard from '../../../components/icons/iconCreditCard';
import IconLiabilities from '../../../components/icons/iconLiabilities';
import IconSuccess from '../../../components/icons/iconSuccess';
import IconXPerson from '../../../components/icons/iconXPerson';
import EasyDateRangePicker from '../../../components/common/EasyDateRangePicker';
import { Role, Statuses } from '../../../utils/constants';
import { generateReducerActions, handleRequestError, redirectToUrl, redirectUserTo } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import StatisticFilter from '../../../components/analytics/StatisticFilter';
import IncomeStatisticItem from '../../../components/analytics/general/IncomeStatisticItem';
import StatusItem from '../../../components/analytics/general/StatusItem';
import styles from '../../../styles/Statistics.module.scss';
import MainComponent from "../../../components/common/MainComponent";
import sortBy from "lodash/sortBy";
import { getGeneralStatistics } from "../../../middleware/api/analytics";
import { fetchAppData } from "../../../middleware/api/initialization";
import { parseCookies } from "../../../utils";

const initialState = {
  doctors: [],
  selectedDoctor: { id: -1 },
  showRangePicker: false,
  selectedRange: [
    moment().startOf('week').toDate(),
    moment().endOf('week').toDate(),
  ],
};

const reducerTypes = {
  setDoctors: 'setDoctors',
  setSelectedDoctor: 'setSelectedDoctor',
  setShowRangePicker: 'setShowRangePicker',
  setSelectedRange: 'setSelectedRange',
  setInitialQuery: 'setInitialQuery',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setDoctors:
      return { ...state, doctors: action.payload };
    case reducerTypes.setSelectedDoctor:
      return { ...state, selectedDoctor: action.payload };
    case reducerTypes.setShowRangePicker:
      return { ...state, showRangePicker: action.payload };
    case reducerTypes.setSelectedRange:
      return { ...state, selectedRange: action.payload };
    case reducerTypes.setInitialQuery:
      const { doctorId, fromDate, toDate } = action.payload;
      return {
        ...state,
        selectedDoctor: { id: parseInt(doctorId) },
        selectedRange: [
          moment(fromDate).toDate(),
          moment(toDate).toDate(),
        ],
      };
    default:
      return state;
  }
}

const General = (
  {
    currentUser,
    currentClinic,
    scheduleStats,
    financeStats,
    query: initialQuery,
    authToken,
  }
) => {
  const pickerRef = useRef(null);
  const doctors = sortBy(
    currentClinic?.users?.filter(user => user.roleInClinic === Role.doctor) || [],
    user => user.fullName.toLowerCase(),
  );
  const [
    {
      selectedDoctor,
      showRangePicker,
      selectedRange
    },
    localDispatch
  ] = useReducer(reducer, initialState);
  const router = useRouter();
  const [startDate, endDate] = selectedRange

  useEffect(() => {
    localDispatch(actions.setInitialQuery(initialQuery));
  }, []);

  const handleDoctorChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(actions.setSelectedDoctor({ id: newValue }));
    } else {
      localDispatch(
        actions.setSelectedDoctor(
          doctors.find((item) => item.id === newValue)
        )
      );
    }
  };

  const handleFilterSubmit = async () => {
    const params = {
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
    }
    if (selectedDoctor.id !== -1) {
      params.doctorId = selectedDoctor.id
    }
    const queryString = new URLSearchParams(params).toString()
    router.replace(`/analytics/general?${queryString}`);
  };

  const statuses = scheduleStats?.items || [];

  const getSchedulePercentage = (item) => {
    const percent = (item.count / scheduleStats.total) * 100;
    return Number.isNaN(percent) ? 0 : percent;
  };

  const handleDatePickerClose = () => {
    localDispatch(actions.setShowRangePicker(false));
  };

  const handleDatePickerOpen = () => {
    localDispatch(actions.setShowRangePicker(true));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(actions.setSelectedRange([startDate, endDate]));
  };

  const titleForStatus = (statusItem) => {
    const data = Statuses.find((it) => it.id === statusItem.status);
    return data?.name;
  };

  const iconForStatus = (statusItem) => {
    const data = Statuses.find((it) => it.id === statusItem.status);
    return data?.icon;
  };

  return (
    <MainComponent
      currentPath='/analytics/general'
      currentUser={currentUser}
      currentClinic={currentClinic}
      authToken={authToken}
    >
      <div className={styles['general-statistics']} id='general-statistics'>
        <div className={styles['main-data-container']}>
          <StatisticFilter onUpdate={handleFilterSubmit}>
            <Form.Group>
              <Form.Label>{textForKey('Doctor')}</Form.Label>
              <Form.Control
                onChange={handleDoctorChange}
                as='select'
                className='mr-sm-2'
                id='inlineFormCustomSelect'
                value={selectedDoctor.id}
                custom
              >
                <option value={-1}>{textForKey('All doctors')}</option>
                {doctors.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >{`${item.firstName} ${item.lastName}`}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group ref={pickerRef}>
              <Form.Label>{textForKey('Period')}</Form.Label>
              <Form.Control
                value={`${moment(startDate).format('DD MMM YYYY')} - ${moment(
                  endDate,
                ).format('DD MMM YYYY')}`}
                readOnly
                onClick={handleDatePickerOpen}
              />
            </Form.Group>
          </StatisticFilter>
          <span className={styles['block-title']}>
          {textForKey('Schedules statistics')}
        </span>
          {statuses.length > 0 ? (
            <div className={styles['statuses-container']}>
              {statuses.map((item) => (
                <StatusItem
                  status={item}
                  personsCount={item.count}
                  key={item.status}
                  doctorId={selectedDoctor.id}
                  startDate={startDate}
                  endDate={endDate}
                  title={titleForStatus(item)}
                  percentage={getSchedulePercentage(item)}
                  icon={iconForStatus(item)}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles['right-content-wrapper']}>
          {financeStats != null && (
            <div className={styles['items-wrapper']}>
              <IncomeStatisticItem
                title={textForKey('Expectations')}
                icon={<IconClock/>}
                amount={financeStats?.expectations.amount}
                persons={financeStats?.expectations.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Confirmed')}
                icon={<IconCheckMark/>}
                amount={financeStats?.confirmed.amount}
                persons={financeStats?.confirmed.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Did not came')}
                icon={<IconXPerson/>}
                amount={financeStats?.canceled.amount}
                persons={financeStats?.canceled.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Finished')}
                icon={<IconSuccess fill='#ffffff'/>}
                amount={financeStats?.finished.amount}
                persons={financeStats?.finished.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Liabilities')}
                icon={<IconLiabilities/>}
                amount={financeStats?.debts.amount}
                persons={financeStats?.debts.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Paid')}
                icon={<IconCreditCard/>}
                amount={financeStats?.paid.amount}
                persons={financeStats?.paid.persons}
              />
            </div>
          )}
        </div>
        <EasyDateRangePicker
          open={showRangePicker}
          onChange={handleDateChange}
          onClose={handleDatePickerClose}
          pickerAnchor={pickerRef.current}
          dateRange={{ startDate, endDate }}
        />
      </div>
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    if (query.fromDate == null) {
      query.fromDate = moment().startOf('week').format('YYYY-MM-DD');
    }
    if (query.toDate == null) {
      query.toDate = moment().endOf('week').format('YYYY-MM-DD');
    }
    if (query.doctorId == null) {
      query.doctorId = -1;
    }

    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/general');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const { data } = await getGeneralStatistics(query, req.headers);
    return {
      props: {
        ...data,
        authToken,
        query,
        ...appData
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res)
    return {
      props: {
        query: {}
      }
    }
  }
}

export default General;
