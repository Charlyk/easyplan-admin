import React, { useEffect, useRef, useState } from 'react';

import moment from 'moment-timezone';
import { Form, Modal, Spinner } from 'react-bootstrap';
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
import StatisticFilter from '../StatisticFilter/StatisticFilter';
import IncomeStatisticItem from './IncomeStatisticItem';
import StatusItem from './StatusItem';
import styles from '../../Statistics.module.scss';

const initialFinanceReport = {
  expectations: {
    persons: 0,
    amount: 0,
  },
  confirmed: {
    persons: 0,
    amount: 0,
  },
  debts: {
    persons: 0,
    amount: 0,
  },
  paid: {
    persons: 0,
    amount: 0,
  },
  finished: {
    persons: 0,
    amount: 0,
  },
  canceled: {
    persons: 0,
    amount: 0,
  },
};

const GeneralStatistics = () => {
  const doctors = useSelector(clinicDoctorsSelector);
  const pickerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generalStatistics, setGeneralStatistics] = useState([]);
  const [financeStatistics, setFinanceStatistics] = useState(
    initialFinanceReport,
  );
  const [selectedDoctor, setSelectedDoctor] = useState({ id: -1 });
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [[startDate, endDate], setDateRange] = useState([
    moment().startOf('week').toDate(),
    moment().endOf('week').toDate(),
  ]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    const requestData = {
      doctorId: selectedDoctor.id,
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
    };
    logUserAction(
      Action.ViewGeneralStatistics,
      JSON.stringify({ filter: requestData }),
    );
    const response = await dataAPI.fetchGeneralStatistics(requestData);

    if (response.isError) {
      console.error(response.message);
    } else {
      setGeneralStatistics(response.data);
    }

    const financeResponse = await dataAPI.fetchFinanceStatistics(requestData);
    if (financeResponse.isError) {
      console.error(financeResponse.message);
    } else {
      setFinanceStatistics(financeResponse.data);
    }
    setIsLoading(false);
  };

  const handleDoctorChange = (event) => {
    const newValue = event.target.value;
    if (newValue === -1) {
      setSelectedDoctor({ id: newValue });
    } else {
      setSelectedDoctor(doctors.find((item) => item.id === newValue));
    }
  };

  const handleFilterSubmit = () => {
    fetchStatistics();
  };

  const statuses = generalStatistics?.items || [];

  const getSchedulePercentage = (item) => {
    const percent = (item.count / generalStatistics.total) * 100;
    return Number.isNaN(percent) ? 0 : percent;
  };

  const handleDatePickerClose = () => {
    setShowRangePicker(false);
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    setDateRange([startDate, endDate]);
  };

  const handleDatePickerOpen = () => {
    setShowRangePicker(true);
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
    <div className={styles['general-statistics']} id='general-statistics'>
      <Modal
        centered
        className={styles['loading-modal']}
        show={isLoading && statuses.length === 0}
        onHide={() => null}
      >
        <Modal.Body>
          <Spinner animation='border' />
          {isLoading && textForKey('Loading statistics')}...
        </Modal.Body>
      </Modal>
      <div className={styles['main-data-container']}>
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
        {financeStatistics != null && (
          <div className={styles['items-wrapper']}>
            <IncomeStatisticItem
              title={textForKey('Expectations')}
              icon={<IconClock />}
              amount={financeStatistics?.expectations.amount}
              persons={financeStatistics?.expectations.persons}
            />
            <IncomeStatisticItem
              title={textForKey('Confirmed')}
              icon={<IconCheckMark />}
              amount={financeStatistics?.confirmed.amount}
              persons={financeStatistics?.confirmed.persons}
            />
            <IncomeStatisticItem
              title={textForKey('Did not came')}
              icon={<IconXPerson />}
              amount={financeStatistics?.canceled.amount}
              persons={financeStatistics?.canceled.persons}
            />
            <IncomeStatisticItem
              title={textForKey('Finished')}
              icon={<IconSuccess fill='#ffffff' />}
              amount={financeStatistics?.finished.amount}
              persons={financeStatistics?.finished.persons}
            />
            <IncomeStatisticItem
              title={textForKey('Liabilities')}
              icon={<IconLiabilities />}
              amount={financeStatistics?.debts.amount}
              persons={financeStatistics?.debts.persons}
            />
            <IncomeStatisticItem
              title={textForKey('Paid')}
              icon={<IconCreditCard />}
              amount={financeStatistics?.paid.amount}
              persons={financeStatistics?.paid.persons}
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
  );
};

export default GeneralStatistics;
