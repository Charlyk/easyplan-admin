import React, { useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { Form, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import IconCheckMark from '../../../../assets/icons/iconCheckMark';
import IconClock from '../../../../assets/icons/iconClock';
import IconCreditCard from '../../../../assets/icons/iconCreditCard';
import IconLiabilities from '../../../../assets/icons/iconLiabilities';
import IconSuccess from '../../../../assets/icons/iconSuccess';
import IconXPerson from '../../../../assets/icons/iconXPerson';
import EasyDateRangePicker from '../../../../components/EasyDateRangePicker';
import { clinicDoctorsSelector } from '../../../../redux/selectors/clinicSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { Action, Statuses } from '../../../../utils/constants';
import { logUserAction } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';
import IncomeStatisticItem from './IncomeStatisticItem';
import StatusItem from './StatusItem';

const GeneralStatistics = () => {
  const doctors = useSelector(clinicDoctorsSelector);
  const pickerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({ id: 'all' });
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [[startDate, endDate], setDateRange] = useState([
    moment()
      .startOf('day')
      .toDate(),
    moment()
      .endOf('day')
      .toDate(),
  ]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    const requestData = {
      doctorId: selectedDoctor.id,
      fromDate: startDate,
      toDate: endDate,
    };
    logUserAction(
      Action.ViewGeneralStatistics,
      JSON.stringify({ filter: requestData }),
    );
    const response = await dataAPI.fetchGeneralStatistics(requestData);
    if (response.isError) {
      console.error(response.message);
    } else {
      setStatistics(response.data);
    }
    setIsLoading(false);
  };

  const handleDoctorChange = event => {
    const newValue = event.target.value;
    if (newValue === 'all') {
      setSelectedDoctor({ id: newValue });
    } else {
      setSelectedDoctor(doctors.find(item => item.id === newValue));
    }
  };

  const handleFilterSubmit = () => {
    fetchStatistics();
  };

  const statuses = statistics?.items || [];

  const getSchedulePercentage = item => {
    const percent = (item.count / statistics.total) * 100;
    return Number.isNaN(percent) ? 0 : percent;
  };

  const handleDatePickerClose = () => {
    setShowRangePicker(false);
  };

  const handleDateChange = data => {
    const { startDate, endDate } = data.range1;
    setDateRange([
      startDate,
      moment(endDate)
        .endOf('day')
        .toDate(),
    ]);
  };

  const handleDatePickerOpen = () => {
    setShowRangePicker(true);
  };

  const titleForStatus = statusItem => {
    const data = Statuses.find(it => it.id === statusItem.status);
    return data?.name;
  };

  const iconForStatus = statusItem => {
    const data = Statuses.find(it => it.id === statusItem.status);
    return data?.icon;
  };

  return (
    <div className='general-statistics' id='general-statistics'>
      <div className='main-data-container'>
        <StatisticFilter onUpdate={handleFilterSubmit} isLoading={isLoading}>
          <Form.Group>
            <Form.Label>{textForKey('Doctor')}</Form.Label>
            <Form.Control
              onChange={handleDoctorChange}
              as='select'
              className='mr-sm-2'
              id='inlineFormCustomSelect'
              custom
            >
              <option value='all'>{textForKey('All doctors')}</option>
              {doctors.map(item => (
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
        <span className='block-title'>{textForKey('Patients statistics')}</span>
        {isLoading && statuses.length === 0 && (
          <Spinner animation='border' className='statistics-loading-spinner' />
        )}
        {statuses.length > 0 ? (
          <div className='statuses-container'>
            {statuses.map(item => (
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
      <div className='right-content-wrapper'>
        <div className='items-wrapper'>
          <IncomeStatisticItem
            title={textForKey('Expectations')}
            icon={<IconClock />}
            amount='12.000'
            persons={3}
          />
          <IncomeStatisticItem
            title={textForKey('Confirmed')}
            icon={<IconCheckMark />}
            amount='12.000'
            persons={3}
          />
          <IncomeStatisticItem
            title={textForKey('Did not came')}
            icon={<IconXPerson />}
            amount='12.000'
            persons={3}
          />
          <IncomeStatisticItem
            title={textForKey('Finished')}
            icon={<IconSuccess fill='#ffffff' />}
            amount='12.000'
            persons={3}
          />
          <IncomeStatisticItem
            title={textForKey('Liabilities')}
            icon={<IconLiabilities />}
            amount='12.000'
            persons={3}
          />
          <IncomeStatisticItem
            title={textForKey('Paid')}
            icon={<IconCreditCard />}
            amount='12.000'
            persons={3}
          />
        </div>
      </div>
      <EasyDateRangePicker
        open={showRangePicker}
        onChange={handleDateChange}
        onClose={handleDatePickerClose}
        pickerAnchor={pickerRef.current}
        dateRange={{ startDate, endDate }}
      />
    </div>
  );
};

export default GeneralStatistics;
