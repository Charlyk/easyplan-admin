import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { textForKey } from 'app/utils/localization';
import EASModal from '../EASModal';
import styles from './ConfirmationModal.module.scss';

interface ConfirmationModalProps {
  show: boolean;
  title?: string;
  message?: string;
  isLoading?: boolean;
  primaryBtnText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  secondaryBtnText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
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
      onPrimaryClick={onConfirm}
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
