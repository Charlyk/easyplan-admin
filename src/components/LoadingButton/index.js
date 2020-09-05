import React from 'react';

import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';

import './styles.scss';

const LoadingButton = props => {
  const { children, spinnerVariant, showLoading } = props;
  return (
    <Button {...props}>
      {children}
      {showLoading && (
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
  showLoading: PropTypes.bool,
  children: PropTypes.any,
  spinnerVariant: PropTypes.oneOf(['light']),
};
