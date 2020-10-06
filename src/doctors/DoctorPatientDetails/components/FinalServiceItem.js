import React from 'react';

import PropTypes from 'prop-types';

const FinalServiceItem = ({ service }) => {
  return (
    <div className='final-service-root'>
      <span className='service-name'>{service.name}</span>
      <span className='service-price'>{service.price} MDL</span>
    </div>
  );
};

export default FinalServiceItem;

FinalServiceItem.propTypes = {
  service: PropTypes.object,
};
