import React from 'react';

function IconArrowNext({ fill = '#A1A2C6' }) {
  return (
    <svg
      width='11'
      height='9'
      viewBox='0 0 11 9'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M6.52699 9L10.9815 4.54545L6.52699 0.0909092L5.76136 0.856534L8.91335 3.99858H0.75V5.09233H8.91335L5.76136 8.24432L6.52699 9Z'
        fill={fill}
      />
    </svg>
  );
}

export default React.memo(IconArrowNext);
