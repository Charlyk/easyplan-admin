import React from 'react';

import PropTypes from 'prop-types';

import IconClock from '../../assets/icons/iconClock';
import IconDollar from '../../assets/icons/iconDollar';
import IconEditService from '../../assets/icons/iconEditService';
import { textForKey } from '../../utils/localization';

const ServiceItem = props => {
  const { service, onEdit } = props;
  return (
    <div className='service-item'>
      <div className='service-item__header'>
        <div
          className='service-item__color'
          style={{ backgroundColor: service.color }}
        />
        <div className='service-item__title'>{service.name}</div>
        <div
          role='button'
          tabIndex={0}
          className='service-item__edit-btn'
          onClick={() => onEdit(service)}
        >
          <IconEditService />
        </div>
      </div>
      <div className='service-item__data'>
        <div className='service-row'>
          <IconClock />
          <div className='service-row__title'>{textForKey('Time')}:</div>
          <div className='service-row__value'>{service.duration}min</div>
        </div>
        <div className='service-row'>
          <IconDollar />
          <div className='service-row__title'>{textForKey('Price')}:</div>
          <div className='service-row__value'>{service.price}MDL</div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;

ServiceItem.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    duration: PropTypes.number,
    color: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
};
