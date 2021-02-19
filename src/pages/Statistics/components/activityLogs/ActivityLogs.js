import React, { useEffect, useRef, useState } from 'react';

import moment from 'moment-timezone';
import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import ActionLogModal from '../../../../components/ActionLogModal';
import EasyDateRangePicker from '../../../../components/EasyDateRangePicker';
import { clinicUsersSelector } from '../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';

const initialState = {
  isLoading: false,
  selectedUser: { id: -1 },
  showRangePicker: false,
  dateRange: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],
  activityLogs: [],
};

const ActivityLogs = () => {
  const pickerRef = useRef(null);
  const users = useSelector(clinicUsersSelector);
  const [selectedUser, setSelectedUser] = useState(initialState.selectedUser);
  const [[startDate, endDate], setDateRange] = useState(initialState.dateRange);
  const [showDetails, setShowDetails] = useState({
    open: false,
    activityLog: null,
  });
  const [showRangePicker, setShowRangePicker] = useState(
    initialState.showRangePicker,
  );
  const [activityLogs, setActivityLogs] = useState(initialState.activityLogs);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    setIsLoading(true);
    const requestData = {
      userId: selectedUser.id,
      fromDate: startDate,
      toDate: endDate,
    };
    const response = await dataAPI.fetchActivityLogs(requestData);
    if (response.isError) {
      console.error(response.message);
    } else {
      setActivityLogs(response.data);
    }
    setIsLoading(false);
  };

  const handleDatePickerOpen = () => {
    setShowRangePicker(true);
  };

  const handleDatePickerClose = () => {
    setShowRangePicker(false);
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    setDateRange([startDate, endDate]);
  };

  const handleUserChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      setSelectedUser({ id: newValue });
      return;
    }
    const user = users.find((it) => it.id === newValue);
    setSelectedUser(user);
  };

  const handleShowDetails = (log) => {
    setShowDetails({ open: true, activityLog: log });
  };

  const handleCloseDetails = () => {
    setShowDetails({ open: false, activityLog: null });
  };

  return (
    <div className='activity-logs'>
      <ActionLogModal
        open={showDetails.open}
        activityLog={showDetails.activityLog}
        onClose={handleCloseDetails}
      />
      <StatisticFilter isLoading={isLoading} onUpdate={fetchActivityLogs}>
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
      <div className='data-container'>
        {!isLoading && activityLogs.length === 0 && (
          <span className='no-data-label'>{textForKey('No results')}</span>
        )}
        {activityLogs.length > 0 && (
          <table className='data-table'>
            <thead>
              <tr>
                <td className='date-cell'>{textForKey('Date')}</td>
                <td className='user-cell'>{textForKey('User')}</td>
                <td className='details-cell'>{textForKey('Details')}</td>
                <td className='actions-cell'>{textForKey('Actions')}</td>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((item) => (
                <tr key={item.id}>
                  <td className='date-cell'>
                    {moment(item.created).format('DD MMM YYYY HH:mm')}
                  </td>
                  <td className='user-cell'>{item.user}</td>
                  <td className='details-cell'>{textForKey(item.action)}</td>
                  <td className='actions-cell'>
                    <Button
                      className='positive-button'
                      onClick={() => handleShowDetails(item)}
                    >
                      {textForKey('View Details')}
                    </Button>
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

export default ActivityLogs;
