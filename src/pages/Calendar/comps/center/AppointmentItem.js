import React from 'react';

import IconNext from '../../../../assets/icons/iconNext';

const AppointmentItem = props => {
  return (
    <div className='day-appointment-item'>
      <div className='title-and-time'>
        <span className='service-name'>Service name</span>
        <span className='item-time-text'>11:00 - 12:30</span>
      </div>
      <IconNext fillColor='#F44081' circleColor='transparent' />
    </div>
  );
};

export default AppointmentItem;
