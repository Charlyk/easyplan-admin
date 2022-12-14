import React from 'react';
import PropTypes from 'prop-types';

function IconList({ fill }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      height='24px'
      viewBox='0 0 24 24'
      width='24px'
      fill={fill}
    >
      <g fill='none'>
        <path d='M0 0h24v24H0V0z' />
        <path d='M0 0h24v24H0V0z' opacity='.87' />
      </g>
      <path d='M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7zm-4 6h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z' />
    </svg>
  );
}

export default React.memo(IconList);

IconList.propTypes = {
  fill: PropTypes.string,
};

IconList.defaultProps = {
  fill: '#000',
};
