import React from 'react';

import { Form } from 'react-bootstrap';

import IconCheckMark from '../../../../assets/icons/iconCheckMark';
import IconClock from '../../../../assets/icons/iconClock';
import IconCreditCard from '../../../../assets/icons/iconCreditCard';
import IconLiabilities from '../../../../assets/icons/iconLiabilities';
import IconSuccess from '../../../../assets/icons/iconSuccess';
import IconXPerson from '../../../../assets/icons/iconXPerson';
import { textForKey } from '../../../../utils/localization';
import StatisticFilter from '../StatisticFilter';
import IncomeStatisticItem from './IncomeStatisticItem';
import StatusItem from './StatusItem';

const GeneralStatistics = () => {
  const data = () => {
    const items = [];
    for (let i = 7; i < 20; i++) {
      items.push({
        name: `0${i}:00`,
        income: Math.random(),
      });
    }
    return items;
  };

  return (
    <div className='general-statistics' id='general-statistics'>
      <div className='main-data-container'>
        <StatisticFilter>
          <Form.Group>
            <Form.Label>{textForKey('Doctor')}</Form.Label>
            <Form.Control
              as='select'
              className='mr-sm-2'
              id='inlineFormCustomSelect'
              custom
            >
              <option value='all'>{textForKey('All doctors')}</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>{textForKey('Period')}</Form.Label>
            <Form.Control readOnly />
          </Form.Group>
        </StatisticFilter>
        <span className='block-title'>{textForKey('Patients statistics')}</span>
        <div className='statuses-container'>
          <StatusItem
            title={textForKey('Waiting')}
            percentage={30}
            icon={<IconClock />}
          />
          <StatusItem
            title={textForKey('Finished')}
            icon={<IconSuccess fill='#3A83DC' />}
            percentage={75}
          />
          <StatusItem
            title={textForKey('Did not come')}
            icon={<IconXPerson />}
            percentage={50}
          />
          <StatusItem
            title={textForKey('Confirmed')}
            icon={<IconCheckMark />}
            percentage={30}
          />
          <StatusItem
            title={textForKey('Late')}
            icon={<IconClock />}
            percentage={10}
          />
          <StatusItem
            title={textForKey('Paid')}
            icon={<IconCreditCard />}
            percentage={80}
          />
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
