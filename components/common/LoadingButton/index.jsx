import React from 'react';
import clsx from "clsx";
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import styles from '../../../styles/LoadingButton.module.scss';

const LoadingButton = ({
  children,
  className,
  onClick,
  disabled,
  isLoading,
  variant,
  style,
}) => {
  return (
    <Button
      style={style}
      className={clsx(styles.loadingButton, className)}
      onPointerUp={onClick}
      disabled={disabled}
    >
      {!isLoading && children}
      {isLoading && (
        <div className={styles['spinner-wrapper']}>
          <CircularProgress classes={{ root: styles['loading-button-spinner'] }} />
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
