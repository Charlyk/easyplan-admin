import React from 'react';

import PropTypes from 'prop-types';

function IconRefresh({ fill }) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.29289 4.29294L7.29289 2.29294C7.89547 1.69037 8.90718 2.07238 8.99402 2.88642L9 3.00005L9.00119 4.10031C11.2828 4.56404 13 6.58151 13 9.00005C13 11.7615 10.7614 14.0001 8 14.0001C5.23858 14.0001 3 11.7615 3 9.00005C3 8.44777 3.44772 8.00005 4 8.00005C4.55228 8.00005 5 8.44777 5 9.00005C5 10.6569 6.34315 12.0001 8 12.0001C9.65685 12.0001 11 10.6569 11 9.00005C11 7.69417 10.1656 6.58317 9.0009 6.17108L9 7.00005C9 7.85222 8.01449 8.29749 7.37747 7.78328L7.29289 7.70716L5.29289 5.70716C4.93241 5.34667 4.90468 4.77944 5.2097 4.38715L5.29289 4.29294L7.29289 2.29294L5.29289 4.29294Z'
        fill={fill}
      />
    </svg>
  );
}

export default React.memo(IconRefresh);

IconRefresh.propTypes = {
  fill: PropTypes.string,
};

IconRefresh.defaultProps = {
  fill: '#fff',
};
