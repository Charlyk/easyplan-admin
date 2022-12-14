import React from 'react';

import PropTypes from 'prop-types';

function IconAppointmentCalendar({ fill }) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        fill={fill}
        d='M14 2C14.5523 2 15 2.44772 15 3V4C16.6569 4 18 5.34315 18 7V15C18 16.6569 16.6569 18 15 18H5C3.34315 18 2 16.6569 2 15V7C2 5.34315 3.34315 4 5 4V3C5 2.44772 5.44772 2 6 2C6.55228 2 7 2.44772 7 3V4H13V3C13 2.44772 13.4477 2 14 2ZM16 10H4V15C4 15.5523 4.44772 16 5 16H15C15.5523 16 16 15.5523 16 15V10ZM14 11C14.5523 11 15 11.4477 15 12V14C15 14.5523 14.5523 15 14 15H12C11.4477 15 11 14.5523 11 14V12C11 11.4477 11.4477 11 12 11H14ZM15 6H5C4.44772 6 4 6.44772 4 7V8H16V7C16 6.44772 15.5523 6 15 6Z'
      />
    </svg>
  );
}

export default React.memo(IconAppointmentCalendar);

IconAppointmentCalendar.propTypes = {
  fill: PropTypes.string,
};

IconAppointmentCalendar.defaultProps = {
  fill: '#B8DBF8',
};
