import React from 'react';

import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';

import './styles.scss';

const LoadingButton = props => {
  const {
    children,
    className,
    onClick,
    disabled,
    spinnerVariant,
    isLoading,
  } = props;
  return (
    <Button className={className} onClick={onClick} disabled={disabled}>
      {children}
      {isLoading && (
        <Spinner
          className='loading-spinner'
          animation='border'
          variant={spinnerVariant}
        />
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
};
