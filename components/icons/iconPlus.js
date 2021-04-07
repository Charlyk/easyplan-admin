import React from 'react';

import PropTypes from 'prop-types';

function IconPlus({ fill }) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.99985 2.66602C7.63166 2.66602 7.33319 2.96449 7.33319 3.33268V7.33265H3.33317C2.96498 7.33265 2.6665 7.63113 2.6665 7.99932C2.6665 8.36751 2.96498 8.66599 3.33317 8.66599H7.33319V12.666C7.33319 13.0342 7.63166 13.3327 7.99985 13.3327C8.36804 13.3327 8.66652 13.0342 8.66652 12.666V8.66599H12.6665C13.0347 8.66599 13.3332 8.36751 13.3332 7.99932C13.3332 7.63113 13.0347 7.33265 12.6665 7.33265H8.66652V3.33268C8.66652 2.96449 8.36804 2.66602 7.99985 2.66602Z'
      />
    </svg>
  );
}

export default React.memo(IconPlus);

IconPlus.propTypes = {
  fill: PropTypes.string,
};

IconPlus.defaultProps = {
  fill: '#ffffff',
};
