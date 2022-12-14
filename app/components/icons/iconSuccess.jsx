import React from 'react';

import PropTypes from 'prop-types';

function IconSuccess({ fill }) {
  return (
    <svg
      width='25'
      height='24'
      viewBox='0 0 25 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12.1211 2C17.6439 2 22.1211 6.47715 22.1211 12C22.1211 17.5228 17.6439 22 12.1211 22C6.59825 22 2.12109 17.5228 2.12109 12C2.12109 6.47715 6.59825 2 12.1211 2ZM12.1211 4C7.70282 4 4.12109 7.58172 4.12109 12C4.12109 16.4183 7.70282 20 12.1211 20C16.5394 20 20.1211 16.4183 20.1211 12C20.1211 7.58172 16.5394 4 12.1211 4ZM15.414 8.29289L10.1211 13.5858L8.8282 12.2929C8.43768 11.9024 7.80451 11.9024 7.41399 12.2929C7.02346 12.6834 7.02346 13.3166 7.41399 13.7071L9.41399 15.7071C9.80451 16.0976 10.4377 16.0976 10.8282 15.7071L16.8282 9.70711C17.2187 9.31658 17.2187 8.68342 16.8282 8.29289C16.4377 7.90237 15.8045 7.90237 15.414 8.29289Z'
      />
    </svg>
  );
}

export default React.memo(IconSuccess);

IconSuccess.propTypes = {
  fill: PropTypes.string,
};

IconSuccess.defaultProps = {
  fill: '#ffffff',
};
