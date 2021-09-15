import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import IconClose from "../../../icons/iconClose";
import { textForKey } from "../../../../../utils/localization";
import styles from './EASModal.module.scss';
import { CircularProgress } from "@material-ui/core";

const EASModal = (
  {
    open,
    title,
    primaryBtnText,
    secondaryBtnText,
    hidePositiveBtn,
    isPositiveLoading,
    bodyStyle,
    note,
    children,
    className,
    paperClass,
    onClose,
    onPrimaryClick,
    onSecondaryClick,
    onBackdropClick
  }
) => {
  const handleCloseModal = () => {
    if (isPositiveLoading) {
      return;
    }

    onClose?.();
  }

  const handlePrimaryClick = () => {
    if (typeof onPrimaryClick === 'function') {
      onPrimaryClick();
    } else {
      onClose?.()
    }
  };

  const handleSecondaryClick = () => {
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
  }

  return (
    <Modal
      open={open}
      className={clsx(styles.modalRoot, className)}
      onBackdropClick={handleBackdropClick}
    >
      <Paper className={clsx(styles.modalPaper, paperClass)}>
        <div className={styles.modalHeader}>
          <Typography className={styles.titleLabel} noWrap>
            {title}
          </Typography>
          <IconButton className={styles.closeButton} onPointerUp={handleCloseModal}>
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
              onPointerUp={handleSecondaryClick}
              variant='text'
            >
              {secondaryBtnText}
            </Button>
          )}
          {!hidePositiveBtn && (
            <Button
              className={styles.primaryButton}
              onPointerUp={handlePrimaryClick}
              variant='text'
            >
              {isPositiveLoading ? (
                <CircularProgress className='circular-progress-bar'/>
              ) : (primaryBtnText)}
            </Button>
          )}
        </div>
      </Paper>
    </Modal>
  )
}

export default EASModal;

EASModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  primaryBtnText: PropTypes.string,
  secondaryBtnText: PropTypes.string,
  hidePositiveBtn: PropTypes.bool,
  isPositiveLoading: PropTypes.bool,
  className: PropTypes.any,
  bodyStyle: PropTypes.any,
  children: PropTypes.any,
  note: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onClose: PropTypes.func.isRequired,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  onBackdropClick: PropTypes.func,
}

EASModal.defaultProps = {
  title: '',
  primaryBtnText: textForKey('OK'),
  secondaryBtnText: textForKey('Close'),
}
