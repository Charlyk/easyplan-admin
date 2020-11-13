import React from 'react';

const HourView = ({ hour }) => {
  const [hourText, minute] = hour.split(':');
  return (
    <div id={hour} className='hour-wrapper'>
      <span className='hour-text'>{minute !== '00' ? '' : hourText}</span>
      <span className='minute-text'>{minute}</span>
    </div>
  );
};

export default HourView;
