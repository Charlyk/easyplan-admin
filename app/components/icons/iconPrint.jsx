import React from 'react';

import PropTypes from 'prop-types';

function IconPrint({ fill }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill={fill}
      width='18px'
      height='18px'
    >
      <path d='M0 0h24v24H0z' fill='none' />
      <path d='M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z' />
    </svg>
  );
}

export default React.memo(IconPrint);

IconPrint.propTypes = {
  fill: PropTypes.string,
};

IconPrint.defaultProps = {
  fill: '#000',
};
