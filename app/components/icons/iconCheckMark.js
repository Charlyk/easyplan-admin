import React from 'react';

function IconCheckMark() {
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
        d='M10.1191 16.8089L4.53639 11.3813C4.18492 11.0396 3.61507 11.0396 3.2636 11.3813C2.91213 11.723 2.91213 12.277 3.2636 12.6187L9.56359 18.7437C9.94512 19.1146 10.5743 19.0781 10.9077 18.6656L20.8076 6.41563C21.1147 6.03564 21.0468 5.48557 20.656 5.18701C20.2652 4.88845 19.6994 4.95446 19.3923 5.33444L10.1191 16.8089Z'
      />
    </svg>
  );
}

export default React.memo(IconCheckMark);
