import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";

import IconClose from "../../../icons/iconClose";
import { textForKey } from "../../../../utils/localization";
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";
import styles from './EASModal.module.scss';

const EASModal = (
  {
    open,
    title,
    size,
    destroyBtnText = textForKey('Delete'),
    primaryBtnText,
    secondaryBtnText,
    hidePositiveBtn,
    isPositiveLoading,
    isPositiveDisabled,
    bodyStyle,
    note,
    children,
    className,
    paperClass,
    onClose,
    onDestroyClick,
    onPrimaryClick,
    onSecondaryClick,
    onBackdropClick
  }
) => {
  const showDestroyBtn = typeof onDestroyClick === 'function';

  const handleKeyDown = (event) => {
    if (event.keyCode === 27 && !isPositiveLoading) {
      handleBackdropClick();
    }
  };

  const handleCloseModal = (event) => {
    event?.stopPropagation();
    if (isPositiveLoading) {
      return;
    }

    onClose?.();
  };

  const handlePrimaryClick = (event) => {
    event?.stopPropagation();
    if (isPositiveDisabled) {
      return;
    }

    if (typeof onPrimaryClick === 'function') {
      onPrimaryClick();
    } else {
      onClose?.()
    }
  };

  const handleDestroyClick = (event) => {
    event?.stopPropagation();
    if (typeof onDestroyClick === 'function') {
      onDestroyClick();
    } else {
      onClose?.();
    }
  };

  const handleSecondaryClick = (event) => {
    event?.stopPropagation();
    if (typeof onSecondaryClick === 'function') {
      onSecondaryClick();
    } else {
      onClose?.()
    }
  };

  const handleBackdropClick = () => {
    if (typeof onBackdropClick !== 'function') {
      onClose?.()
    } else {
      onBackdropClick?.();
    }
  };

  return (
    <Modal
      open={open}
      className={clsx(styles.modalRoot, className)}
      onBackdropClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <Paper className={clsx(styles.modalPaper, styles[size], paperClass)}>
        <div className={styles.modalHeader}>
          <Typography className={styles.titleLabel} noWrap>
            {title}
          </Typography>
          <IconButton className={styles.closeButton} onClick={handleCloseModal}>
            <IconClose/>
          </IconButton>
        </div>
        <div className={styles.modalBody} style={bodyStyle}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          {note && (
            <Typography className={styles.noteLabel}>
              {note}
            </Typography>
          )}
          {!isPositiveLoading && (
            <Button
              className={styles.secondaryButton}
              onClick={handleSecondaryClick}
              variant='text'
            >
              {secondaryBtnText}
            </Button>
          )}
          {!isPositiveLoading && showDestroyBtn && (
            <Button
              onClick={handleDestroyClick}
              disabled={isPositiveDisabled}
              variant='text'
              classes={{
                root: styles.destroyButton,
                disabled: styles.buttonDisabled,
              }}
            >
              {destroyBtnText}
            </Button>
          )}
          {!hidePositiveBtn && (
            <Button
              onClick={handlePrimaryClick}
              disabled={isPositiveDisabled}
              variant='text'
              classes={{
                root: styles.primaryButton,
                disabled: styles.buttonDisabled,
              }}
            >
              {isPositiveLoading ? (
                <CircularProgress className={clsx('circular-progress-bar', styles.progressBar)}/>
              ) : (primaryBtnText)}
            </Button>
          )}
        </div>
      </Paper>
    </Modal>
  )
}

export default React.memo(EASModal, areComponentPropsEqual);

EASModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'unset']),
  destroyBtnText: PropTypes.string,
  primaryBtnText: PropTypes.string,
  secondaryBtnText: PropTypes.string,
  hidePositiveBtn: PropTypes.bool,
  isDestroyLoading: PropTypes.bool,
  isPositiveLoading: PropTypes.bool,
  className: PropTypes.any,
  bodyStyle: PropTypes.any,
  children: PropTypes.any,
  note: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onClose: PropTypes.func.isRequired,
  onDestroyClick: PropTypes.any,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  onBackdropClick: PropTypes.func,
}

EASModal.defaultProps = {
  title: '',
  primaryBtnText: textForKey('OK'),
  secondaryBtnText: textForKey('Close'),
  size: 'unset'
}
