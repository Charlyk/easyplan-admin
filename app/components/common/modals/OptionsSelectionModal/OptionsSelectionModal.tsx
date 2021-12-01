import React from 'react';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import EASModal from '../EASModal';
import styles from './DoctorsSelectionModal.module.scss';

interface IdentifiableListableObject {
  id: number;
  fullName: string;
}

interface Props {
  doctors: IdentifiableListableObject[];
  show: boolean;
  primaryBtnText?: string;
  title: string;
  message?: string;
  destroyBtnText: string;
  onClose: () => void;
  onConfirm: () => void;
}

const OptionsSelectionModal: React.FC<Props> = ({
  doctors,
  show,
  primaryBtnText,
  destroyBtnText,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <EASModal
      className={styles.modalRoot}
      open={show}
      primaryBtnText={primaryBtnText}
      title={title}
      onPrimaryClick={onConfirm}
      onClose={onClose}
      onSecondaryClick={onClose}
      onBackdropClick={onClose}
      destroyBtnText={destroyBtnText}
      size='large'
    >
      <Typography className={styles.subHeading}>{message}</Typography>
    </EASModal>
  );
};

export default OptionsSelectionModal;
