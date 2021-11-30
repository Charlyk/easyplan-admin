import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './LoadingButton.module.scss';

const LoadingButton = ({
  children,
  className,
  onClick,
  disabled,
  isLoading,
  style,
  type,
}) => {
  return (
    <Button
      type={type}
      style={style}
      onClick={onClick}
      disabled={disabled}
      classes={{
        root: clsx(styles.loadingButton, className),
        label: styles.buttonLabel,
        disabled: styles.disabled,
      }}
    >
      {!isLoading && children}
      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <CircularProgress classes={{ root: styles.loadingButtonSpinner }} />
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
  className: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  style: PropTypes.any,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

LoadingButton.defaultProps = {
  variant: 'primary',
  disabled: false,
  onClick: () => null,
  isLoading: false,
  children: null,
  className: null,
  style: null,
  type: 'button',
};
