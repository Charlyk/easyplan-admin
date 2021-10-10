import React from 'react';

import PropTypes from 'prop-types';

function IconMinus({ fill }) {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill={fill}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z' />
    </svg>
  );
}

export default React.memo(IconMinus);

IconMinus.propTypes = {
  fill: PropTypes.string,
};

IconMinus.defaultProps = {
  fill: 'none',
};