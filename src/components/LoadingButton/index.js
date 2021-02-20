import React from 'react';

import { CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const LoadingButton = ({
  children,
  className,
  onClick,
  disabled,
  isLoading,
  variant,
}) => {
  return (
    <Button
      className={`loading-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
    >
      {!isLoading && children}
      {isLoading && (
        <div className='spinner-wrapper'>
          <CircularProgress className='loading-button-spinner' />
        </div>
      )}
    </Button>
  );
};

export default LoadingButton;

LoadingButton.propTypes = {
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  children: PropTypes.any,
  spinnerVariant: PropTypes.oneOf(['light']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
};

LoadingButton.defaultProps = {
  variant: 'primary',
};
