import React from 'react';

import PropTypes from 'prop-types';

function IconPalette({ fill }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      height='36px'
      viewBox='0 0 20 20'
      width='36px'
      fill={fill}
    >
      <g>
        <rect fill='none' height='20' width='20' />
      </g>
      <g>
        <g>
          <path d='M10,2c-4.41,0-8,3.59-8,8s3.59,8,8,8c1.1,0,2-0.9,2-2c0-0.49-0.18-0.96-0.51-1.34c-0.24-0.3-0.02-0.66,0.3-0.66h1.42 c2.65,0,4.8-2.15,4.8-4.8C18,5.23,14.41,2,10,2z M13.2,12.5h-1.42c-1.05,0-1.9,0.85-1.9,1.9c0,0.47,0.19,0.92,0.47,1.25 c0.34,0.39,0.02,0.85-0.36,0.85c-3.58,0-6.5-2.92-6.5-6.5S6.42,3.5,10,3.5s6.5,2.56,6.5,5.7C16.5,11.02,15.02,12.5,13.2,12.5z' />
          <circle cx='14.5' cy='9.5' r='1.25' />
          <circle cx='12' cy='6.5' r='1.25' />
          <circle cx='5.5' cy='9.5' r='1.25' />
          <circle cx='8' cy='6.5' r='1.25' />
        </g>
      </g>
    </svg>
  );
}

export default React.memo(IconPalette);

IconPalette.propTypes = {
  fill: PropTypes.string,
};

IconPalette.defaultProps = {
  fill: '#000000',
};
