import React from 'react';

function MenuCalendar() {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M17 2C17.5523 2 18 2.44772 18 3V4H19C20.6569 4 22 5.34315 22 7V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V7C2 5.34315 3.34315 4 5 4H6V3C6 2.44772 6.44772 2 7 2C7.55228 2 8 2.44772 8 3V4H16V3C16 2.44772 16.4477 2 17 2ZM4 12V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V12H4ZM4 10H20V7C20 6.44772 19.5523 6 19 6H18V7C18 7.55228 17.5523 8 17 8C16.4477 8 16 7.55228 16 7V6H8V7C8 7.55228 7.55228 8 7 8C6.44772 8 6 7.55228 6 7V6H5C4.44772 6 4 6.44772 4 7V10Z'
      />
    </svg>
  );
}

export default React.memo(MenuCalendar);
