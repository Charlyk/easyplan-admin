import React, { useEffect, useReducer, useRef } from 'react';

import moment from 'moment-timezone';
import sortBy from 'lodash/sortBy';
import { Button, Form } from 'react-bootstrap';

import ActionLogModal from '../../../app/components/dashboard/analytics/ActionLogModal';
import EasyDateRangePicker from '../../../components/common/EasyDateRangePicker';
import { textForKey } from '../../../utils/localization';
import StatisticFilter from '../../../app/components/dashboard/analytics/StatisticFilter';
import styles from '../../../styles/ActivityLogs.module.scss';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { generateReducerActions, handleRequestError, redirectToUrl, redirectUserTo } from "../../../utils/helperFuncs";
import MainComponent from "../../../components/common/MainComponent";
import isEqual from "lodash/isEqual";
import { useRouter } from "next/router";
import { getActivityJournal } from "../../../middleware/api/analytics";
import { fetchAppData } from "../../../middleware/api/initialization";
import { parseCookies } from "../../../utils";

const initialState = {
  isLoading: false,
  selectedUser: { id: -1 },
  showRangePicker: false,
  dateRange: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],
  showDetails: {
    open: false,
    activityLog: null,
  }
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setSelectedUser: 'setSelectedUser',
  setShowRangePicker: 'setShowRangePicker',
  setDateRange: 'setDateRange',
  setShowDetails: 'setShowDetails',
  setInitialQuery: 'setInitialQuery',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setSelectedUser:
      return { ...state, selectedUser: action.payload };
    case reducerTypes.setShowRangePicker:
      return { ...state, showRangePicker: action.payload };
    case reducerTypes.setDateRange:
      return { ...state, dateRange: action.payload };
    case reducerTypes.setShowDetails:
      return { ...state, showDetails: action.payload };
    case reducerTypes.setInitialQuery:
      const { userId, fromDate, toDate } = action.payload;
      return {
        ...state,
        selectedUser: { id: parseInt(userId) },
        dateRange: [
          moment(fromDate).toDate(),
          moment(toDate).toDate(),
        ],
      };
    default:
      return state;
  }
}

const ActivityLogs = ({ currentUser, currentClinic, activityLogs, query: initialQuery, authToken }) => {
  const pickerRef = useRef(null);
  const router = useRouter();
  const users = sortBy(currentClinic.users, user => user.fullName.toLowerCase());
  const [
    {
      selectedUser,
      dateRange,
      showRangePicker,
      isLoading,
      showDetails
    },
    localDispatch
  ] = useReducer(reducer, initialState)
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    localDispatch(actions.setInitialQuery(initialQuery));
  }, []);

  const handleFilterSubmit = () => {
    const query = {
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
    }

    if (selectedUser.id !== -1) {
      query.userId = selectedUser.id;
    }

    if (isEqual(query, initialQuery)) {
      return;
    }

    const queryString = new URLSearchParams(query).toString();
    router.replace(`/analytics/activity-logs?${queryString}`);
  }

  const handleDatePickerOpen = () => {
    localDispatch(actions.setShowRangePicker(true));
  };

  const handleDatePickerClose = () => {
    localDispatch(actions.setShowRangePicker(false));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(actions.setDateRange([startDate, endDate]));
  };

  const handleUserChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(actions.setSelectedUser({ id: newValue }));
      return;
    }
    const user = users.find((it) => it.id === newValue);
    localDispatch(actions.setSelectedUser(user));
  };

  const handleShowDetails = (log) => {
    localDispatch(actions.setShowDetails({ open: true, activityLog: log }))
  };

  const handleCloseDetails = () => {
    localDispatch(actions.setShowDetails({ open: false, activityLog: null }));
  };

  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/analytics/activity-logs'
      authToken={authToken}
    >
      <div className={styles['activity-logs']}>
        <ActionLogModal
          open={showDetails.open}
          activityLog={showDetails.activityLog}
          onClose={handleCloseDetails}
        />
        <StatisticFilter isLoading={isLoading} onUpdate={handleFilterSubmit}>
          <Form.Group style={{ flexDirection: 'column' }}>
            <Form.Label>{textForKey('User')}</Form.Label>
            <Form.Control
              disabled={isLoading}
              as='select'
              className='mr-sm-2'
              id='inlineFormCustomSelect'
              onChange={handleUserChange}
              value={selectedUser.id}
              custom
            >
              <option value={-1}>{textForKey('All users')}</option>
              {users.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.firstName} {item.lastName}
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
        </StatisticFilter>
        <div className={styles['data-container']}>
          {!isLoading && activityLogs.length === 0 && (
            <span className={styles['no-data-label']}>{textForKey('No results')}</span>
          )}
          {isLoading && (
            <div className={styles.progressWrapper}>
              <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
            </div>
          )}
          {activityLogs.length > 0 && (
            <TableContainer classes={{ root: styles.tableContainer }}>
              <Table className={styles['data-table']}>
                <TableHead>
                  <TableRow>
                    <TableCell className={styles['date-cell']}>{textForKey('Date')}</TableCell>
                    <TableCell className={styles['user-cell']}>{textForKey('User')}</TableCell>
                    <TableCell className={styles['details-cell']}>{textForKey('Details')}</TableCell>
                    <TableCell className={styles['actions-cell']} align='right'>{textForKey('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityLogs.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className={styles['date-cell']}>
                        {moment(item.created).format('DD MMM YYYY HH:mm')}
                      </TableCell>
                      <TableCell className={styles['user-cell']}>{item.user}</TableCell>
                      <TableCell className={styles['details-cell']}>{textForKey(item.action)}</TableCell>
                      <TableCell className={styles['actions-cell']} align='right'>
                        <div className={styles.btnWrapper}>
                          <Button
                            className={'positive-button'}
                            onClick={() => handleShowDetails(item)}
                          >
                            {textForKey('View Details')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
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
      query.fromDate = moment().startOf('day').format('YYYY-MM-DD');
    }
    if (query.toDate == null) {
      query.toDate = moment().endOf('day').format('YYYY-MM-DD');
    }
    if (query.userId == null) {
      query.userId = -1;
    }
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/activity-logs');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const { data: activityLogs } = await getActivityJournal(query, req.headers);
    return {
      props: {
        authToken,
        activityLogs,
        query,
        ...appData,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        activityLogs: [],
        query: {},
      }
    };
  }
}

export default ActivityLogs;
