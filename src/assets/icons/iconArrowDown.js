import React from 'react';

import PropTypes from 'prop-types';

function IconArrowDown({ fill }) {
  return (
    <svg
      width='16'
      height='17'
      viewBox='0 0 16 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.70675 5.32205C3.31575 4.93105 2.68375 4.93105 2.29275 5.32205C1.90175 5.71305 1.90175 6.34505 2.29275 6.73605L7.29275 11.736C7.68375 12.127 8.31575 12.127 8.70675 11.736L13.7068 6.73605C14.0978 6.34505 14.0978 5.71305 13.7068 5.32205C13.3158 4.93105 12.6838 4.93105 12.2928 5.32205L7.99975 9.61505L3.70675 5.32205Z'
        fill={fill}
        fillOpacity='0.72'
      />
    </svg>
  );
}

export default React.memo(IconArrowDown);

IconArrowDown.propTypes = {
  fill: PropTypes.string,
};

IconArrowDown.defaultProps = {
  fill: '#ffffff',
};
