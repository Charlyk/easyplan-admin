import React from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import styles from './EASPersistentModal.module.scss';

const EASPersistentModal = ({ open, children }) => {
  return (
    <Modal open={open} className={styles.modalRoot}>
      <Paper className={styles.modalPaper}>{children}</Paper>
    </Modal>
  );
};

export default EASPersistentModal;
