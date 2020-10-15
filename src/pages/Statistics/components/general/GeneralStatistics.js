import React, { useEffect, useRef, useState } from 'react';

import { ClickAwayListener, Fade, Paper } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import moment from 'moment';
import { Form, Spinner } from 'react-bootstrap';
import { DateRangePicker } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import IconCheckMark from '../../../../assets/icons/iconCheckMark';
import IconClock from '../../../../assets/icons/iconClock';
import IconCreditCard from '../../../../assets/icons/iconCreditCard';
import IconLiabilities from '../../../../assets/icons/iconLiabilities';
import IconSuccess from '../../../../assets/icons/iconSuccess';
import IconXPerson from '../../../../assets/icons/iconXPerson';
import dataAPI from '../../../../utils/api/dataAPI';
import { Statuses } from '../../../../utils/constants';
import { getAppLanguage, textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';
import IncomeStatisticItem from './IncomeStatisticItem';
import StatusItem from './StatusItem';

const GeneralStatistics = () => {
  const pickerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({ id: 'all' });
  const [doctors, setDoctors] = useState([]);
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
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    const response = await dataAPI.getClinicDoctors();
    if (response.isError) {
      console.error(response.message);
    } else {
      setDoctors(response.data);
      await fetchStatistics();
    }
    setIsLoading(false);
  };

  const fetchStatistics = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchGeneralStatistics(
      selectedDoctor.id,
      startDate,
      endDate,
    );
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

  const dateRangePicker = (
    <Popper
      className='filter-date-picker-root'
      anchorEl={pickerRef.current}
      open={showRangePicker}
      disablePortal
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className='calendar-paper'>
            <ClickAwayListener onClickAway={handleDatePickerClose}>
              <DateRangePicker
                onChange={handleDateChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={[{ startDate, endDate }]}
                direction='horizontal'
                locale={locales[getAppLanguage()]}
              />
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );

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
      {dateRangePicker}
    </div>
  );
};

export default GeneralStatistics;
