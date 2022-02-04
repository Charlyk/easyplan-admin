import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { textForKey } from 'app/utils/localization';
import EASModal from '../EASModal';
import styles from './ConfirmationModal.module.scss';

const ConfirmationModal = ({
  show,
  title,
  message,
  isLoading,
  primaryBtnText = textForKey('Confirm'),
  onConfirm,
  onClose,
  secondaryBtnText = textForKey('cancel_schedule'),
}) => {
  return (
    <EASModal
      open={show}
      title={title}
      onClose={onClose}
      onPrimaryClick={isLoading ? () => null : onConfirm}
      onBackdropClick={onClose}
      onSecondaryClick={onClose}
      hidePositiveBtn={onConfirm == null}
      isPositiveLoading={isLoading}
      className={styles['confirmation-modal']}
      primaryBtnText={primaryBtnText}
      secondaryBtnText={secondaryBtnText}
      size='small'
    >
      <Box padding='16px'>
        <Typography className={styles.messageLabel}>{message}</Typography>
      </Box>
    </EASModal>
  );
};

export default ConfirmationModal;

ConfirmationModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  isLoading: PropTypes.bool,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
};

ConfirmationModal.defaultProps = {
  secondaryBtnText: textForKey('cancel_schedule'),
};
