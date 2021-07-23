import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Modal, Paper, Typography } from "@material-ui/core";

import IconClose from "../../../../../components/icons/iconClose";
import { textForKey } from "../../../../../utils/localization";
import styles from './EASModal.module.scss';
import clsx from "clsx";

const EASModal = ({ open, title, primaryBtnText, secondaryBtnText, bodyStyle, children, className, onClose, onPrimaryClick, onSecondaryClick }) => {
  const handlePrimaryClick = () => {
    if (typeof onPrimaryClick === 'function') {
      onPrimaryClick();
    } else {
      onClose();
    }
  }

  const handleSecondaryClick = () => {
    if (typeof onSecondaryClick === 'function') {
      onSecondaryClick();
    } else {
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      className={clsx(styles.modalRoot, className)}
      onBackdropClick={onClose}
    >
      <Paper className={styles.modalPaper}>
        <div className={styles.modalHeader}>
          <Typography className={styles.titleLabel}>
            {title}
          </Typography>
          <IconButton className={styles.closeButton} onPointerUp={onClose}>
            <IconClose/>
          </IconButton>
        </div>
        <div className={styles.modalBody} style={bodyStyle}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          <Button
            className={styles.secondaryButton}
            onPointerUp={handleSecondaryClick}
            variant='text'
          >
            {secondaryBtnText}
          </Button>
          <Button
            className={styles.primaryButton}
            onPointerUp={handlePrimaryClick}
            variant='text'
          >
            {primaryBtnText}
          </Button>
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
  className: PropTypes.any,
  bodyStyle: PropTypes.any,
  children: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
}

EASModal.defaultProps = {
  title: '',
  primaryBtnText: textForKey('OK'),
  secondaryBtnText: textForKey('Close'),
}
