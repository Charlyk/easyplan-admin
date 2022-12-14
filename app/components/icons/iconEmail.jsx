import React from 'react';

function IconEmail() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15 4C16.6569 4 18 5.34315 18 7V13C18 14.6569 16.6569 16 15 16H5C3.34315 16 2 14.6569 2 13V7C2 5.34315 3.34315 4 5 4H15ZM16 7.3L10.6585 11.7526C10.3129 12.055 9.81106 12.0802 9.43941 11.8282L9.3415 11.7526L4 7.301V13C4 13.5523 4.44772 14 5 14H15C15.5523 14 16 13.5523 16 13V7.3ZM14.432 6H5.567L10 9.67123L14.432 6Z'
      />
    </svg>
  );
}

export default React.memo(IconEmail);
