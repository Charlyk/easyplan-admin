import React from 'react';
import PropTypes from 'prop-types';

function IconInfo({ fill }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1Z"
        stroke={fill} stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 9.40039L7 7.00039" stroke={fill} stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 4.59961L6.994 4.59961" stroke={fill} stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export default React.memo(IconInfo);

IconInfo.propTypes = {
  fill: PropTypes.string,
};

IconInfo.defaultProps = {
  fill: '#A1A2C6'
}


