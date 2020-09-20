import React from 'react';

import IconAvatar from '../../../../assets/icons/iconAvatar';

const CalendarDoctor = props => {
  return (
    <div className='doctor-item'>
      <IconAvatar />
      <div className='name-and-service'>
        <span className='doctor-name'>Doctor Name</span>
        <span className='service-name'>Service name</span>
      </div>
    </div>
  );
};

export default CalendarDoctor;
