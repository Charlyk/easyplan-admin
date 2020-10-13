import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { Form } from 'react-bootstrap';

import IconCheckMark from '../../../../assets/icons/iconCheckMark';
import IconClock from '../../../../assets/icons/iconClock';
import IconCreditCard from '../../../../assets/icons/iconCreditCard';
import IconLiabilities from '../../../../assets/icons/iconLiabilities';
import IconSuccess from '../../../../assets/icons/iconSuccess';
import IconXPerson from '../../../../assets/icons/iconXPerson';
import dataAPI from '../../../../utils/api/dataAPI';
import { Statuses } from '../../../../utils/constants';
import { textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';
import IncomeStatisticItem from './IncomeStatisticItem';
import StatusItem from './StatusItem';

const GeneralStatistics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState({ id: 'all' });
  const [doctors, setDoctors] = useState([]);

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
      moment()
        .startOf('day')
        .toDate(),
      moment()
        .endOf('day')
        .toDate(),
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
          <Form.Group>
            <Form.Label>{textForKey('Period')}</Form.Label>
            <Form.Control readOnly />
          </Form.Group>
        </StatisticFilter>
        <span className='block-title'>{textForKey('Patients statistics')}</span>
        <div className='statuses-container'>
          {statuses.map(item => (
            <StatusItem
              personsCount={item.count}
              key={item.status}
              title={textForKey(item.status)}
              percentage={getSchedulePercentage(item)}
              icon={Statuses.find(it => it.id === item.status).icon}
            />
          ))}
        </div>
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
    </div>
  );
};

export default GeneralStatistics;
