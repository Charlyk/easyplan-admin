import React from 'react';

import PropTypes from 'prop-types';

import { getServiceName } from '../../../utils/helperFuncs';

const FinalServiceItem = ({ service }) => {
  return (
    <div className='final-service-root'>
      <span className='service-name'>{getServiceName(service)}</span>
      <span className='service-price'>{service.price} MDL</span>
    </div>
  );
};

export default FinalServiceItem;

FinalServiceItem.propTypes = {
  service: PropTypes.object,
};
