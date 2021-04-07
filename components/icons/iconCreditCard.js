import React from 'react';

function IconCreditCard() {
  return (
    <svg
      width='20'
      height='16'
      viewBox='0 0 20 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M17 0C18.6569 0 20 1.34315 20 3V13C20 14.6569 18.6569 16 17 16H3C1.34315 16 0 14.6569 0 13V3C0 1.34315 1.34315 0 3 0H17ZM2 8V13C2 13.5523 2.44772 14 3 14H17C17.5523 14 18 13.5523 18 13V8H2ZM2 4H18V3C18 2.44772 17.5523 2 17 2H3C2.44772 2 2 2.44772 2 3V4Z'
      />
    </svg>
  );
}

export default React.memo(IconCreditCard);
