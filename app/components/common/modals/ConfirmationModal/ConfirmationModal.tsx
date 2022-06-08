import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'react-polyglot';
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
  primaryBtnText,
  onConfirm,
  onClose,
  secondaryBtnText,
}) => {
  const textForKey = useTranslate();
  const [primaryButtonText] = useState(primaryBtnText ?? textForKey('confirm'));
  const [secondaryButtonText] = useState(
    secondaryBtnText ?? textForKey('cancel_schedule'),
  );

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
      primaryBtnText={primaryButtonText}
      secondaryBtnText={secondaryButtonText}
      size='small'
    >
      <Box padding='16px'>
        <Typography className={styles.messageLabel}>{message}</Typography>
      </Box>
    </EASModal>
  );
};

export default ConfirmationModal;
