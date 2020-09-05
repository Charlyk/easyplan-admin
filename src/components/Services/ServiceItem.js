import React from 'react';

import IconClock from '../../assets/icons/iconClock';
import IconDollar from '../../assets/icons/iconDollar';
import IconEditService from '../../assets/icons/iconEditService';
import { textForKey } from '../../utils/localization';

const ServiceItem = props => {
  return (
    <div className='service-item'>
      <div className='service-item__header'>
        <div className='service-item__color' />
        <div className='service-item__title'>Service name</div>
        <div className='service-item__edit-btn'>
          <IconEditService />
        </div>
      </div>
      <div className='service-item__data'>
        <div className='service-row'>
          <IconClock />
          <div className='service-row__title'>{textForKey('Time')}:</div>
          <div className='service-row__value'>30min</div>
        </div>
        <div className='service-row'>
          <IconDollar />
          <div className='service-row__title'>{textForKey('Price')}:</div>
          <div className='service-row__value'>200MDL</div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
