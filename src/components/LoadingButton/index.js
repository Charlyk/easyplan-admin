import React from 'react';

import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';

import './styles.scss';

const LoadingButton = props => {
  const { children, spinnerVariant, isLoading } = props;
  return (
    <Button {...props}>
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
  isLoading: PropTypes.bool,
  children: PropTypes.any,
  spinnerVariant: PropTypes.oneOf(['light']),
};
